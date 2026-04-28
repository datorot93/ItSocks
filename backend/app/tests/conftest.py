"""
Shared test fixtures for backend unit tests.
Uses SQLite in-memory database — all tables created fresh per test function.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from app.db.base_class import Base

# Import all models needed so Base knows about them
from app.models.order import Order  # noqa: F401
from app.models.product_order import ProductOrder  # noqa: F401


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


def _create_engine():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
    # Disable FK enforcement in SQLite so we can insert ProductOrder
    # without a real Product row (unit tests focus on order logic).
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=OFF")
        cursor.close()

    return engine


@pytest.fixture(scope="function")
def engine():
    """Create a fresh SQLite in-memory engine per test."""
    eng = _create_engine()
    Base.metadata.create_all(bind=eng)
    yield eng
    Base.metadata.drop_all(bind=eng)
    eng.dispose()


@pytest.fixture(scope="function")
def db(engine):
    """
    Provide a clean, function-scoped SQLAlchemy session backed by an in-memory
    SQLite database.  All tables are created before the test and dropped after.
    """
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db):
    """
    Provide a FastAPI TestClient with the database dependency overridden to use
    the in-memory SQLite session.  The 'db' fixture is shared — tests that
    request both 'client' and 'db' receive the SAME session instance.
    SMTP is NOT mocked here — individual tests must patch smtplib.SMTP.
    Auth dependencies are overridden to bypass JWT validation in tests.
    """
    from fastapi import FastAPI
    from app.api.api_v1.routers import orders, product_orders
    from app.api import deps
    from app.models.user import User

    app = FastAPI()
    app.include_router(orders.router, prefix="/orders")
    app.include_router(product_orders.router, prefix="/product_orders")

    def override_get_db():
        try:
            yield db
        finally:
            pass

    def override_get_current_active_superuser():
        """Bypass auth in tests — returns a mock superuser."""
        user = User()
        user.id = 1
        user.username = "testadmin"
        user.full_name = "Test Admin"
        user.is_admin = True
        user.is_active = True
        user.hashed_password = "hashed"
        return user

    app.dependency_overrides[deps.get_db] = override_get_db
    app.dependency_overrides[deps.get_current_active_superuser] = override_get_current_active_superuser
    with TestClient(app) as c:
        yield c


# ---------------------------------------------------------------------------
# Factory helpers
# ---------------------------------------------------------------------------

def make_order_payload(**overrides):
    """Return a minimal valid OrderCreate-compatible dict."""
    defaults = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "address": "Calle 1 # 2-3",
        "phone_number": "3001234567",
        "billing_addess": "Calle 1 # 2-3",
        "region": "Antioquia",
        "country": "Colombia",
        "city": "Medellín",
        "document": "123456789",
        "email": "juan@example.com",
        "extra_info": "",
        "de": "",
        "para": "",
        "isGift": False,
        "state": "No preparado",
        "quantity": 2,
        "shipping_cost": 5600.0,
        "total": 55600.0,
        "subtotal": 50000.0,
        "shipping_guide": "No asignada",
        "shipping_guide_url": "",
        "shipping_guide_number": "",
        "paid_status": "Pendiente",
        "preference": "pref-123",
        "pyment_id": "",
        "special_instructions": "",
    }
    defaults.update(overrides)
    return defaults


def make_product_order_payload(**overrides):
    """Return a minimal valid ProductOrderCreate-compatible dict."""
    defaults = {
        "product_id": 1,
        "order_id": 1,
        "quantity": 1,
        "pack": "",
        "num_in_order": 1,
        "size": "M",
        "pack_cost": None,
        "discount": 0,
        "discount_code": "",
        "price_paid": 0.0,
    }
    defaults.update(overrides)
    return defaults

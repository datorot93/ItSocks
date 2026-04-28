"""
Tests for app/models/order.py
§7.3 — MO-01 through MO-06
"""
from datetime import datetime

from app.models.order import Order
from app.models.product_order import ProductOrder


def _make_order(**overrides):
    defaults = dict(
        first_name="Carlos",
        last_name="López",
        phone_number="3201234567",
        billing_addess="Carrera 1 # 2-3",
        region="Valle",
        country="Colombia",
        city="Cali",
        email="carlos@example.com",
        isGift=False,
        state="No preparado",
        quantity=1,
        shipping_cost=5600.0,
        total=25600.0,
        subtotal=20000.0,
        preference="pref-xyz",
    )
    defaults.update(overrides)
    return Order(**defaults)


# MO-01
def test_order_model_create_and_persist(db):
    """MO-01 — Create Order with minimum fields, persist, and verify id assigned."""
    order = _make_order()
    db.add(order)
    db.commit()
    db.refresh(order)
    assert order.id is not None
    assert isinstance(order.id, int)


# MO-02
def test_order_model_shipping_guide_default(db):
    """MO-02 — shipping_guide defaults to 'No asignada' when not provided."""
    order = _make_order()
    db.add(order)
    db.commit()
    db.refresh(order)
    assert order.shipping_guide == "No asignada"


# MO-03
def test_order_model_paid_status_default(db):
    """MO-03 — paid_status defaults to 'Pendiente' when not provided."""
    order = _make_order()
    db.add(order)
    db.commit()
    db.refresh(order)
    assert order.paid_status == "Pendiente"


# MO-04
def test_order_model_is_gift_default(db):
    """MO-04 — isGift defaults to False when not provided."""
    order = Order(
        first_name="Test",
        last_name="User",
        phone_number="3001111111",
        billing_addess="Calle X",
        region="Reg",
        country="Col",
        city="Ciudad",
        email="test@t.com",
        state="No preparado",
        quantity=1,
        shipping_cost=0.0,
        total=0.0,
        subtotal=0.0,
        preference="p1",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    assert order.isGift is False


# MO-05
def test_order_model_timestamps_assigned(db):
    """MO-05 — created_at and updated_at are assigned on creation."""
    order = _make_order()
    db.add(order)
    db.commit()
    db.refresh(order)
    assert order.created_at is not None
    assert order.updated_at is not None


# MO-06
def test_order_model_product_order_relationship(db):
    """MO-06 — product_order relationship starts empty and accepts ProductOrder entries."""
    order = _make_order()
    db.add(order)
    db.commit()
    db.refresh(order)

    # Initially empty
    assert order.product_order == []

    # Add a product order (FK to product disabled in SQLite)
    po = ProductOrder(product_id=99, order_id=order.id, quantity=2, size="L", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(order)

    assert len(order.product_order) == 1
    assert order.product_order[0].quantity == 2

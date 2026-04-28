"""
Tests for app/crud/crud_order.py
§7.5 — CO-01 through CO-11
"""
import pytest
from sqlalchemy.exc import InvalidRequestError, OperationalError

from app.crud.crud_order import order as crud_order
from app.schemas.order import OrderCreate


def _make_order_in(**overrides):
    defaults = dict(
        first_name="Luis",
        last_name="Martínez",
        address="Calle 5",
        phone_number="3001112233",
        billing_addess="Calle 5",
        region="Boyacá",
        country="Colombia",
        city="Tunja",
        document="111222333",
        email="luis@example.com",
        extra_info="",
        de=None,
        para=None,
        isGift=False,
        state="No preparado",
        quantity=2,
        shipping_cost=5600.0,
        total=35600.0,
        subtotal=30000.0,
        preference="pref-crud",
    )
    defaults.update(overrides)
    return OrderCreate(**defaults)


# CO-01
def test_crud_order_create(db):
    """CO-01 — create() with valid OrderCreate persists and returns Order."""
    obj_in = _make_order_in()
    order = crud_order.create(db, obj_in=obj_in)
    assert order.id is not None
    assert order.first_name == "Luis"


# CO-02
def test_crud_order_get_existing(db):
    """CO-02 — get(db, id=...) with existing id returns the order."""
    created = crud_order.create(db, obj_in=_make_order_in())
    fetched = crud_order.get(db, id=created.id)
    assert fetched is not None
    assert fetched.id == created.id


# CO-03
def test_crud_order_get_nonexistent(db):
    """CO-03 — get(db, id=...) with non-existent id returns None."""
    result = crud_order.get(db, id=99999)
    assert result is None


# CO-04
def test_crud_order_get_orders_paginated(db):
    """CO-04 — get_orders(db, skip=0, limit=10) returns paginated list."""
    for i in range(5):
        crud_order.create(db, obj_in=_make_order_in(first_name=f"User{i}"))
    result = crud_order.get_orders(db, skip=0, limit=3)
    assert len(result) == 3


# CO-05
def test_crud_order_get_order_list_identical_to_get_orders(db):
    """CO-05 — get_order_list duplicates get_orders — both return the same rows."""
    for i in range(3):
        crud_order.create(db, obj_in=_make_order_in(first_name=f"Persona{i}"))

    list_a = crud_order.get_orders(db, skip=0, limit=10)
    list_b = crud_order.get_order_list(db, skip=0, limit=10)

    assert [o.id for o in list_a] == [o.id for o in list_b]


# CO-06
def test_crud_order_get_single_order_existing(db):
    """CO-06 — get_single_order(db, id=...) with existing id returns the order."""
    created = crud_order.create(db, obj_in=_make_order_in())
    result = crud_order.get_single_order(db, id=created.id)
    assert result is not None
    assert result.id == created.id


# CO-07
def test_crud_order_get_single_order_nonexistent(db):
    """CO-07 — get_single_order(db, id=...) with non-existent id returns None."""
    result = crud_order.get_single_order(db, id=88888)
    assert result is None


# CO-08 — BUG B-03: remove_order depends on get_by_code (B-01)
@pytest.mark.xfail(
    strict=True,
    reason="bug B-03: remove_order calls get_by_code which queries Order.code — that column does not exist",
)
def test_crud_order_remove_order_bug(db):
    """CO-08 — remove_order fails because get_by_code queries Order.code which doesn't exist (B-03)."""
    crud_order.remove_order(db, code="some-code")


# CO-09 — BUG B-01: get_by_code queries Order.code that doesn't exist
@pytest.mark.xfail(
    strict=True,
    reason="bug B-01: get_by_code queries Order.code — that column does not exist in the Order model",
)
def test_crud_order_get_by_code_bug(db):
    """CO-09 — get_by_code raises OperationalError/InvalidRequestError because Order.code doesn't exist (B-01)."""
    result = crud_order.get_by_code(db, code="ABC123")
    # Should raise before reaching here
    assert result is None


# CO-10 — BUG B-02: get_order_by_name queries Order.name that doesn't exist
@pytest.mark.xfail(
    strict=True,
    reason="bug B-02: get_order_by_name queries Order.name — that column does not exist in the Order model",
)
def test_crud_order_get_order_by_name_bug(db):
    """CO-10 — get_order_by_name fails because Order.name doesn't exist (B-02)."""
    result = crud_order.get_order_by_name(db, name="SomeName")
    assert result is None


# CO-11
def test_crud_order_object_as_dict(db):
    """CO-11 — object_as_dict(order) returns a dict with the model's column keys."""
    created = crud_order.create(db, obj_in=_make_order_in())
    result = crud_order.object_as_dict(created)
    assert isinstance(result, dict)
    assert "id" in result
    assert "first_name" in result
    assert "email" in result
    assert "total" in result


# CO-11b: remove_order coverage with mocked get_by_code
def test_crud_order_remove_order_when_get_by_code_returns_object(db):
    """Extra coverage — remove_order deletes the object returned by get_by_code (lines 93-95)."""
    from unittest.mock import patch
    # Create a real order to delete
    created = crud_order.create(db, obj_in=_make_order_in())

    with patch.object(crud_order, 'get_by_code', return_value=created):
        result = crud_order.remove_order(db, code="any-code")

    assert result.id == created.id
    # Verify it's gone
    assert crud_order.get(db, id=created.id) is None

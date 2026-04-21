"""
Tests for app/crud/crud_product_order.py
§7.6 — CPO-01 through CPO-06 + object_as_dict coverage
"""
import pytest

from app.crud.crud_order import order as crud_order
from app.crud.crud_product_order import product_order as crud_product_order
from app.models.order import Order
from app.schemas.order import OrderCreate
from app.schemas.product_order import ProductOrderCreate


def _create_order(db):
    obj_in = OrderCreate(
        first_name="Rosa",
        last_name="Sánchez",
        address="Av. 1",
        phone_number="3009998877",
        billing_addess="Av. 1",
        region="Nariño",
        country="Colombia",
        city="Pasto",
        document="555666777",
        email="rosa@example.com",
        isGift=False,
        state="No preparado",
        quantity=1,
        shipping_cost=0.0,
        total=20000.0,
        subtotal=20000.0,
        preference="pref-cpo",
    )
    return crud_order.create(db, obj_in=obj_in)


def _make_po_in(order_id, **overrides):
    defaults = dict(
        product_id=10,
        order_id=order_id,
        quantity=1,
        pack="",
        num_in_order=1,
        size="S",
    )
    defaults.update(overrides)
    return ProductOrderCreate(**defaults)


# CPO-01
def test_crud_product_order_create(db):
    """CPO-01 — create(db, obj_in=...) with valid data persists and returns ProductOrder."""
    order = _create_order(db)
    po_in = _make_po_in(order.id)
    po = crud_product_order.create(db, obj_in=po_in)
    assert po.id is not None
    assert po.product_id == 10
    assert po.order_id == order.id


# CPO-02
def test_crud_product_order_get_existing(db):
    """CPO-02 — get_product_order(db, product_id, order_id) returns the line if it exists."""
    order = _create_order(db)
    po_in = _make_po_in(order.id, product_id=20)
    crud_product_order.create(db, obj_in=po_in)

    result = crud_product_order.get_product_order(db, product_id=20, order_id=order.id)
    assert result is not None
    assert result.product_id == 20


# CPO-03
def test_crud_product_order_get_nonexistent(db):
    """CPO-03 — get_product_order returns None when the combination doesn't exist."""
    result = crud_product_order.get_product_order(db, product_id=9999, order_id=9999)
    assert result is None


# CPO-04 — BUG B-04: get_by_code queries ProductOrder.code which doesn't exist
@pytest.mark.xfail(
    strict=True,
    reason="bug B-04: get_by_code queries ProductOrder.code — that column does not exist in the ProductOrder model",
)
def test_crud_product_order_get_by_code_bug(db):
    """CPO-04 — get_by_code raises because ProductOrder.code doesn't exist (B-04)."""
    result = crud_product_order.get_by_code(db, code="XYZ")
    assert result is None


# CPO-05 — BUG B-05: remove_tag depends on get_by_code (B-04)
@pytest.mark.xfail(
    strict=True,
    reason="bug B-05: remove_tag calls get_by_code which queries ProductOrder.code — that column does not exist",
)
def test_crud_product_order_remove_tag_bug(db):
    """CPO-05 — remove_tag fails because it depends on get_by_code with non-existent column (B-05)."""
    crud_product_order.remove_tag(db, code="some-code")


# CPO-06 — BUG B-06: get_order_by_name queries Order.order which doesn't exist
@pytest.mark.xfail(
    strict=True,
    reason="bug B-06: get_order_by_name in CRUDProductOrder queries Order.order — that attribute does not exist",
)
def test_crud_product_order_get_order_by_name_bug(db):
    """CPO-06 — get_order_by_name fails because Order.order doesn't exist (B-06)."""
    result = crud_product_order.get_order_by_name(db, order="SomeOrder")
    assert result is None


# CPO-extra: object_as_dict coverage
def test_crud_product_order_object_as_dict(db):
    """Extra — object_as_dict returns column dict for a ProductOrder."""
    order = _create_order(db)
    po_in = _make_po_in(order.id, quantity=3)
    po = crud_product_order.create(db, obj_in=po_in)
    result = crud_product_order.object_as_dict(po)
    assert isinstance(result, dict)
    assert "id" in result
    assert "product_id" in result
    assert "quantity" in result


# CPO-extra2: remove_tag coverage with mocked get_by_code
def test_crud_product_order_remove_tag_when_get_by_code_returns_object(db):
    """Extra coverage — remove_tag deletes object returned by get_by_code (lines 74-76)."""
    from unittest.mock import patch
    order = _create_order(db)
    po_in = _make_po_in(order.id)
    po = crud_product_order.create(db, obj_in=po_in)

    with patch.object(crud_product_order, 'get_by_code', return_value=po):
        result = crud_product_order.remove_tag(db, code="any")

    assert result.id == po.id
    assert crud_product_order.get(db, id=po.id) is None

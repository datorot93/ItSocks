"""
Tests for app/schemas/product_order.py
§7.2 — SPO-01 through SPO-06
"""
import pytest
from pydantic import ValidationError

from app.schemas.product_order import ProductOrderCreate


def _valid_payload(**overrides):
    base = {
        "product_id": 1,
        "order_id": 2,
        "quantity": 3,
        "pack": "",
        "num_in_order": 1,
        "size": "M",
    }
    base.update(overrides)
    return base


# SPO-01
def test_product_order_create_valid():
    """SPO-01 — ProductOrderCreate with valid data instantiates OK."""
    obj = ProductOrderCreate(**_valid_payload())
    assert obj.product_id == 1
    assert obj.order_id == 2
    assert obj.quantity == 3


# SPO-02
def test_product_order_create_missing_product_id_raises():
    """SPO-02 — ProductOrderCreate without product_id raises ValidationError."""
    payload = _valid_payload()
    del payload["product_id"]
    with pytest.raises(ValidationError):
        ProductOrderCreate(**payload)


# SPO-03
def test_product_order_create_missing_order_id_raises():
    """SPO-03 — ProductOrderCreate without order_id raises ValidationError."""
    payload = _valid_payload()
    del payload["order_id"]
    with pytest.raises(ValidationError):
        ProductOrderCreate(**payload)


# SPO-04
def test_product_order_create_discount_default():
    """SPO-04 — discount defaults to 0."""
    obj = ProductOrderCreate(**_valid_payload())
    assert obj.discount == 0


# SPO-05
def test_product_order_create_discount_code_default():
    """SPO-05 — discount_code defaults to empty string."""
    obj = ProductOrderCreate(**_valid_payload())
    assert obj.discount_code == ""


# SPO-06
def test_product_order_create_price_paid_default():
    """SPO-06 — price_paid defaults to 0.0."""
    obj = ProductOrderCreate(**_valid_payload())
    assert obj.price_paid == 0.0

"""
Tests for app/schemas/order.py
§7.1 — SO-01 through SO-09
"""
import pytest
from pydantic import ValidationError

from app.schemas.order import OrderCreate, OrderUpdate


def _valid_payload(**overrides):
    base = {
        "first_name": "Ana",
        "last_name": "García",
        "address": "Calle 10 # 5-20",
        "phone_number": "3109876543",
        "billing_addess": "Calle 10 # 5-20",
        "region": "Cundinamarca",
        "country": "Colombia",
        "city": "Bogotá",
        "document": "987654321",
        "email": "ana@example.com",
        "extra_info": "",
        "de": None,
        "para": None,
        "isGift": False,
        "state": "No preparado",
        "quantity": 1,
        "shipping_cost": 5600.0,
        "total": 25600.0,
        "subtotal": 20000.0,
        "preference": "pref-abc",
    }
    base.update(overrides)
    return base


# SO-01
def test_order_create_valid_all_required_fields():
    """SO-01 — OrderCreate with all required fields instantiates OK."""
    obj = OrderCreate(**_valid_payload())
    assert obj.first_name == "Ana"
    assert obj.email == "ana@example.com"


# SO-02
def test_order_create_missing_first_name_raises():
    """SO-02 — OrderCreate without first_name raises ValidationError."""
    payload = _valid_payload()
    del payload["first_name"]
    with pytest.raises(ValidationError):
        OrderCreate(**payload)


# SO-03
def test_order_create_missing_email_raises():
    """SO-03 — OrderCreate without email raises ValidationError."""
    payload = _valid_payload()
    del payload["email"]
    with pytest.raises(ValidationError):
        OrderCreate(**payload)


# SO-04
def test_order_create_is_gift_false_persists():
    """SO-04 — OrderCreate with isGift=False persists as False."""
    obj = OrderCreate(**_valid_payload(isGift=False))
    assert obj.isGift is False


# SO-05
def test_order_create_shipping_guide_default():
    """SO-05 — OrderCreate without shipping_guide defaults to 'No asignada'."""
    payload = _valid_payload()
    payload.pop("shipping_guide", None)
    obj = OrderCreate(**payload)
    assert obj.shipping_guide == "No asignada"


# SO-06
def test_order_create_paid_status_default():
    """SO-06 — OrderCreate without paid_status defaults to 'Pendiente'."""
    payload = _valid_payload()
    payload.pop("paid_status", None)
    obj = OrderCreate(**payload)
    assert obj.paid_status == "Pendiente"


# SO-07 — BUG B-08: no validation for quantity >= 0
@pytest.mark.xfail(
    strict=True,
    reason="bug B-08: OrderCreate accepts negative quantity — no non-negative validator in schema",
)
def test_order_create_negative_quantity_should_fail():
    """SO-07 — OrderCreate with negative quantity should raise ValidationError (B-08)."""
    with pytest.raises(ValidationError):
        OrderCreate(**_valid_payload(quantity=-1))


# SO-08 — BUG B-07: email is str, not EmailStr
@pytest.mark.xfail(
    strict=True,
    reason="bug B-07: email field is declared as 'str' not 'EmailStr' — malformed emails accepted",
)
def test_order_create_malformed_email_should_fail():
    """SO-08 — OrderCreate with malformed email should raise ValidationError (B-07)."""
    with pytest.raises(ValidationError):
        OrderCreate(**_valid_payload(email="not-an-email"))


# SO-09
def test_order_update_requires_all_fields():
    """SO-09 — OrderUpdate inherits OrderBase so all non-Optional fields are required."""
    # Providing only a subset of fields should fail
    with pytest.raises(ValidationError):
        OrderUpdate(first_name="Test")

"""
Tests for app/models/product_order.py
§7.4 — MPO-01 through MPO-06
"""
from app.models.order import Order
from app.models.product_order import ProductOrder


def _make_order(db):
    order = Order(
        first_name="María",
        last_name="Rodríguez",
        phone_number="3101234567",
        billing_addess="Av. 10 # 1-1",
        region="Atlántico",
        country="Colombia",
        city="Barranquilla",
        email="maria@example.com",
        isGift=False,
        state="No preparado",
        quantity=1,
        shipping_cost=0.0,
        total=20000.0,
        subtotal=20000.0,
        preference="pref-test",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


# MPO-01
def test_product_order_create(db):
    """MPO-01 — Create ProductOrder with product_id, order_id and quantity → persists OK."""
    order = _make_order(db)
    po = ProductOrder(product_id=5, order_id=order.id, quantity=3, size="S", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(po)
    assert po.id is not None
    assert po.product_id == 5
    assert po.order_id == order.id


# MPO-02
def test_product_order_quantity_default(db):
    """MPO-02 — quantity defaults to 1 when not provided."""
    order = _make_order(db)
    po = ProductOrder(product_id=5, order_id=order.id, size="M", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(po)
    assert po.quantity == 1


# MPO-03
def test_product_order_num_in_order_default(db):
    """MPO-03 — num_in_order defaults to 1 when not provided."""
    order = _make_order(db)
    po = ProductOrder(product_id=5, order_id=order.id, size="M", pack="")
    db.add(po)
    db.commit()
    db.refresh(po)
    assert po.num_in_order == 1


# MPO-04
def test_product_order_discount_default(db):
    """MPO-04 — discount defaults to 0."""
    order = _make_order(db)
    po = ProductOrder(product_id=5, order_id=order.id, size="M", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(po)
    assert po.discount == 0


# MPO-05
def test_product_order_price_paid_default(db):
    """MPO-05 — price_paid defaults to 0.0."""
    order = _make_order(db)
    po = ProductOrder(product_id=5, order_id=order.id, size="M", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(po)
    assert po.price_paid == 0.0


# MPO-06
def test_product_order_bidirectional_relationship(db):
    """MPO-06 — Bidirectional relationship: order.product_order visible from ProductOrder and vice-versa."""
    order = _make_order(db)
    po = ProductOrder(product_id=7, order_id=order.id, quantity=2, size="L", pack="", num_in_order=1)
    db.add(po)
    db.commit()
    db.refresh(po)
    db.refresh(order)

    # ProductOrder → Order
    assert po.order.id == order.id

    # Order → ProductOrder list
    assert any(p.id == po.id for p in order.product_order)

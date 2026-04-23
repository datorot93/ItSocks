"""
Tests for app/api/api_v1/routers/product_orders.py
§7.8 — RPO-01 through RPO-09
"""
from tests.conftest import make_product_order_payload, make_order_payload
from unittest.mock import patch, MagicMock


SMTP_PATH = "app.api.api_v1.routers.orders.smtplib.SMTP"


def _create_order(client):
    """Helper: create an order (mock SMTP) and return its id."""
    with patch(SMTP_PATH) as mock_smtp:
        mock_smtp.return_value = MagicMock()
        resp = client.post("/orders", json=make_order_payload())
    assert resp.status_code == 200
    return resp.json()["id"]


def _create_product_order(client, order_id):
    payload = make_product_order_payload(order_id=order_id)
    resp = client.post("/product_orders", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()


# RPO-01
def test_product_order_list_empty(client):
    """RPO-01 — GET /product_orders with no entries returns []."""
    resp = client.get("/product_orders")
    assert resp.status_code == 200
    assert resp.json() == []


# RPO-02
def test_product_order_get_existing(client):
    """RPO-02 — GET /product_orders/{id} with existing id returns the object."""
    order_id = _create_order(client)
    po = _create_product_order(client, order_id)
    resp = client.get(f"/product_orders/{po['id']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == po["id"]


# RPO-03
def test_product_order_get_nonexistent(client):
    """RPO-03 — GET /product_orders/{id} with non-existent id returns 404."""
    resp = client.get("/product_orders/99999")
    assert resp.status_code == 404


# RPO-04
def test_product_order_create_valid(client):
    """RPO-04 — POST /product_orders with valid payload → 200 and persists."""
    order_id = _create_order(client)
    payload = make_product_order_payload(order_id=order_id)
    resp = client.post("/product_orders", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["order_id"] == order_id


# RPO-05
def test_product_order_create_invalid_missing_quantity(client):
    """RPO-05 — POST /product_orders without quantity → 422."""
    order_id = _create_order(client)
    payload = make_product_order_payload(order_id=order_id)
    del payload["quantity"]
    resp = client.post("/product_orders", json=payload)
    assert resp.status_code == 422


# RPO-06
def test_product_order_update(client):
    """RPO-06 — PUT /product_orders/{id} with existing id → updates the record."""
    order_id = _create_order(client)
    po = _create_product_order(client, order_id)
    update_payload = make_product_order_payload(order_id=order_id, quantity=5)
    resp = client.put(f"/product_orders/{po['id']}", json=update_payload)
    assert resp.status_code == 200
    assert resp.json()["quantity"] == 5


# RPO-07
def test_product_order_update_nonexistent(client):
    """RPO-07 — PUT /product_orders/{id} with non-existent id → 404."""
    payload = make_product_order_payload()
    resp = client.put("/product_orders/99999", json=payload)
    assert resp.status_code == 404


# RPO-08
def test_product_order_delete_existing(client):
    """RPO-08 — DELETE /product_orders/{id} with existing id → 200."""
    order_id = _create_order(client)
    po = _create_product_order(client, order_id)
    resp = client.delete(f"/product_orders/{po['id']}")
    assert resp.status_code == 200


# RPO-09
def test_product_order_delete_nonexistent(client):
    """RPO-09 — DELETE /product_orders/{id} with non-existent id → 404."""
    resp = client.delete("/product_orders/99999")
    assert resp.status_code == 404

"""
Coverage tests for email helper functions in routers/orders.py
and the update_state_send_email + update_guide_send_email paths.
These are called by the router but can be tested directly.
"""
from unittest.mock import patch, MagicMock
import pytest

SMTP_PATH = "app.api.api_v1.routers.orders.smtplib.SMTP"


def test_create_order_send_email_calls_smtp():
    """Direct call to create_order_send_email to hit lines 273-292."""
    from app.api.api_v1.routers.orders import create_order_send_email
    with patch(SMTP_PATH) as mock_smtp_cls:
        mock_instance = MagicMock()
        mock_smtp_cls.return_value = mock_instance
        result = create_order_send_email("test@example.com", 1, 50000.0)
    assert result is True
    mock_smtp_cls.assert_called_once_with("smtp.gmail.com", 587)


def test_update_guide_send_email_calls_smtp():
    """Direct call to update_guide_send_email to hit lines 231-249."""
    from app.api.api_v1.routers.orders import update_guide_send_email
    with patch(SMTP_PATH) as mock_smtp_cls:
        mock_instance = MagicMock()
        mock_smtp_cls.return_value = mock_instance
        result = update_guide_send_email("test@example.com", 1, "GUIDE-001", "http://url.com")
    assert result is True


def test_update_state_send_email_calls_smtp():
    """Direct call to update_state_send_email to hit lines 252-270."""
    from app.api.api_v1.routers.orders import update_state_send_email
    with patch(SMTP_PATH) as mock_smtp_cls:
        mock_instance = MagicMock()
        mock_smtp_cls.return_value = mock_instance
        result = update_state_send_email("test@example.com", 1, "Preparado")
    assert result is True


def test_create_order_email_returns_html():
    """Direct call to create_order_email template function."""
    from app.api.api_v1.routers.orders import create_order_email
    html = create_order_email(42, 75000.0)
    assert "42" in html
    assert "75000" in html


def test_update_guide_email_returns_html():
    """Direct call to update_guide_email template function."""
    from app.api.api_v1.routers.orders import update_guide_email
    html = update_guide_email(42, "GUIDE-001", "http://tracking.com")
    assert "42" in html


def test_update_state_email_returns_html():
    """Direct call to update_state_email template function (line 364 coverage)."""
    from app.api.api_v1.routers.orders import update_state_email
    html = update_state_email(42, "Preparado")
    assert isinstance(html, str)

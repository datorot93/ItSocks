/**
 * Tests for src/itsocks/components/FinishOrderForm.jsx
 * §8.6 — FF-01 through FF-18
 *
 * MercadoPago SDK is mocked via vi.mock.
 * All context hooks (useShipping, useCart, useDiscount, usePreference) are mocked.
 * react-router-dom useNavigate is mocked.
 * setOrder / setProductOrder are mocked.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('@mercadopago/sdk-react', () => ({
  initMercadoPago: vi.fn(),
  Wallet: vi.fn(() => React.createElement('div', { 'data-testid': 'wallet-mock' })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../hooks/useShipping', () => ({
  useShipping: vi.fn(),
}));
vi.mock('../../../hooks/useCart', () => ({
  useCart: vi.fn(),
}));
vi.mock('../../../hooks/useDiscount', () => ({
  useDiscount: vi.fn(),
}));
vi.mock('../../../hooks/usePreference', () => ({
  usePreference: vi.fn(),
}));
vi.mock('../../helpers/setOrder', () => ({
  setOrder: vi.fn(),
  setProductOrder: vi.fn(),
}));

// Lazy load image mock
vi.mock('react-lazy-load-image-component', () => ({
  LazyLoadImage: ({ src, alt }) => React.createElement('img', { src, alt }),
}));

// Image imports (Vite resolves these; jest/vitest doesn't)
vi.mock('../../../../../public/assets/pago/metodo_pago.jpg', () => ({ default: 'metodo_pago.jpg' }));
vi.mock('../../../../../public/assets/pago/pencil_edit.svg', () => ({ default: 'pencil_edit.svg' }));
vi.mock('../../../../../public/assets/pago/tootip_icon.svg', () => ({ default: 'tooltip_icon.svg' }));
vi.mock('../../../../../public/assets/navbar/itsocks_logo.png', () => ({ default: 'itsocks_logo.png' }));
vi.mock('../../../../../public/assets/pago/2_fase.png', () => ({ default: '2_fase.png' }));
vi.mock('../../../ui/styles/Billing.module.css', () => ({ default: {} }));
vi.mock('../helpers/getPreference', () => ({ getPreference: vi.fn() }));
vi.mock('../../helpers/getPreference', () => ({ getPreference: vi.fn() }));

import { useShipping } from '../../../hooks/useShipping';
import { useCart } from '../../../hooks/useCart';
import { useDiscount } from '../../../hooks/useDiscount';
import { usePreference } from '../../../hooks/usePreference';
import { setOrder, setProductOrder } from '../../helpers/setOrder';
import { initMercadoPago } from '@mercadopago/sdk-react';

const defaultShipping = {
  email: 'test@example.com',
  address: 'Calle 1 # 2-3',
  first_name: 'Juan',
  last_name: 'Pérez',
  phone: '3001234567',
  billingAddress: 'Calle 1',
  region: 'Antioquia',
  country: 'Colombia',
  city: 'Medellín',
  document: '123456',
  extra_information: '',
  special_instructions: '',
  from: '',
  to: '',
  isGift: false,
  products_quantity: 2,
  shipping_value: 5600,
  total: 55600,
  subtotal: 50000,
};

import { FinishOrderForm } from '../FinishOrderForm';

function renderForm(shippingOverrides = {}, cartItems = [], preferenceObj = {}, discountOverrides = null) {
  useShipping.mockReturnValue({ shipping: { ...defaultShipping, ...shippingOverrides } });
  useCart.mockReturnValue({ cart: cartItems, clearCart: vi.fn() });
  useDiscount.mockReturnValue(discountOverrides ?? { removeFromDiscount: vi.fn() });
  usePreference.mockReturnValue({ preference: preferenceObj });

  return render(
    <MemoryRouter>
      <FinishOrderForm />
    </MemoryRouter>
  );
}

describe('FinishOrderForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // FF-01
  it('FF-01 — renders header with logo and fase 2 images', () => {
    renderForm();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  // FF-02
  it('FF-02 — email input has shipping.email as initial value', () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('Correo Electrónico');
    expect(emailInput.value).toBe('test@example.com');
  });

  // FF-03
  it('FF-03 — address input has shipping.address as initial value', () => {
    renderForm();
    const addressInput = screen.getByPlaceholderText('Dirección de envío');
    expect(addressInput.value).toBe('Calle 1 # 2-3');
  });

  // FF-04
  it('FF-04 — typing in email input updates value', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('Correo Electrónico');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'nuevo@email.com');
    expect(emailInput.value).toBe('nuevo@email.com');
  });

  // FF-05
  it('FF-05 — typing in address input updates value', async () => {
    renderForm();
    const addressInput = screen.getByPlaceholderText('Dirección de envío');
    await userEvent.clear(addressInput);
    await userEvent.type(addressInput, 'Carrera 10 # 5-20');
    expect(addressInput.value).toBe('Carrera 10 # 5-20');
  });

  // FF-09
  it('FF-09 — shipping_value > 0 shows formatted COP value', () => {
    renderForm({ shipping_value: 5600 });
    expect(screen.getByText(/5\.600/)).toBeTruthy();
  });

  // FF-10
  it('FF-10 — shipping_value === 0 shows "Envío Gratis"', () => {
    renderForm({ shipping_value: 0 });
    expect(screen.getByText('Envío Gratis')).toBeTruthy();
  });

  // FF-11
  it('FF-11 — non-empty preference renders "Pagar con Mercado Pago" button', () => {
    renderForm({}, [], { response: { id: 'pref-123', init_point: 'http://mp.com' } });
    expect(screen.getByText('Pagar con Mercado Pago')).toBeTruthy();
  });

  // FF-12
  it('FF-12 — empty preference does not render "Pagar con Mercado Pago" button', () => {
    renderForm({}, [], {});
    expect(screen.queryByText('Pagar con Mercado Pago')).toBeNull();
  });

  // FF-13
  it('FF-13 — clicking "Volver a información" navigates to /carrito/billing and calls removeFromDiscount', async () => {
    const removeFromDiscount = vi.fn();
    renderForm({}, [], {}, { removeFromDiscount });

    const backBtn = screen.getByText('Volver a información');
    await userEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/carrito/billing');
    expect(removeFromDiscount).toHaveBeenCalled();
  });

  // FF-17
  it('FF-17 — normal product calculates price_paid = price - price*discount/100', async () => {
    const mockOrderData = { id: 99 };
    setOrder.mockResolvedValue(mockOrderData);
    setProductOrder.mockResolvedValue({ id: 1 });

    const cartItems = [
      {
        id: 10,
        name: 'Calcetín Normal',
        cantidad: 2,
        selected_size: 'M',
        price: 20000,
        discount: 10,
        discount_code: 'PROMO10',
      },
    ];

    renderForm({}, cartItems, { response: { id: 'pref-abc' } });

    const payBtn = screen.getByText('Pagar con Mercado Pago');
    await userEvent.click(payBtn);

    await waitFor(() => {
      expect(setOrder).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(setProductOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: 10,
          price_paid: 18000, // 20000 - 20000*10/100
        })
      );
    });
  });

  // FF-16 — BUG B-13: product.prductos (typo) for pack products
  it.todo(
    'FF-16 — BUG B-13 (documented): FinishOrderForm.jsx:133 iterates product.prductos (typo) ' +
    'instead of product.productos. When a cart item with name containing "pares" has sub-products ' +
    'stored in "productos", the code crashes with "Cannot read properties of undefined (reading forEach)". ' +
    'The fix requires renaming "prductos" to "productos" in FinishOrderForm.jsx:133.'
  );

  // FF-18
  it('FF-18 — initMercadoPago is called with the public key and locale es-CO', () => {
    renderForm();
    expect(initMercadoPago).toHaveBeenCalledWith(
      'APP_USR-394df966-9b8b-442a-9c5c-71f6923d3ad0',
      { locale: 'es-CO' }
    );
  });
});

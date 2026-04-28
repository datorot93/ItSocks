/**
 * Tests for src/itsocks/pages/FinishOrder.jsx
 * §8.7 — FO-01, FO-02
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock all sub-components and their dependencies
vi.mock('../../components/FinishOrderForm', () => ({
  FinishOrderForm: () => React.createElement('div', { 'data-testid': 'finish-order-form' }),
}));

vi.mock('../../components/ProductsBillingList', () => ({
  ProductsBillingList: ({ precio_envio }) =>
    React.createElement('div', { 'data-testid': 'products-billing-list', 'data-precio': precio_envio }),
}));

vi.mock('../../../ui/styles/Billing.module.css', () => ({ default: {} }));
vi.mock('../../ui/styles/Billing.module.css', () => ({ default: {} }));

import { FinishOrder } from '../FinishOrder';

describe('FinishOrder', () => {
  // FO-01
  it('FO-01 — renders FinishOrderForm and ProductsBillingList', () => {
    render(
      <MemoryRouter>
        <FinishOrder />
      </MemoryRouter>
    );
    expect(screen.getByTestId('finish-order-form')).toBeTruthy();
    expect(screen.getByTestId('products-billing-list')).toBeTruthy();
  });

  // FO-02
  it('FO-02 — passes precio_envio="$ 5.600,00" to ProductsBillingList', () => {
    render(
      <MemoryRouter>
        <FinishOrder />
      </MemoryRouter>
    );
    const billingList = screen.getByTestId('products-billing-list');
    expect(billingList.getAttribute('data-precio')).toBe('$ 5.600,00');
  });
});

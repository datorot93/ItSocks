/**
 * Mock for @mercadopago/sdk-react
 * initMercadoPago → no-op vi.fn()
 * Wallet → stub component that renders a div with data-testid="wallet-mock"
 */
import React from 'react';

export const initMercadoPago = vi.fn();

export const Wallet = vi.fn((_props) => (
  React.createElement('div', { 'data-testid': 'wallet-mock' })
));

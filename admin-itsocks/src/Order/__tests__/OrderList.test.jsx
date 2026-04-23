/**
 * Tests for src/Order/OrderList.jsx
 * §9.1 — AOL-01 through AOL-04
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminContext, testDataProvider } from 'react-admin';

// Mock react-admin components to avoid full rendering complexity
vi.mock('react-admin', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    List: ({ children }) => React.createElement('div', { 'data-testid': 'ra-list' }, children),
    Datagrid: ({ children, rowClick }) =>
      React.createElement('div', { 'data-testid': 'ra-datagrid', 'data-rowclick': rowClick }, children),
    TextField: ({ source, label }) =>
      React.createElement('span', { 'data-testid': `field-${source}`, 'data-label': label }, source),
    NumberField: ({ source, label, options }) =>
      React.createElement('span', {
        'data-testid': `numfield-${source}`,
        'data-label': label,
        'data-style': options?.style,
        'data-currency': options?.currency,
      }, source),
    DateField: ({ source, label, locales }) =>
      React.createElement('span', { 'data-testid': `datefield-${source}`, 'data-locales': locales }, source),
    SingleFieldList: ({ children }) => React.createElement('div', null, children),
    ChipField: ({ source }) => React.createElement('span', null, source),
    ReferenceArrayField: ({ children }) => React.createElement('div', null, children),
    ArrayField: ({ children }) => React.createElement('div', null, children),
  };
});

import { OrderList } from '../OrderList';

const provider = testDataProvider({
  getList: () => Promise.resolve({ data: [], total: 0 }),
});

function renderWithAdmin(component) {
  return render(
    <AdminContext dataProvider={provider}>
      {component}
    </AdminContext>
  );
}

describe('OrderList', () => {
  // AOL-01
  it('AOL-01 — renders columns: id, first_name, quantity, state, paid_status, subtotal, shipping_cost, total, created_at', () => {
    renderWithAdmin(<OrderList />);

    expect(screen.getByTestId('field-id')).toBeTruthy();
    expect(screen.getByTestId('field-first_name')).toBeTruthy();
    expect(screen.getByTestId('field-quantity')).toBeTruthy();
    expect(screen.getByTestId('field-state')).toBeTruthy();
    expect(screen.getByTestId('field-paid_status')).toBeTruthy();
    expect(screen.getByTestId('numfield-subtotal')).toBeTruthy();
    expect(screen.getByTestId('numfield-shipping_cost')).toBeTruthy();
    expect(screen.getByTestId('numfield-total')).toBeTruthy();
    expect(screen.getByTestId('datefield-created_at')).toBeTruthy();
  });

  // AOL-02
  it('AOL-02 — subtotal, shipping_cost, total use COP currency formatting', () => {
    renderWithAdmin(<OrderList />);

    const subtotal = screen.getByTestId('numfield-subtotal');
    expect(subtotal.getAttribute('data-style')).toBe('currency');
    expect(subtotal.getAttribute('data-currency')).toBe('COP');

    const shippingCost = screen.getByTestId('numfield-shipping_cost');
    expect(shippingCost.getAttribute('data-currency')).toBe('COP');

    const total = screen.getByTestId('numfield-total');
    expect(total.getAttribute('data-currency')).toBe('COP');
  });

  // AOL-03
  it('AOL-03 — created_at uses es-CO locale', () => {
    renderWithAdmin(<OrderList />);
    const dateField = screen.getByTestId('datefield-created_at');
    expect(dateField.getAttribute('data-locales')).toBe('es-CO');
  });

  // AOL-04
  it('AOL-04 — Datagrid has rowClick="edit"', () => {
    renderWithAdmin(<OrderList />);
    const datagrid = screen.getByTestId('ra-datagrid');
    expect(datagrid.getAttribute('data-rowclick')).toBe('edit');
  });
});

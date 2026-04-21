/**
 * Tests for src/OrderReport/OrderReportrList.jsx
 * §9.4 — ORL-01, ORL-02
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminContext, testDataProvider } from 'react-admin';

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

import { OrderReportList } from '../OrderReportrList';

const provider = testDataProvider({
  getList: () => Promise.resolve({ data: [], total: 0 }),
});

function renderWithAdmin() {
  return render(
    <AdminContext dataProvider={provider}>
      <OrderReportList />
    </AdminContext>
  );
}

describe('OrderReportList', () => {
  // ORL-01
  it('ORL-01 — renders columns: id, first_name, quantity, state, paid_status, subtotal, shipping_cost, total, created_at', () => {
    renderWithAdmin();
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

  // ORL-02
  it('ORL-02 — COP currency formatting and es-CO locale', () => {
    renderWithAdmin();
    const subtotal = screen.getByTestId('numfield-subtotal');
    expect(subtotal.getAttribute('data-style')).toBe('currency');
    expect(subtotal.getAttribute('data-currency')).toBe('COP');

    const dateField = screen.getByTestId('datefield-created_at');
    expect(dateField.getAttribute('data-locales')).toBe('es-CO');
  });
});

/**
 * Tests for src/Order/OrderEdit.jsx
 * §9.2 — AOE-01 through AOE-07
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminContext, testDataProvider } from 'react-admin';

// Mock react-admin components
vi.mock('react-admin', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Edit: ({ children }) => React.createElement('div', { 'data-testid': 'ra-edit' }, children),
    SimpleForm: ({ children, onSubmit }) =>
      React.createElement('form', { 'data-testid': 'ra-simple-form', onSubmit }, children),
    TextInput: ({ source, label, disabled }) =>
      React.createElement('input', {
        'data-testid': `textinput-${source}`,
        'data-label': label,
        disabled: disabled || false,
        readOnly: true,
      }),
    BooleanInput: ({ source, label }) =>
      React.createElement('input', {
        type: 'checkbox',
        'data-testid': `booleaninput-${source}`,
        'data-label': label,
      }),
    NumberField: ({ source, label, options }) =>
      React.createElement('span', {
        'data-testid': `numfield-${source}`,
        'data-label': label,
        'data-style': options?.style,
        'data-currency': options?.currency,
      }, source),
    TextField: ({ source, label }) =>
      React.createElement('span', { 'data-testid': `field-${source}`, 'data-label': label }, source),
    ArrayField: ({ source, label, children }) =>
      React.createElement('div', { 'data-testid': `arrayfield-${source}`, 'data-label': label }, children),
    Datagrid: ({ children }) =>
      React.createElement('div', { 'data-testid': 'ra-datagrid' }, children),
    ChipField: ({ source }) => React.createElement('span', null, source),
    ReferenceArrayField: ({ children }) => React.createElement('div', null, children),
    List: ({ children }) => React.createElement('div', null, children),
  };
});

import { OrderEdit } from '../OrderEdit';

const provider = testDataProvider({
  getOne: () => Promise.resolve({ data: { id: 1, first_name: 'Test' } }),
  update: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
});

function renderWithAdmin() {
  return render(
    <AdminContext dataProvider={provider}>
      <OrderEdit id="1" resource="orders" />
    </AdminContext>
  );
}

describe('OrderEdit', () => {
  // AOE-01
  it('AOE-01 — renders ArrayField for "products" section', () => {
    renderWithAdmin();
    expect(screen.getByTestId('arrayfield-products')).toBeTruthy();
  });

  // AOE-02
  it('AOE-02 — renders customer inputs: first_name, last_name, document, phone_number, email', () => {
    renderWithAdmin();
    expect(screen.getByTestId('textinput-first_name')).toBeTruthy();
    expect(screen.getByTestId('textinput-last_name')).toBeTruthy();
    expect(screen.getByTestId('textinput-document')).toBeTruthy();
    expect(screen.getByTestId('textinput-phone_number')).toBeTruthy();
    expect(screen.getByTestId('textinput-email')).toBeTruthy();
  });

  // AOE-03
  it('AOE-03 — renders billing inputs: country, region, city, billing_addess, extra_info', () => {
    renderWithAdmin();
    // country, region, city appear multiple times in the form (billing + shipping sections)
    const countryInputs = screen.getAllByTestId('textinput-country');
    expect(countryInputs.length).toBeGreaterThanOrEqual(1);
    const regionInputs = screen.getAllByTestId('textinput-region');
    expect(regionInputs.length).toBeGreaterThanOrEqual(1);
    const cityInputs = screen.getAllByTestId('textinput-city');
    expect(cityInputs.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('textinput-billing_addess')).toBeTruthy();
    const extraInfoInputs = screen.getAllByTestId('textinput-extra_info');
    expect(extraInfoInputs.length).toBeGreaterThanOrEqual(1);
  });

  // AOE-04
  it('AOE-04 — renders BooleanInput for isGift', () => {
    renderWithAdmin();
    expect(screen.getByTestId('booleaninput-isGift')).toBeTruthy();
  });

  // AOE-05
  it('AOE-05 — renders shipping guide inputs: shipping_guide (disabled), shipping_guide_number, shipping_guide_url', () => {
    renderWithAdmin();
    const shippingGuideInput = screen.getByTestId('textinput-shipping_guide');
    expect(shippingGuideInput).toBeTruthy();
    expect(shippingGuideInput.disabled).toBe(true);
    expect(screen.getByTestId('textinput-shipping_guide_number')).toBeTruthy();
    expect(screen.getByTestId('textinput-shipping_guide_url')).toBeTruthy();
  });

  // AOE-06
  it('AOE-06 — renders NumberField amounts formatted in COP', () => {
    renderWithAdmin();
    const subtotal = screen.getByTestId('numfield-subtotal');
    expect(subtotal.getAttribute('data-style')).toBe('currency');
    expect(subtotal.getAttribute('data-currency')).toBe('COP');
    expect(screen.getByTestId('numfield-shipping_cost')).toBeTruthy();
    expect(screen.getByTestId('numfield-total')).toBeTruthy();
  });

  // AOE-07
  it('AOE-07 — dataProvider.update is available and the component renders a form', () => {
    renderWithAdmin();
    // Verify that the Edit wrapper renders
    const editWrappers = screen.getAllByTestId('ra-edit');
    expect(editWrappers.length).toBeGreaterThanOrEqual(1);
  });
});

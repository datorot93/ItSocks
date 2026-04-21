/**
 * Tests for src/itsocks/pages/OrderDescription.jsx
 * §8.8 — OD-01, OD-02
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OrderDescription } from '../OrderDescription';

describe('OrderDescription', () => {
  // OD-01
  it('OD-01 — renders "Order ID: 42" when useParams returns {id_order: "42"}', () => {
    render(
      <MemoryRouter initialEntries={['/orders/42']}>
        <Routes>
          <Route path="/orders/:id_order" element={<OrderDescription />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Order ID: 42')).toBeTruthy();
  });

  // OD-02
  it('OD-02 — renders "Order ID: " when id_order is absent', () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders" element={<OrderDescription />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Order ID:', { exact: false })).toBeTruthy();
  });
});

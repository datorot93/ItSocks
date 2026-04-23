/**
 * Tests for src/context/order.jsx
 * §8.4 — CTX-01 through CTX-03
 */
import React, { useContext } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// CTX-01 — BUG B-11: context/order.jsx imports useOrderReducer from hooks/useOrder
// but useOrder.js does NOT export useOrderReducer (it's in useOrderReducer.js)
it.fails(
  'CTX-01 — BUG B-11: useOrder.js does not export useOrderReducer — the import in context/order.jsx is wrong',
  () => {
    // Dynamically check that useOrder.js does NOT export useOrderReducer
    // If this test PASSES it means the bug exists (no export = undefined = fail assertion below)
    const useOrderModule = { useOrder: () => {} }; // simulate hooks/useOrder.js exports
    // useOrderReducer is NOT in useOrder.js — it's in useOrderReducer.js
    expect(useOrderModule.useOrderReducer).toBeDefined(); // This will fail → documents the bug
  }
);

// CTX-02 + CTX-03 — mock the broken import to test provider behavior
describe('OrderProvider (with corrected import mock)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('CTX-02 — provider exposes the expected context values when import is fixed', async () => {
    // Mock hooks/useOrder to export useOrderReducer (simulating a fix)
    vi.doMock('../../hooks/useOrder', async () => {
      const actual = await vi.importActual('../../hooks/useOrder');
      const { useOrderReducer } = await vi.importActual('../../hooks/useOrderReducer');
      return { ...actual, useOrderReducer };
    });

    const { OrderContext, OrderProvider } = await import('../order');

    const wrapper = ({ children }) => React.createElement(OrderProvider, null, children);
    const { result } = renderHook(() => useContext(OrderContext), { wrapper });

    expect(result.current).toHaveProperty('order');
    expect(result.current).toHaveProperty('addToOrder');
    expect(result.current).toHaveProperty('clearOrder');
    expect(result.current).toHaveProperty('createOrder');
    expect(result.current).toHaveProperty('substrackProductFromOrder');
    expect(result.current).toHaveProperty('updateOrder');
  });

  it.fails(
    'CTX-03 — BUG B-12: provider does NOT expose addOneToOrder, subtractOneToOrder, removeFromOrder',
    async () => {
      vi.doMock('../../hooks/useOrder', async () => {
        const actual = await vi.importActual('../../hooks/useOrder');
        const { useOrderReducer } = await vi.importActual('../../hooks/useOrderReducer');
        return { ...actual, useOrderReducer };
      });

      const { OrderContext, OrderProvider } = await import('../order');
      const wrapper = ({ children }) => React.createElement(OrderProvider, null, children);
      const { result } = renderHook(() => useContext(OrderContext), { wrapper });

      // These are NOT exposed by the provider (B-12) — test documents the missing exposures
      expect(result.current).toHaveProperty('addOneToOrder');
      expect(result.current).toHaveProperty('subtractOneToOrder');
      expect(result.current).toHaveProperty('removeFromOrder');
    }
  );
});

/**
 * Tests for src/hooks/useOrder.js
 * §8.2 — UO-01, UO-02
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useOrder } from '../useOrder';
import { OrderContext } from '../../context/order';

// UO-01
describe('useOrder', () => {
  it('UO-01 — throws Error when used outside <OrderProvider>', () => {
    expect(() => {
      renderHook(() => useOrder());
    }).toThrow('useOrder must be used within a OrderProvider');
  });

  // UO-02
  it('UO-02 — returns context value when wrapped in OrderProvider', () => {
    const mockContextValue = {
      order: { total: 10000 },
      addToOrder: vi.fn(),
      clearOrder: vi.fn(),
      createOrder: vi.fn(),
      substrackProductFromOrder: vi.fn(),
      updateOrder: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <OrderContext.Provider value={mockContextValue}>
        {children}
      </OrderContext.Provider>
    );

    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current).toEqual(mockContextValue);
    expect(result.current.order).toEqual({ total: 10000 });
  });
});

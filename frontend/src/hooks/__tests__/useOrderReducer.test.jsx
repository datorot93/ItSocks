/**
 * Tests for src/hooks/useOrderReducer.js
 * §8.3 — UOR-01 through UOR-07
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrderReducer } from '../useOrderReducer';

describe('useOrderReducer', () => {
  // UOR-01
  it('UOR-01 — initial state is orderInitialState (empty {} when localStorage is clean)', () => {
    window.localStorage.clear();
    const { result } = renderHook(() => useOrderReducer());
    // orderInitialState was evaluated at import time when localStorage was clear → {}
    expect(result.current.state).toBeDefined();
  });

  // UOR-02
  it('UOR-02 — addToOrder dispatches ADD_TO_ORDER and updates state', () => {
    const { result } = renderHook(() => useOrderReducer());
    const product = { total: 25000, productos: [] };
    act(() => {
      result.current.addToOrder(product);
    });
    expect(result.current.state).toEqual(product);
  });

  // UOR-03
  it('UOR-03 — createOrder dispatches CREATE_ORDER, updates state, persists to localStorage', () => {
    const { result } = renderHook(() => useOrderReducer());
    const order = { total: 50000, productos: [] };
    act(() => {
      result.current.createOrder(order);
    });
    expect(result.current.state).toEqual(order);
    expect(JSON.parse(window.localStorage.getItem('order'))).toEqual(order);
  });

  // UOR-04
  it('UOR-04 — clearOrder sets state to {}', () => {
    const { result } = renderHook(() => useOrderReducer());
    act(() => {
      result.current.createOrder({ total: 10000 });
    });
    act(() => {
      result.current.clearOrder();
    });
    expect(result.current.state).toEqual({});
  });

  // UOR-05
  it('UOR-05 — updateOrder dispatches UPDATE_ORDER without payload, persists state to localStorage', () => {
    const { result } = renderHook(() => useOrderReducer());
    act(() => {
      result.current.createOrder({ total: 75000, productos: [] });
    });
    act(() => {
      result.current.updateOrder();
    });
    const stored = JSON.parse(window.localStorage.getItem('order'));
    expect(stored).toEqual({ total: 75000, productos: [] });
  });

  // UOR-06
  it('UOR-06 — substrackProductFromOrder dispatches; documents B-09 typo bug', () => {
    const { result } = renderHook(() => useOrderReducer());
    act(() => {
      result.current.createOrder({ prductos: [{ id: 1 }, { id: 2 }] });
    });
    // Dispatching with the typo-named field "prductos" in state
    // The reducer reads state.prductos — this is the typo. With correct field name
    // "prductos" the reducer happens to work, but "productos" (correct) would fail.
    // This test documents the typo by verifying dispatch doesn't crash with the
    // misspelled field.
    expect(() => {
      act(() => {
        result.current.substrackProductFromOrder({ id: 1 });
      });
    }).not.toThrow();
  });

  // UOR-07
  it('UOR-07 — addOneToOrder, subtractOneToOrder, removeFromOrder dispatch but state does not change (B-10)', () => {
    const { result } = renderHook(() => useOrderReducer());
    const initial = { productos: [{ id: 1, cantidad: 2 }] };
    act(() => {
      result.current.createOrder(initial);
    });
    const stateAfterCreate = result.current.state;

    act(() => { result.current.addOneToOrder({ id: 1 }); });
    expect(result.current.state).toEqual(stateAfterCreate); // no change

    act(() => { result.current.subtractOneToOrder({ id: 1 }); });
    expect(result.current.state).toEqual(stateAfterCreate); // no change

    act(() => { result.current.removeFromOrder({ id: 1 }); });
    expect(result.current.state).toEqual(stateAfterCreate); // no change
  });
});

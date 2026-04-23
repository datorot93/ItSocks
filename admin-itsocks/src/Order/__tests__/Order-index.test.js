/**
 * Tests for src/Order/index.js
 * §9.3 — AOI-01
 */
import { describe, it, expect } from 'vitest';

describe('Order/index.js', () => {
  // AOI-01
  it('AOI-01 — exports OrderList and OrderEdit', async () => {
    const module = await import('../index.js');
    expect(module.OrderList).toBeDefined();
    expect(module.OrderEdit).toBeDefined();
    expect(typeof module.OrderList).toBe('function');
    expect(typeof module.OrderEdit).toBe('function');
  });
});

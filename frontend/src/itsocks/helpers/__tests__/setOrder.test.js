/**
 * Tests for src/itsocks/helpers/setOrder.js
 * §8.5 — SO-01 through SO-05
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setOrder, setProductOrder } from '../setOrder';

// Mock fetchWithoutToken
vi.mock('../../../utils/api', () => ({
  fetchWithoutToken: vi.fn(),
}));

import { fetchWithoutToken } from '../../../utils/api';

describe('setOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // SO-01
  it('SO-01 — calls fetchWithoutToken with (orders, order, POST)', async () => {
    const mockJson = { id: 1 };
    fetchWithoutToken.mockResolvedValue({ json: () => Promise.resolve(mockJson) });

    const order = { email: 'test@test.com', total: 50000 };
    await setOrder(order);

    expect(fetchWithoutToken).toHaveBeenCalledWith('orders', order, 'POST');
  });

  // SO-02
  it('SO-02 — returns the result of .json()', async () => {
    const mockData = { id: 42, email: 'a@b.com' };
    fetchWithoutToken.mockResolvedValue({ json: () => Promise.resolve(mockData) });

    const result = await setOrder({ email: 'a@b.com', total: 1000 });
    expect(result).toEqual(mockData);
  });

  // SO-05
  it('SO-05 — propagates error when fetchWithoutToken rejects', async () => {
    fetchWithoutToken.mockRejectedValue(new Error('Network error'));

    await expect(setOrder({ email: 'x@y.com', total: 0 })).rejects.toThrow('Network error');
  });
});

describe('setProductOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // SO-03
  it('SO-03 — calls fetchWithoutToken with (product_orders, po, POST)', async () => {
    fetchWithoutToken.mockResolvedValue({ json: () => Promise.resolve({ id: 5 }) });

    const po = { product_id: 1, order_id: 2, quantity: 1, pack: '', size: 'M', num_in_order: 1 };
    await setProductOrder(po);

    expect(fetchWithoutToken).toHaveBeenCalledWith('product_orders', po, 'POST');
  });

  // SO-04
  it('SO-04 — returns the result of .json()', async () => {
    const mockData = { id: 10 };
    fetchWithoutToken.mockResolvedValue({ json: () => Promise.resolve(mockData) });

    const result = await setProductOrder({ product_id: 1, order_id: 1 });
    expect(result).toEqual(mockData);
  });
});

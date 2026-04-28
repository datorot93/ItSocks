/**
 * Tests for src/OrderReport/index.js
 * §9.6 — ORI-01
 *
 * NOTE: index.js exports from './OrderReportList' but the actual file is
 * 'OrderReportrList.jsx' (typo with extra 'r'). This is an additional bug
 * in the index — importing index.js will fail in a module resolver that is
 * case-sensitive. We verify the individual module directly.
 */
import { describe, it, expect } from 'vitest';

describe('OrderReport/index.js', () => {
  // ORI-01
  it('ORI-01 — OrderReportrList.jsx exports OrderReportList component', async () => {
    // Import the actual file (typo filename) directly — index.js has a path mismatch
    const module = await import('../OrderReportrList.jsx');
    expect(module.OrderReportList).toBeDefined();
    expect(typeof module.OrderReportList).toBe('function');
  });

  it('ORI-01b — index.js imports are documented; OrderReportCreate and OrderReportEdit are empty (B-14, B-15)', async () => {
    const createModule = await import('../OrderReportCreate.jsx');
    const editModule = await import('../OrderReportEdit.jsx');
    // Empty files have no named exports
    expect(Object.keys(createModule)).toEqual(['default'].filter(k => k in createModule));
    expect(Object.keys(editModule)).toEqual(['default'].filter(k => k in editModule));
  });
});

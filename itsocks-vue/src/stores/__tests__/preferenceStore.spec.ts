import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { usePreferenceStore } from '../preferenceStore'

describe('preferenceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia sin preference', () => {
    const pref = usePreferenceStore()
    expect(pref.preferenceId).toBeNull()
    expect(pref.orderId).toBeNull()
  })

  it('establece preference ID', () => {
    const pref = usePreferenceStore()
    pref.setPreference('pref-abc-123')
    expect(pref.preferenceId).toBe('pref-abc-123')
  })

  it('establece preference ID y order ID', () => {
    const pref = usePreferenceStore()
    pref.setPreference('pref-abc-123', 42)
    expect(pref.preferenceId).toBe('pref-abc-123')
    expect(pref.orderId).toBe(42)
  })

  it('limpia el preference', () => {
    const pref = usePreferenceStore()
    pref.setPreference('pref-abc-123', 42)
    pref.clearPreference()
    expect(pref.preferenceId).toBeNull()
    expect(pref.orderId).toBeNull()
  })
})

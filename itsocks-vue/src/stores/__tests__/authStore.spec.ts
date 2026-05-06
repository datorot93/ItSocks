import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useAuthStore } from '../authStore'

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      data: {
        user: { id: 1, name: 'Test User', email: 'test@test.com', role: 'customer' },
        token: 'test-token-123',
      },
    }),
    logout: vi.fn().mockResolvedValue({}),
    me: vi.fn().mockResolvedValue({
      data: { id: 1, name: 'Test User', email: 'test@test.com', role: 'customer' },
    }),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicia sin usuario autenticado', () => {
    const auth = useAuthStore()
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('login establece usuario y token', async () => {
    const auth = useAuthStore()
    await auth.login('test@test.com', 'password')
    expect(auth.user?.email).toBe('test@test.com')
    expect(auth.token).toBe('test-token-123')
    expect(auth.isAuthenticated).toBe(true)
  })

  it('logout limpia usuario y token', async () => {
    const auth = useAuthStore()
    await auth.login('test@test.com', 'password')
    await auth.logout()
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('clearAuth limpia el estado', async () => {
    const auth = useAuthStore()
    await auth.login('test@test.com', 'password')
    auth.clearAuth()
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
  })
})

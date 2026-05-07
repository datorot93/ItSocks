import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request interceptor: attach Bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const authRaw = localStorage.getItem('auth')
      if (authRaw) {
        const auth = JSON.parse(authRaw)
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`
        }
      }
    } catch {
      // ignore parse errors
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: unwrap Laravel API Resource single envelopes ({data: {...}})
// while preserving paginated responses ({data: [...], meta: {...}, links: {...}})
// and raw arrays/primitives.
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data
    if (
      body &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'data' in body &&
      !('meta' in body) &&
      !('links' in body) &&
      Object.keys(body).length === 1
    ) {
      response.data = (body as { data: unknown }).data
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')
    }
    return Promise.reject(error)
  },
)

export default apiClient

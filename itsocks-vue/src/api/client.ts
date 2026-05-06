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

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')
    }
    return Promise.reject(error)
  },
)

export default apiClient

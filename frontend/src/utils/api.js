import axios from 'axios'

// In production (Vercel), VITE_API_URL must be set to your Render backend URL
// e.g. https://your-app.onrender.com/api
// Never use relative /api in production — frontend (Vercel) & backend (Render) are on different domains
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalise errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out.' : err.message)
    return Promise.reject(new Error(message))
  }
)

// ─── Endpoint API calls ───────────────────────────────────────────────────────

export const generateAIMock = ({ prompt, endpointName }) =>
  api.post('/endpoints/generate', { prompt, endpointName })

export const createManualMock = ({ endpointName, payload }) =>
  api.post('/endpoints/manual', { endpointName, payload })

export const listEndpoints = (page = 1) =>
  api.get(`/endpoints?page=${page}&limit=20`)

export const deleteEndpoint = (id) =>
  api.delete(`/endpoints/${id}`)

export const updateEndpoint = (id, data) =>
  api.put(`/endpoints/${id}`, data)

export default api

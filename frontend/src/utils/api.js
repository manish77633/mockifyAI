import axios from 'axios'

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Force relative path if deployed to production to avoid localhost bleed
if (window.location.hostname !== 'localhost' && baseURL.includes('localhost')) {
  baseURL = '/api';
}
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

import axios from 'axios'

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (rawApiUrl && !rawApiUrl.endsWith('/api')) {
  if (rawApiUrl.endsWith('/')) rawApiUrl += 'api';
  else rawApiUrl += '/api';
}
const baseURL = rawApiUrl;
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

export const listEndpoints = (page = 1, limit = 50) =>
  api.get(`/endpoints?page=${page}&limit=${limit}`)

export const getEndpointDetail = (id) =>
  api.get(`/endpoints/${id}/detail`)

export const deleteEndpoint = (id) =>
  api.delete(`/endpoints/${id}`)

export const updateEndpoint = (id, data) =>
  api.put(`/endpoints/${id}`, data)

// ─── Admin API calls ──────────────────────────────────────────────────────────

export const getAdminStats = () => api.get('/admin/stats')

export const getAdminUsers = (page = 1, limit = 20, search = '', filter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}`)

export const banAdminUser = (userId) => api.put(`/admin/users/${userId}/ban`)

export const toggleAdminRole = (userId) => api.put(`/admin/users/${userId}/role`)

export const deleteAdminUser = (userId) => api.delete(`/admin/users/${userId}`)

export const getAdminEndpoints = (page = 1, limit = 20) => 
  api.get(`/admin/endpoints?page=${page}&limit=${limit}`)

export const deleteAdminEndpoint = (id) => api.delete(`/admin/endpoints/${id}`)

export const getAdminRevenue = () => api.get('/admin/revenue')

export default api

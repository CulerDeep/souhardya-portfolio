const TOKEN_KEY = 'sc_token'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data.detail
    const message = typeof detail === 'string' ? detail : data.error || res.statusText
    throw new Error(message || 'Request failed')
  }
  return data
}

export const api = {
  profile: () => request('/api/profile', { auth: false }),
  health: () => request('/api/health', { auth: false }),
  list: (kind) => request(kind ? `/api/content?kind=${kind}` : '/api/content'),
  get: (id) => request(`/api/content/${id}`),
  create: (payload) => request('/api/content', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/content/${id}`, { method: 'PATCH', body: payload }),
  remove: (id) => request(`/api/content/${id}`, { method: 'DELETE' }),
  signin: (email, password) => request('/api/auth/signin', { method: 'POST', body: { email, password }, auth: false }),
  signup: (name, email, password) =>
    request('/api/auth/signup', { method: 'POST', body: { name, email, password }, auth: false }),
  me: () => request('/api/auth/me'),
}

export const cvUrl = `${API_BASE}/api/cv`
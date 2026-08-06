import axios from 'axios'

/**
 * Single axios instance for the whole app.
 *
 * The base URL comes from VITE_API_URL so the same build can point at a local
 * Django server or a deployed one. It falls back to the dev server's default.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '')

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

/** Error shape every caller can rely on, regardless of what went wrong. */
export class ApiError extends Error {
  constructor(message, { status = null, fieldErrors = {}, isNetwork = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.isNetwork = isNetwork
  }
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'
const NETWORK_MESSAGE = "Couldn't reach the server. Check your connection and try again."

function toFieldErrors(errors) {
  if (!errors || typeof errors !== 'object') return {}
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([key]) => key !== 'detail' && key !== 'non_field_errors')
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : String(value)]),
  )
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new ApiError(NETWORK_MESSAGE, { isNetwork: true }))
    }

    const { status, data } = error.response
    // The backend's exception handler returns {success, message, errors, status_code}.
    const message = data?.message || data?.detail || GENERIC_MESSAGE

    return Promise.reject(
      new ApiError(message, { status, fieldErrors: toFieldErrors(data?.errors) }),
    )
  },
)

/** Unwraps DRF pagination so callers always get a plain array. */
export function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export default client

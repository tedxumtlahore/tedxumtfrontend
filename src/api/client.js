import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, storeTokens } from './auth'

/**
 * Single axios instance for the whole app.
 *
 * The base URL comes from VITE_API_URL so the same build can point at a local
 * Django server or a deployed one. It falls back to the dev server's default.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '')

/**
 * How long to wait before giving up on a request.
 *
 * 15s is plenty against a warm server, but a host that sleeps when idle — a
 * free-tier dyno, for instance — can take the better part of a minute to cold
 * start. Timing out shorter than that turns "slow first visit" into "the site
 * is broken", because the caller sees a network error rather than a wait.
 * Raise VITE_API_TIMEOUT to 60000 if the API is deployed somewhere that
 * spins down.
 */
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { Accept: 'application/json' },
})

/** Error shape every caller can rely on, regardless of what went wrong. */
export class ApiError extends Error {
  constructor(
    message,
    { status = null, code = '', fieldErrors = {}, isNetwork = false, data = null } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
    this.isNetwork = isNetwork
    // The raw response body. Some non-2xx responses are meaningful outcomes
    // rather than failures — a 409 from check-in carries the attendee's details,
    // which the volunteer needs precisely when the ticket is refused.
    this.data = data
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

// Attach the volunteer's token when one exists. The public site has none, so
// its requests stay anonymous.
client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Refresh the access token, sharing one in-flight request.
 *
 * A scanner fires requests in quick succession, so several can hit a 401 at
 * once. Without this every one of them would spend the single-use refresh
 * token, and all but the first would fail — logging the volunteer out mid-queue.
 */
let refreshInFlight = null

function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight

  const refresh = getRefreshToken()
  if (!refresh) return Promise.reject(new Error('no refresh token'))

  refreshInFlight = axios
    .post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
    .then(({ data }) => {
      storeTokens({ access: data.access, refresh: data.refresh })
      return data.access
    })
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new ApiError(NETWORK_MESSAGE, { isNetwork: true }))
    }

    const { status, data, config } = error.response

    // One transparent retry on an expired access token.
    if (status === 401 && config && !config._retried && getRefreshToken()) {
      config._retried = true
      try {
        const access = await refreshAccessToken()
        config.headers.Authorization = `Bearer ${access}`
        return client.request(config)
      } catch {
        clearTokens()
      }
    }

    // The backend's exception handler returns {success, message, errors, status_code}.
    const message = data?.message || data?.detail || GENERIC_MESSAGE

    return Promise.reject(
      new ApiError(message, {
        status,
        code: data?.code || '',
        fieldErrors: toFieldErrors(data?.errors),
        data,
      }),
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

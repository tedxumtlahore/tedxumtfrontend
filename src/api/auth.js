/**
 * Volunteer authentication for the check-in scanner.
 *
 * Tokens live in localStorage because the scanner is a phone kept awake at a
 * door for hours and a page reload must not sign the volunteer out. That does
 * mean an XSS bug would expose the token, which is why the backend issues
 * short-lived access tokens (1h) with rotation and a blacklist — a leaked
 * credential stops working quickly rather than at its natural expiry.
 *
 * Only the check-in portal uses this. The public site is anonymous and the CMS
 * uses Django's session.
 */

const ACCESS_KEY = 'tedxumt.scanner.access'
const REFRESH_KEY = 'tedxumt.scanner.refresh'
const USER_KEY = 'tedxumt.scanner.user'

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY)
  } catch {
    // Private browsing can throw on storage access.
    return null
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

export function getVolunteerName() {
  try {
    return localStorage.getItem(USER_KEY) || ''
  } catch {
    return ''
  }
}

export function storeTokens({ access, refresh, username }) {
  try {
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
    if (username) localStorage.setItem(USER_KEY, username)
  } catch {
    /* storage unavailable — the session simply won't survive a reload */
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* nothing to clear */
  }
}

export function isSignedIn() {
  return Boolean(getAccessToken())
}

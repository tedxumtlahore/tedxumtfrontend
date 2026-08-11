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

/**
 * Broadcast so <AuthProvider> can drop its cached user.
 *
 * The axios interceptor clears tokens on its own when a refresh fails, which
 * happens outside React entirely. Without this the navbar would keep offering
 * "My tickets" for a session that no longer exists.
 */
export const SIGNED_OUT_EVENT = 'tedxumt:signed-out'

export function clearTokens({ notify = true } = {}) {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* nothing to clear */
  }
  if (notify && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SIGNED_OUT_EVENT))
  }
}

/**
 * Whether *a* token is stored — not whether it grants anything.
 *
 * Attendees, volunteers and organizers all store a token here, so this cannot
 * decide who may open the scanner or the dashboard. Use the role flags from
 * `useAuth()` for that; this is only for "is there a session at all".
 */
export function isSignedIn() {
  return Boolean(getAccessToken())
}

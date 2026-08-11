import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SIGNED_OUT_EVENT, clearTokens, getAccessToken, storeTokens } from '../api/auth'
import { createAccount, fetchMe, signIn as signInRequest } from '../api/services'

/**
 * Who is signed in, for the whole app.
 *
 * One context covers attendees, volunteers and organizers because they are one
 * user table behind one JWT endpoint. What separates them is the role flags on
 * `/accounts/me/`, which the backend derives from group membership — the
 * frontend only ever *reflects* those flags in the UI. Hiding a link is never
 * the thing that protects an endpoint; the permission classes are.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Starts true only if a token exists, so an anonymous visitor never waits on
  // a request that was never going to happen.
  const [loading, setLoading] = useState(() => Boolean(getAccessToken()))

  const loadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setLoading(false)
      return null
    }
    try {
      const me = await fetchMe()
      setUser(me)
      return me
    } catch {
      // A token that no longer resolves to a user is worse than none: every
      // later request would carry it and 401. Drop it and continue anonymous.
      // notify:false — we are already setting the state ourselves.
      clearTokens({ notify: false })
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // The axios interceptor clears tokens when a refresh fails, with no way to
  // reach React state. Listen for it so an expired session stops being shown
  // as a live one.
  useEffect(() => {
    const onSignedOut = () => {
      setUser(null)
      setLoading(false)
    }
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut)
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut)
  }, [])

  const signIn = useCallback(
    async (email, password) => {
      const tokens = await signInRequest(email, password)
      storeTokens({ access: tokens.access, refresh: tokens.refresh })
      return loadUser()
    },
    [loadUser],
  )

  const signUp = useCallback(async ({ fullName, email, password }) => {
    const result = await createAccount({ fullName, email, password })
    storeTokens({
      access: result.tokens.access,
      refresh: result.tokens.refresh,
      username: result.user.full_name,
    })
    setUser(result.user)
    setLoading(false)
    return result.user
  }, [])

  const signOut = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refresh: loadUser }),
    [user, loading, signIn, signUp, signOut, loadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}

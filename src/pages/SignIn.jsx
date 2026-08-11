import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useReveal } from '../hooks/useReveal'

/**
 * Sign in / create an account, in one page with a toggle.
 *
 * Two modes rather than two routes because most people arrive unsure which
 * they need, and a wrong guess otherwise costs a page load.
 */
export default function SignIn() {
  const [mode, setMode] = useState('signin')
  const { signIn, signUp } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useReveal([mode])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  // Where to land afterwards — back where they were sent from, or My tickets.
  const next = location.state?.from ?? '/my-tickets'
  const creating = mode === 'signup'

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setErrors({})
    setMessage('')
    try {
      if (creating) {
        await signUp({ fullName, email, password })
        showToast('Account created.')
      } else {
        await signIn(email, password)
        showToast('Signed in.')
      }
      navigate(next, { replace: true })
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      // The token endpoint answers a bad password with a bare 401 and no field
      // errors, so it needs a message of its own to be any use.
      const fallback = creating
        ? err.message
        : 'That email and password did not match an account.'
      setMessage(err.status === 401 ? fallback : err.message)
    } finally {
      setBusy(false)
    }
  }

  const swap = (to) => {
    setMode(to)
    setErrors({})
    setMessage('')
  }

  return (
    <div ref={ref}>
      <section className="section" style={{ paddingTop: '170px', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div className="eyebrow reveal in" style={{ justifyContent: 'center' }}>
            {creating ? 'Create account' : 'Welcome back'}
          </div>
          <h1
            className="h-md reveal in"
            style={{ textAlign: 'center', marginBottom: '10px' }}
          >
            {creating ? 'Create your account' : 'Sign in'}
          </h1>
          <p
            className="form-note reveal in reveal-delay-1"
            style={{ textAlign: 'center', marginBottom: '28px' }}
          >
            {creating
              ? 'Your ticket is delivered to your account, so you can always find it again.'
              : 'See your registrations and tickets in one place.'}
          </p>

          <form className="reveal" onSubmit={submit} noValidate>
            {creating && (
              <div className="field">
                <label htmlFor="acc-name">Full name</label>
                <input
                  id="acc-name" value={fullName} disabled={busy} autoComplete="name"
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={Boolean(errors.full_name)}
                />
                {errors.full_name && (
                  <p className="field-error" role="alert">{errors.full_name}</p>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="acc-email">Email</label>
              <input
                id="acc-email" type="email" value={email} disabled={busy}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="field-error" role="alert">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="acc-password">Password</label>
              <input
                id="acc-password" type="password" value={password} disabled={busy}
                autoComplete={creating ? 'new-password' : 'current-password'}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <p className="field-error" role="alert">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Working…' : creating ? 'Create account' : 'Sign in'}
            </button>

            {message && (
              <p className="form-note" role="alert" style={{ textAlign: 'center' }}>
                {message}
              </p>
            )}
          </form>

          <p className="form-note reveal" style={{ textAlign: 'center', marginTop: '22px' }}>
            {creating ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="link-button"
              onClick={() => swap(creating ? 'signin' : 'signup')}
            >
              {creating ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <p className="form-note reveal" style={{ textAlign: 'center', marginTop: '14px' }}>
            You'll need an account to book a ticket — it's where your ticket lives.{' '}
            <Link to="/events">Browse events</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}

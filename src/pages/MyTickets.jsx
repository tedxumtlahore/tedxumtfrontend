import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useApi } from '../hooks/useApi'
import { useReveal } from '../hooks/useReveal'
import { claimRegistration, fetchMyRegistrations } from '../api/services'
import AsyncBoundary from '../components/common/AsyncBoundary'
import { formatDate } from '../utils/format'

/**
 * Every registration filed under the signed-in account.
 *
 * The backend filters on the authenticated user, so there is no id in any URL
 * here — that is deliberate, and it is what keeps this from becoming a way to
 * walk the attendee list.
 */
export default function MyTickets() {
  const { user, loading: authLoading, signOut } = useAuth()
  // Hooks cannot be conditional, so this runs before the redirect below. Skip
  // it while signed out, or every anonymous visit fires a request that is
  // certain to 403 before the redirect discards it.
  const registrations = useApi(fetchMyRegistrations, [user?.id], {
    initialData: [],
    skip: !user,
  })
  const ref = useReveal([registrations.data?.length])

  if (authLoading) {
    return (
      <div className="async-state" role="status" style={{ margin: '200px auto', maxWidth: '420px' }}>
        <span className="async-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: '/my-tickets' }} />
  }

  const items = registrations.data ?? []

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="eyebrow reveal in">My tickets</div>
          <h1 className="h-lg reveal in" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>
            Hello, {user.full_name}
          </h1>
          <p className="reveal in reveal-delay-1">
            Everything you have registered for, and where each one stands.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="account-bar reveal">
            <span className="account-bar-email">{user.email}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>

          <AsyncBoundary
            loading={registrations.loading}
            error={registrations.error}
            isEmpty={items.length === 0}
            emptyMessage="You haven't registered for anything yet."
            onRetry={registrations.refetch}
          >
            <div className="my-tickets">
              {items.map((registration) => (
                <RegistrationRow key={registration.public_ref} registration={registration} />
              ))}
            </div>
          </AsyncBoundary>

          <ClaimForm onClaimed={registrations.refetch} />
        </div>
      </section>
    </div>
  )
}

/** Maps a registration onto what the attendee should see and do next. */
function statusFor(registration) {
  if (registration.status === 'cancelled') {
    return { label: 'Cancelled', tone: 'muted' }
  }
  if (registration.status === 'expired') {
    return { label: 'Seat released', tone: 'muted' }
  }
  if (registration.ticket_access_token) {
    return { label: 'Ticket issued', tone: 'good' }
  }
  if (registration.proof_submitted) {
    return { label: 'Payment reported — awaiting confirmation', tone: 'wait' }
  }
  return { label: 'Payment pending', tone: 'wait' }
}

function RegistrationRow({ registration }) {
  const state = statusFor(registration)

  return (
    <article className={`my-ticket my-ticket-${state.tone} reveal`}>
      <div className="my-ticket-main">
        <h2 className="my-ticket-title">
          <Link to={`/events/${registration.event_slug}`}>{registration.event_title}</Link>
        </h2>
        <div className="my-ticket-meta">
          <span className={`my-ticket-status my-ticket-status-${state.tone}`}>
            {state.label}
          </span>
          {registration.ticket_number && (
            <span className="my-ticket-number">{registration.ticket_number}</span>
          )}
          {registration.created_at && (
            <span className="my-ticket-date">
              Registered {formatDate(registration.created_at)}
            </span>
          )}
        </div>
      </div>

      <div className="my-ticket-actions">
        {registration.ticket_access_token ? (
          <Link
            className="btn btn-primary btn-sm"
            to={`/ticket/${registration.ticket_access_token}`}
          >
            View ticket
          </Link>
        ) : (
          <Link
            className="btn btn-secondary btn-sm"
            to={`/registration/${registration.public_ref}`}
          >
            {registration.proof_submitted ? 'View status' : 'Complete payment'}
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * Attach a registration made before the account existed.
 *
 * Ownership is proved by the reference from the original registration link, not
 * by a matching email address — otherwise signing up with someone else's
 * address would hand over their ticket.
 */
function ClaimForm({ onClaimed }) {
  const { showToast } = useToast()
  const [publicRef, setPublicRef] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy || !publicRef.trim()) return
    setBusy(true)
    setMessage('')
    try {
      // Accepts either the bare reference or the whole link they were given.
      const ref = publicRef.trim().replace(/\/+$/, '').split('/').pop()
      const result = await claimRegistration(ref)
      showToast(result.message)
      setPublicRef('')
      onClaimed?.()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2 className="dash-title reveal" style={{ marginTop: '38px' }}>
        Registered before you had an account?
      </h2>
      <form className="reveal" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="claim-ref">Your registration link or reference</label>
          <input
            id="claim-ref" value={publicRef} disabled={busy}
            placeholder="https://…/registration/… or the reference itself"
            onChange={(e) => setPublicRef(e.target.value)}
          />
          <p className="field-hint">
            It's in the confirmation you got when you registered. Adding it here files
            that registration under this account.
          </p>
        </div>
        <button type="submit" className="btn btn-secondary btn-block" disabled={busy}>
          {busy ? 'Adding…' : 'Add to my account'}
        </button>
        {message && (
          <p className="form-note" role="alert" style={{ textAlign: 'center' }}>
            {message}
          </p>
        )}
      </form>
    </>
  )
}

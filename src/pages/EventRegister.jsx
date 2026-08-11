import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { fetchEventTicketing, registerForEvent } from '../api/services'
import AsyncBoundary from '../components/common/AsyncBoundary'

const EMPTY = {
  full_name: '',
  email: '',
  phone: '',
  cnic: '',
  university: '',
  occupation: '',
}

export default function EventRegister() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const info = useApi(() => fetchEventTicketing(slug), [slug])
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [blocked, setBlocked] = useState('')

  const ticketing = info.data
  const ref = useReveal([ticketing, blocked])

  // Prefill from the account so nobody retypes what we already know. Only
  // fills blanks, so a ticket bought for someone else is not overwritten.
  useEffect(() => {
    if (!user) return
    setValues((v) => ({
      ...v,
      full_name: v.full_name || user.full_name || '',
      email: v.email || user.email || '',
    }))
  }, [user])

  const setField = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setErrors({})
    setBlocked('')
    try {
      const result = await registerForEvent(slug, values)
      showToast(result.message || 'Registration received.')
      // The ticket reference is the attendee's only way back to their ticket,
      // so go straight there rather than leaving them to find it in email.
      const token = result.registration?.ticket_access_token
      if (token) {
        navigate(`/ticket/${token}`, { replace: true })
      } else {
        navigate(`/registration/${result.registration?.public_ref}`, { replace: true })
      }
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      // 409 means the rules said no (sold out, closed, already registered)
      // rather than the form being malformed — show it above the form.
      if (err.status === 409) setBlocked(err.message)
      showToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const closed = ticketing && !ticketing.registration_is_open

  if (authLoading) {
    return (
      <div className="async-state" role="status" style={{ margin: '200px auto', maxWidth: '420px' }}>
        <span className="async-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  // The ticket lives in the account — there is no email copy to fall back on —
  // so the account has to exist before the registration does. Send them to sign
  // in and bring them straight back here afterwards.
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/events">Events</Link> /{' '}
            <Link to={`/events/${slug}`}>{ticketing?.event ?? 'Event'}</Link> / Register
          </div>
          <div className="eyebrow reveal in">Registration</div>
          <h1 className="h-lg reveal in" style={{ fontSize: 'clamp(30px,5vw,46px)' }}>
            {ticketing?.event ?? 'Register'}
          </h1>
          {ticketing && (
            <p className="reveal in reveal-delay-1">
              {ticketing.is_free
                ? 'This event is free — your ticket is issued immediately.'
                : `Tickets are ${ticketing.currency} ${ticketing.ticket_price}.`}
              {ticketing.seats_remaining !== null && ticketing.seats_remaining > 0 && (
                <> {ticketing.seats_remaining} of {ticketing.capacity} seats left.</>
              )}
            </p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container" style={{ maxWidth: '660px' }}>
          <AsyncBoundary loading={info.loading} error={info.error} onRetry={info.refetch}>
            {closed ? (
              <div className="async-state async-state-error" role="status">
                <p>{ticketing.closed_reason}</p>
                <Link to={`/events/${slug}`} className="btn btn-secondary btn-sm">
                  Back to the event
                </Link>
              </div>
            ) : (
              <>
                {blocked && (
                  <div className="async-state async-state-error" role="alert" style={{ marginBottom: '24px' }}>
                    <p>{blocked}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                  <Field
                    id="reg-name" label="Full Name" placeholder="As it appears on your ID"
                    value={values.full_name} onChange={setField('full_name')}
                    error={errors.full_name} disabled={submitting}
                  />
                  <Field
                    id="reg-email" label="Email Address" type="email"
                    placeholder="you@example.com" hint="Your ticket is emailed here."
                    value={values.email} onChange={setField('email')}
                    error={errors.email} disabled={submitting}
                  />
                  <Field
                    id="reg-phone" label="Phone Number" placeholder="+92 300 0000000"
                    value={values.phone} onChange={setField('phone')}
                    error={errors.phone} disabled={submitting}
                  />
                  <Field
                    id="reg-cnic" label="CNIC / Passport Number"
                    placeholder="35202-1234567-8"
                    hint="Only the last four digits are stored — used to match your ID at the door."
                    value={values.cnic} onChange={setField('cnic')}
                    error={errors.cnic} disabled={submitting}
                  />
                  <Field
                    id="reg-university" label="University (optional)"
                    value={values.university} onChange={setField('university')}
                    error={errors.university} disabled={submitting}
                  />
                  <Field
                    id="reg-occupation" label="Occupation (optional)"
                    value={values.occupation} onChange={setField('occupation')}
                    error={errors.occupation} disabled={submitting}
                  />
                  <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                    {submitting ? 'Submitting…' : ticketing?.is_free ? 'Get my ticket' : 'Register'}
                  </button>
                  <p className="form-note" style={{ textAlign: 'center' }}>
                    One ticket per person. Your details are used only for this event.
                  </p>
                </form>
              </>
            )}
          </AsyncBoundary>
        </div>
      </section>
    </div>
  )
}

function Field({ id, label, hint, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p className="field-hint" id={`${id}-hint`}>{hint}</p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">{error}</p>
      )}
    </div>
  )
}

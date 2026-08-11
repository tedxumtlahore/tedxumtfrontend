import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { fetchPaymentAccounts, fetchRegistration, submitPaymentProof } from '../api/services'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

/** While a payment is awaiting confirmation, re-check periodically. */
const POLL_MS = 20000

/**
 * The attendee's page for a registration that is not yet a ticket.
 *
 * Shows what they owe and where to send it, lets them report the transfer, and
 * flips to their ticket once an organizer confirms. Reached by the unguessable
 * `public_ref` from their confirmation email.
 */
export default function RegistrationStatus() {
  const { publicRef } = useParams()
  const navigate = useNavigate()

  const reg = useApi(() => fetchRegistration(publicRef), [publicRef])
  const accounts = useApi(fetchPaymentAccounts, [], { initialData: [] })

  const registration = reg.data
  const ref2 = useReveal([registration, accounts.data?.length])

  // Poll only while there is something to wait for, and send the attendee
  // straight to their ticket the moment an organizer confirms — they are
  // likely sitting on this page refreshing otherwise.
  const awaiting = Boolean(registration && !registration.ticket_access_token)
  useEffect(() => {
    if (!awaiting) return undefined

    let cancelled = false
    const timer = setInterval(async () => {
      try {
        const fresh = await fetchRegistration(publicRef)
        if (cancelled) return
        if (fresh.ticket_access_token) {
          navigate(`/ticket/${fresh.ticket_access_token}`, { replace: true })
        }
      } catch {
        // A failed poll is not worth surfacing; the next one will retry.
      }
    }, POLL_MS)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [awaiting, publicRef, navigate])

  if (reg.error?.status === 404) return <NotFound type="Registration" />

  if (reg.loading || reg.error || !registration) {
    return (
      <div style={{ paddingTop: '170px', minHeight: '60vh' }}>
        <div className="container">
          <AsyncBoundary loading={reg.loading} error={reg.error} onRetry={reg.refetch}>
            <div />
          </AsyncBoundary>
        </div>
      </div>
    )
  }

  // Already confirmed — send them to the real thing.
  if (registration.ticket_access_token) {
    return (
      <section className="section" style={{ paddingTop: '160px' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Confirmed</div>
          <h1 className="h-md">Your payment is confirmed</h1>
          <p className="text-lead" style={{ margin: '14px auto 26px' }}>
            Ticket {registration.ticket_number} has been issued and emailed to you.
          </p>
          <Link className="btn btn-primary" to={`/ticket/${registration.ticket_access_token}`}>
            Open my ticket
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div ref={ref2}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to={`/events/${registration.event_slug}`}>{registration.event_title}</Link>
            {' / Payment'}
          </div>
          <div className="eyebrow reveal in">Almost there</div>
          <h1 className="h-lg reveal in" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>
            Complete your payment
          </h1>
          <p className="reveal in reveal-delay-1">
            Your seat is held for {registration.full_name}. Send{' '}
            <strong>{registration.currency} {registration.amount}</strong> to one of the
            accounts below, then tell us the transaction ID.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container" style={{ maxWidth: '660px' }}>
          {registration.proof_submitted && (
            <div className="pay-waiting reveal" role="status">
              <strong>Payment reported — waiting for confirmation</strong>
              <span>
                An organizer is checking the transfer. Your ticket appears under
                My tickets the moment it clears, usually within one working day.
                You can leave this page.
              </span>
            </div>
          )}

          <h2 className="dash-title reveal">Send payment to</h2>
          <AsyncBoundary
            loading={accounts.loading}
            error={accounts.error}
            isEmpty={(accounts.data ?? []).length === 0}
            emptyMessage="Payment details are not set up yet — please contact the organizers."
            onRetry={accounts.refetch}
          >
            <div className="pay-accounts reveal">
              {(accounts.data ?? []).map((account) => (
                <PaymentAccountCard key={account.id} account={account} />
              ))}
            </div>
          </AsyncBoundary>

          <ProofForm
            publicRef={publicRef}
            alreadySubmitted={registration.proof_submitted}
            existingReference={registration.payment_reference}
            onSubmitted={reg.refetch}
          />
        </div>
      </section>
    </div>
  )
}

function PaymentAccountCard({ account }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.account_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is blocked in some mobile browsers; the number is visible anyway.
    }
  }

  return (
    <div className="pay-account">
      <div className="pay-account-head">
        <span className="pay-provider">{account.provider_label}</span>
        {account.bank_name && <span className="pay-bank">{account.bank_name}</span>}
      </div>
      <button type="button" className="pay-number" onClick={copy} title="Copy">
        {account.account_number}
        <span className="pay-copy">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <div className="pay-title">{account.account_title}</div>
      {account.iban && <div className="pay-iban">IBAN {account.iban}</div>}
      {account.note && <p className="pay-note">{account.note}</p>}
    </div>
  )
}

function ProofForm({ publicRef, alreadySubmitted, existingReference, onSubmitted }) {
  const { showToast } = useToast()
  const [reference, setReference] = useState(existingReference || '')
  const [paidFromNumber, setPaidFromNumber] = useState('')
  const [proof, setProof] = useState(null)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setErrors({})
    setMessage('')
    try {
      const result = await submitPaymentProof(publicRef, { reference, paidFromNumber, proof })
      showToast(result.message)
      setMessage(result.message)
      onSubmitted?.()
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      setMessage(err.message)
      showToast(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2 className="dash-title reveal" style={{ marginTop: '32px' }}>
        {alreadySubmitted ? 'Update your payment details' : "I've sent the payment"}
      </h2>
      <form className="reveal" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="pay-ref">Transaction ID</label>
          <input
            id="pay-ref" value={reference} disabled={busy}
            placeholder="From your Easypaisa / JazzCash receipt"
            onChange={(e) => setReference(e.target.value)}
            aria-invalid={Boolean(errors.reference)}
          />
          {errors.reference && <p className="field-error" role="alert">{errors.reference}</p>}
        </div>

        <div className="field">
          <label htmlFor="pay-from">Number you paid from</label>
          <input
            id="pay-from" value={paidFromNumber} disabled={busy}
            placeholder="03XX XXXXXXX"
            onChange={(e) => setPaidFromNumber(e.target.value)}
            aria-invalid={Boolean(errors.paid_from_number)}
          />
          <p className="field-hint">
            This is how we find your transfer — wallet transfers arrive without a note,
            so the sending number is what we match against.
          </p>
          {errors.paid_from_number && (
            <p className="field-error" role="alert">{errors.paid_from_number}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="pay-proof">Screenshot (optional)</label>
          <input
            id="pay-proof" type="file" accept="image/*" disabled={busy}
            onChange={(e) => setProof(e.target.files?.[0] ?? null)}
          />
          {errors.proof && <p className="field-error" role="alert">{errors.proof}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Sending…' : alreadySubmitted ? 'Update details' : "I've paid"}
        </button>
        {message && <p className="form-note" style={{ textAlign: 'center' }}>{message}</p>}
        <p className="form-note" style={{ textAlign: 'center' }}>
          You can close this page — it's saved under{' '}
          <Link to="/my-tickets">My tickets</Link>, and your ticket appears there
          once an organizer confirms the transfer.
        </p>
      </form>
    </>
  )
}

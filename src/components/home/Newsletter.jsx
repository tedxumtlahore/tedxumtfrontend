import { useState } from 'react'
import { subscribeToNewsletter } from '../../api/services'
import { useToast } from '../../context/ToastContext'

export default function Newsletter() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError('')
    try {
      const result = await subscribeToNewsletter(email)
      showToast(result?.message || 'Subscribed — welcome to the list.')
      setEmail('')
    } catch (err) {
      const message = err.fieldErrors?.email || err.message
      setError(message)
      showToast(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section newsletter">
      <div className="container">
        <div className="eyebrow reveal" style={{ justifyContent: 'center' }}>
          Stay Updated
        </div>
        <h2 className="h-lg reveal">Get news before anyone else does.</h2>
        <form className="newsletter-form reveal reveal-delay-1" id="newsletterForm" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            aria-invalid={Boolean(error)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {error && (
          <p className="form-note form-error reveal" role="alert">
            {error}
          </p>
        )}
        <p className="form-note reveal reveal-delay-2">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}

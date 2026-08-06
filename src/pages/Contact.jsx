import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSiteConfig } from '../context/SiteConfigContext'
import { useToast } from '../context/ToastContext'
import { submitContactMessage } from '../api/services'
import PageHero from '../components/common/PageHero'

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { showToast } = useToast()
  const { settings, faqs } = useSiteConfig()

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)

  const ref = useReveal([faqs.length])

  const setField = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setErrors({})
    try {
      const result = await submitContactMessage(values)
      showToast(result?.message || "Message sent — we'll be in touch soon.")
      setValues(EMPTY)
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      showToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Contact"
        title="Let's talk ideas"
        desc="Questions about speaking, sponsoring, or attending? We read every message."
      />

      <section className="section">
        <div className="container contact-grid">
          <form className="reveal" id="contactForm" onSubmit={handleSubmit} noValidate>
            <Field
              id="contact-name"
              label="Full Name"
              placeholder="Your name"
              value={values.name}
              onChange={setField('name')}
              error={errors.name}
              disabled={submitting}
            />
            <Field
              id="contact-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={setField('email')}
              error={errors.email}
              disabled={submitting}
            />
            <Field
              id="contact-subject"
              label="Subject"
              placeholder="What's this about?"
              value={values.subject}
              onChange={setField('subject')}
              error={errors.subject}
              disabled={submitting}
            />
            <Field
              id="contact-message"
              label="Message"
              as="textarea"
              rows={5}
              placeholder="Tell us more..."
              value={values.message}
              onChange={setField('message')}
              error={errors.message}
              disabled={submitting}
            />
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          <div className="reveal reveal-delay-1">
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>@</div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Email</h4>
                <p className="text-muted">
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </p>
              </div>
            </div>
            {settings.phone && (
              <div className="contact-info-item">
                <div className="icon-badge" style={{ marginBottom: 0 }}>&#128222;</div>
                <div>
                  <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Phone</h4>
                  <p className="text-muted">{settings.phone}</p>
                </div>
              </div>
            )}
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>&#128205;</div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Location</h4>
                <p className="text-muted">{settings.address}</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>&#128172;</div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Social</h4>
                <p className="text-muted">@tedxumtlahore on all platforms</p>
              </div>
            </div>
            {settings.map_embed_url ? (
              <iframe
                className="map-embed"
                src={settings.map_embed_url}
                title="TEDxUMT Lahore location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-placeholder">Map preview — {settings.address}</div>
            )}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section
          className="section"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        >
          <div className="container" style={{ maxWidth: '820px' }}>
            <div className="eyebrow reveal">FAQ</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '20px' }}>
              Frequently Asked Questions
            </h2>
            <div className="reveal reveal-delay-1" id="faqAccordion">
              {faqs.map((f, i) => (
                <div key={f.id} className={`accordion-item${openIndex === i ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="accordion-head"
                    aria-expanded={openIndex === i}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    {f.question}
                    <span className="plus">+</span>
                  </button>
                  <div className="accordion-body">
                    <p>{f.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function Field({ id, label, as = 'input', error, ...props }) {
  const Tag = as
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

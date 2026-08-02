import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { FAQ } from '../data/siteData'
import { useToast } from '../context/ToastContext'
import PageHero from '../components/common/PageHero'

export default function Contact() {
  const ref = useReveal()
  const { showToast } = useToast()
  const [openIndex, setOpenIndex] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast("Message sent — we'll be in touch soon.")
    e.target.reset()
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
          <form className="reveal" id="contactForm" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="contact-name">Full Name</label>
              <input id="contact-name" type="text" required placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="contact-email">Email Address</label>
              <input id="contact-email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="contact-subject">Subject</label>
              <input id="contact-subject" type="text" required placeholder="What's this about?" />
            </div>
            <div className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" rows={5} required placeholder="Tell us more..." />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
          <div className="reveal reveal-delay-1">
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>
                @
              </div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Email</h4>
                <p className="text-muted">hello@tedxumtlahore.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>
                &#128205;
              </div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Location</h4>
                <p className="text-muted">UMT Campus, C-II, Johar Town, Lahore</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="icon-badge" style={{ marginBottom: 0 }}>
                &#128172;
              </div>
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--white)' }}>Social</h4>
                <p className="text-muted">@tedxumtlahore on all platforms</p>
              </div>
            </div>
            <div className="map-placeholder">Map preview — UMT Campus, Lahore</div>
          </div>
        </div>
      </section>

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
            {FAQ.map((f, i) => (
              <div key={f.q} className={`accordion-item${openIndex === i ? ' open' : ''}`}>
                <div
                  className="accordion-head"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setOpenIndex(openIndex === i ? null : i)
                    }
                  }}
                >
                  {f.q}
                  <span className="plus">+</span>
                </div>
                <div className="accordion-body">
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

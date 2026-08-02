import { useToast } from '../../context/ToastContext'

export default function Newsletter() {
  const { showToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast('Subscribed — welcome to the list.')
    e.target.reset()
  }

  return (
    <section className="section newsletter">
      <div className="container">
        <div className="eyebrow reveal" style={{ justifyContent: 'center' }}>
          Stay Updated
        </div>
        <h2 className="h-lg reveal">Get news before anyone else does.</h2>
        <form className="newsletter-form reveal reveal-delay-1" id="newsletterForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="you@example.com" required aria-label="Email address" />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
        <p className="form-note reveal reveal-delay-2">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}

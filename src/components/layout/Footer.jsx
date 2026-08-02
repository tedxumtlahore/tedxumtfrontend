import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              TED<span className="x">x</span>UMT Lahore
            </Link>
            <p>
              An independently organized TED event at the University of Management and
              Technology — bringing ideas worth spreading to Lahore&apos;s brightest minds
              since 2019.
            </p>
            <div className="footer-social">
              <Link className="social-dot" to="/contact" aria-label="Instagram">
                IG
              </Link>
              <Link className="social-dot" to="/contact" aria-label="LinkedIn">
                in
              </Link>
              <Link className="social-dot" to="/contact" aria-label="Facebook">
                FB
              </Link>
              <Link className="social-dot" to="/contact" aria-label="YouTube">
                YT
              </Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/speakers">Speakers</Link></li>
              <li><Link to="/team">Team</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/sponsors">Sponsors</Link></li>
              <li><Link to="/apply">Apply</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:hello@tedxumtlahore.com">hello@tedxumtlahore.com</a></li>
              <li><Link to="/contact">UMT Campus, Lahore</Link></li>
              <li><Link to="/contact">Get in touch</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span id="year">{year}</span> TEDxUMT Lahore. This independent TEDx event is
            operated under license from TED.
          </p>
          <p>Crafted with care in Lahore.</p>
        </div>
      </div>
    </footer>
  )
}

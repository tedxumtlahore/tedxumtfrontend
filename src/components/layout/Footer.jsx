import { Link } from 'react-router-dom'
import { useSiteConfig } from '../../context/SiteConfigContext'

const FALLBACK_SOCIAL = [
  { id: 'ig', display_label: 'IG', url: 'https://www.instagram.com/tedxumtlahore', aria_label: 'Instagram' },
  { id: 'in', display_label: 'in', url: 'https://www.linkedin.com/company/tedxumtlahore/', aria_label: 'LinkedIn' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const { settings, socialLinks } = useSiteConfig()
  const links = socialLinks.length ? socialLinks : FALLBACK_SOCIAL

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              TED<span className="x">x</span>UMT Lahore
            </Link>
            <p>{settings.footer_tagline}</p>
            <div className="footer-social">
              {links.map((link) => (
                <a
                  key={link.id ?? link.url}
                  className="social-dot"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.aria_label || link.display_label}
                >
                  {link.display_label}
                </a>
              ))}
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
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              {settings.phone && <li><a href={`tel:${settings.phone}`}>{settings.phone}</a></li>}
              <li><Link to="/contact">{settings.address}</Link></li>
              <li><Link to="/contact">Get in touch</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span id="year">{year}</span> {settings.site_name}. {settings.copyright_text}
          </p>
          <p>Crafted with care in Lahore.</p>
        </div>
      </div>
    </footer>
  )
}

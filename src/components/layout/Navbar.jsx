import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSiteConfig } from '../../context/SiteConfigContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { navigation, settings } = useSiteConfig()
  const { user } = useAuth()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Navigating with the browser's back button leaves the menu open otherwise.
  useEffect(() => setMenuOpen(false), [pathname])

  const closeMenu = () => setMenuOpen(false)
  const brandName = settings.site_name || 'TEDxUMT Lahore'

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            {renderBrand(brandName)}
            <span className="tag">{settings.tagline || 'Ideas Worth Spreading'}</span>
          </Link>
          <div className="nav-links" id="navLinks">
            {navigation.map((item) => (
              <NavLink
                key={item.id ?? item.url}
                to={item.url}
                end={item.url === '/'}
                target={item.open_in_new_tab ? '_blank' : undefined}
                rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                data-route={item.url}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="nav-actions">
            {user ? (
              <Link to="/my-tickets" className="btn btn-secondary btn-sm">
                My tickets
              </Link>
            ) : (
              <Link to="/signin" className="btn btn-secondary btn-sm">
                Sign in
              </Link>
            )}
            <Link to="/apply" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            id="menuToggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
        {navigation.map((item) => (
          <Link key={item.id ?? item.url} to={item.url} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
        <Link to={user ? '/my-tickets' : '/signin'} onClick={closeMenu}>
          {user ? 'My tickets' : 'Sign in'}
        </Link>
        <Link to="/apply" onClick={closeMenu}>
          Apply
        </Link>
      </div>
    </>
  )
}

/** Keeps the red "x" in TEDx however the site name is edited in the CMS. */
function renderBrand(name) {
  const match = /^(.*TED)(x)(.*)$/.exec(name)
  if (!match) return name
  const [, before, x, after] = match
  return (
    <>
      {before}
      <span className="x">{x}</span>
      {after}
    </>
  )
}

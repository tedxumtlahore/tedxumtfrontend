import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home', route: '/' },
  { to: '/about', label: 'About', route: '/about' },
  { to: '/events', label: 'Events', route: '/events' },
  { to: '/speakers', label: 'Speakers', route: '/speakers' },
  { to: '/team', label: 'Team', route: '/team' },
  { to: '/gallery', label: 'Gallery', route: '/gallery' },
  { to: '/blog', label: 'Blog', route: '/blog' },
  { to: '/sponsors', label: 'Sponsors', route: '/sponsors' },
  { to: '/contact', label: 'Contact', route: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            TED<span className="x">x</span>UMT Lahore
            <span className="tag">Ideas Worth Spreading</span>
          </Link>
          <div className="nav-links" id="navLinks">
            {navLinks.map(({ to, label, route }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                data-route={route}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="nav-actions">
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
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} onClick={closeMenu}>
            {label}
          </Link>
        ))}
        <Link to="/apply" onClick={closeMenu}>
          Apply
        </Link>
      </div>
    </>
  )
}

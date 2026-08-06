import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IMG } from '../../utils/images'
import { useSiteConfig } from '../../context/SiteConfigContext'

export default function Hero() {
  const bgRef = useRef(null)
  const heroRef = useRef(null)
  const { hero } = useSiteConfig()

  useEffect(() => {
    const bg = bgRef.current
    const heroEl = heroRef.current
    if (!bg || !heroEl) return undefined

    let raf = null
    const onMouseMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 22
        const y = (e.clientY / window.innerHeight - 0.5) * 22
        bg.style.transform = `scale(1.08) translate(${x}px, ${y}px)`
        raf = null
      })
    }

    heroEl.addEventListener('mousemove', onMouseMove)
    return () => {
      heroEl.removeEventListener('mousemove', onMouseMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // An uploaded hero image replaces the bundled campus photo.
  const background = hero.background_image || IMG.campus

  return (
    <section className="hero" id="heroSection" ref={heroRef}>
      <div
        className="hero-bg"
        id="heroBg"
        ref={bgRef}
        style={{ backgroundImage: `url('${background}')` }}
      />
      <div className="hero-overlay" />
      <div className="hero-glow" />
      <div className="container hero-content">
        <span className="hero-eyebrow">{hero.eyebrow}</span>
        <h1>
          {hero.headline_line1}
          <br />
          <span>{hero.headline_line2}</span>
        </h1>
        <p>{hero.subheading}</p>
        <div className="hero-ctas">
          <Link to={hero.cta_primary_url || '/apply'} className="btn btn-primary">
            {hero.cta_primary_label}
          </Link>
          <Link to={hero.cta_secondary_url || '/apply'} className="btn btn-secondary">
            {hero.cta_secondary_label}
          </Link>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="line" />
      </div>
    </section>
  )
}

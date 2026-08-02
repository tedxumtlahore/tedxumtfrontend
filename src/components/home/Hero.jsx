import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IMG } from '../../utils/images'

export default function Hero() {
  const bgRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    const hero = heroRef.current
    if (!bg || !hero) return undefined

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

    hero.addEventListener('mousemove', onMouseMove)
    return () => hero.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <section className="hero" id="heroSection" ref={heroRef}>
      <div
        className="hero-bg"
        id="heroBg"
        ref={bgRef}
        style={{ backgroundImage: `url('${IMG.campus}')` }}
      />
      <div className="hero-overlay" />
      <div className="hero-glow" />
      <div className="container hero-content">
        <span className="hero-eyebrow">
          TEDxUMT Lahore &nbsp;&middot;&nbsp; University of Management and Technology
        </span>
        <h1>
          Ideas worth
          <br />
          <span>spreading.</span>
        </h1>
        <p>
          An independently organized TED event bringing Lahore&apos;s boldest thinkers,
          builders, and storytellers to one stage.
        </p>
        <div className="hero-ctas">
          <Link to="/apply" className="btn btn-primary">
            Register
          </Link>
          <Link to="/apply" className="btn btn-secondary">
            Become a Speaker
          </Link>
        </div>
      </div> <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="line" />
      </div>
    </section>
  )
}

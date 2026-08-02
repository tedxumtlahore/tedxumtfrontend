import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { EVENTS, SPEAKERS, BLOG, SPONSORS } from '../data/siteData'
import { IMG } from '../utils/images'
import { formatDate } from '../utils/format'
import Hero from '../components/home/Hero'
import Countdown from '../components/home/Countdown'
import Newsletter from '../components/home/Newsletter'
import SpeakerCard from '../components/common/SpeakerCard'
import BlogCard from '../components/common/BlogCard'

export default function Home() {
  const ref = useReveal()
  const upcoming = EVENTS.find((e) => e.status === 'upcoming')
  const sponsors = [...SPONSORS.Title, ...SPONSORS.Gold, ...SPONSORS.Silver].slice(0, 4)

  return (
    <div ref={ref}>
      <Hero />

      <section className="section about-preview">
        <div className="container grid grid-2">
          <div className="reveal">
            <div className="eyebrow">About Us</div>
            <h2 className="h-lg">
              Where the University
              <br />
              of Management and Technology
              <br />
              meets the world stage.
            </h2>
            <p className="text-lead" style={{ margin: '20px 0 28px' }}>
              TEDxUMT Lahore is a student-led, independently organized TED event. Since 2019
              we&apos;ve brought together researchers, artists, engineers and entrepreneurs to
              share the ideas shaping the next decade.
            </p>
            <Link to="/about" className="link-underline">
              Read Our Story &rarr;
            </Link>
            <div className="stat-row">
              <div>
                <div className="num">3</div>
                <div className="lbl">Events Hosted</div>
              </div>
              <div>
                <div className="num">30+</div>
                <div className="lbl">Speakers</div>
              </div>
              <div>
                <div className="num">4,200+</div>
                <div className="lbl">Attendees</div>
              </div>
            </div>
          </div>
          <div className="about-visual reveal reveal-delay-2">
            <img src='src/images/UMT Campus 2.jpeg' alt="UMT Campus" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">Next Gathering</div>
                <h2 className="h-lg">Featured Upcoming Event</h2>
              </div>
              <Link to="/events" className="link-underline">
                All Events &rarr;
              </Link>
            </div>
            <div className="reveal reveal-delay-1" style={{ position: 'relative' }}>
              <div className="event-feature" style={{ filter: 'blur(12px)', pointerEvents: 'none', userSelect: 'none' }}>
                <div className="media">
                  <span className="badge-live">
                    <span className="dot" /> Registration Open
                  </span>
                  <img src={IMG.wide(upcoming.id, 900, 700)} alt={upcoming.theme} />
                </div>
                <div className="content">
                  <div className="eyebrow">
                    {upcoming.theme} {upcoming.year}
                  </div>
                  <h3 className="h-md" style={{ fontSize: '28px' }}>
                    {upcoming.desc}
                  </h3>
                  <div className="card-meta" style={{ margin: '20px 0 28px' }}>
                    <span>&#128197; {formatDate(upcoming.date)}</span>
                    <span>&#128205; {upcoming.venue}</span>
                    <span>&#127908; {upcoming.speakerCount} Speakers</span>
                  </div>
                  <Link to={`/events/${upcoming.id}`} className="btn btn-primary" style={{ width: 'fit-content' }}>
                    Register Now
                  </Link>
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <h2 className="h-lg" style={{ animation: 'pulseGlow 2s infinite ease-in-out', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)', color: 'var(--white)', textAlign: 'center', padding: '20px' }}>
                  Revealing Soon
                </h2>
              </div>
            </div>
          </div>
        </section>
      )}

      <Countdown />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">On Stage</div>
              <h2 className="h-lg">Featured Speakers</h2>
            </div>
            <Link to="/speakers" className="link-underline">
              All Speakers &rarr;
            </Link>
          </div>
          <div className="grid grid-4">
            {SPEAKERS.slice(0, 4).map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Latest</div>
              <h2 className="h-lg">Announcements</h2>
            </div>
            <Link to="/blog" className="link-underline">
              Visit the Blog &rarr;
            </Link>
          </div>
          <div className="grid grid-3">
            {BLOG.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Backed By</div>
              <h2 className="h-lg">Our Sponsors</h2>
            </div>
            <Link to="/sponsors" className="link-underline">
              Sponsorship Info &rarr;
            </Link>
          </div>
          <div className="grid grid-4">
            {sponsors.map((s) => (
              <div key={s.name} className="sponsor-logo-card reveal">
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}

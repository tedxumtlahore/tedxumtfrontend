import { useReveal } from '../hooks/useReveal'
import { icon } from '../utils/format'
import { IMG } from '../utils/images'
import PageHero from '../components/common/PageHero'
import TEDImage from '../images/TED.png'
import TEDxImage from '../images/TEDx.jpg'
import PresidentImage from '../images/PresidentTEDX.png'

export default function About() {
  const ref = useReveal()

  const values = [
    ['innovation', 'Innovation', 'We seek out the idea nobody else is saying yet.'],
    ['curiosity', 'Curiosity', 'Every talk starts with a question worth chasing.'],
    ['leadership', 'Leadership', 'We give first-time speakers the same stage as veterans.'],
    ['collaboration', 'Collaboration', 'Great ideas are built by rooms full of different people.'],
    ['creativity', 'Creativity', 'Format is a tool, not a constraint — we experiment freely.'],
    ['impact', 'Community Impact', 'An idea only matters once it leaves the room.'],
  ]

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="About Us"
        title="What is TEDx, and why does it live here?"
        desc="TEDxUMT Lahore is the independently organized answer to a simple question: what happens when a university opens its stage to the whole city?"
      />

      <section className="section">
        <div className="container two-col-story">
          <div className="reveal">
            <div className="eyebrow">What is TED?</div>
            <h2 className="h-lg">Ideas worth spreading, since 1984.</h2>
            <p className="text-lead" style={{ marginTop: '16px' }}>
              TED is a nonprofit devoted to spreading ideas, usually in the form of short,
              powerful talks of eighteen minutes or less. TED began as a conference on
              Technology, Entertainment and Design, and today covers almost every topic — from
              science to business to the big global issues facing our world.
            </p>
          </div>
          <div className="about-visual reveal reveal-delay-1">
            <img src={TEDImage} alt="TED" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
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
        <div className="container two-col-story">
          <div className="about-visual reveal" style={{ order: 1 }}>
            <img src={TEDxImage} alt="TEDx" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
          </div>
          <div className="reveal reveal-delay-1" style={{ order: 2 }}>
            <div className="eyebrow">What is TEDx?</div>
            <h2 className="h-lg">Independently organized. Globally connected.</h2>
            <p className="text-lead" style={{ marginTop: '16px' }}>
              In the spirit of ideas worth spreading, TEDx is a program of local,
              self-organized events that bring people together to share a TED-like experience.
              At a TEDx event, TED Talks video and live speakers combine to spark deep
              discussion in local communities — the &quot;x&quot; signifies an independently
              organized event.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow reveal">Our Story</div>
          <h2 className="h-lg reveal">About TEDxUMT Lahore</h2>
          <p className="text-lead reveal reveal-delay-1" style={{ marginTop: '16px' }}>
            <strong>TEDxUMT Lahore</strong> is the University of Management and Technology&apos;s first officially licensed
            TEDx organization, founded in December 2025.
          </p>
          <p className="text-lead reveal reveal-delay-1" style={{ marginTop: '16px' }}>
            Built on the spirit of <em>Ideas Worth Spreading</em>, we bring together innovators, creators, researchers, entrepreneurs, and changemakers
            to spark meaningful conversations and inspire positive impact.
          </p>
          <p className="text-lead reveal reveal-delay-1" style={{ marginTop: '16px' }}>
            Through thought-provoking events and a passionate community, TEDxUMT Lahore serves as a platform where bold ideas
            connect, challenge perspectives, and shape the future.
          </p>
          <a
            href="https://www.ted.com/tedx/events/69864"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline reveal reveal-delay-2"
            style={{ display: 'inline-block', marginTop: '24px' }}
          >
            Official TED Event Listing &rarr;
          </a>
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
          <div className="grid grid-2">
            <div className="card reveal">
              <div className="card-body">
                <div className="icon-badge">{icon('mission')}</div>
                <h3>Our Mission</h3>
                <p>
                  To create a platform where ideas are judged on their merit alone — giving a
                  stage to voices that might otherwise go unheard, and an audience the room to
                  think differently.
                </p>
              </div>
            </div>
            <div className="card reveal reveal-delay-1">
              <div className="card-body">
                <div className="icon-badge">{icon('vision')}</div>
                <h3>Our Vision</h3>
                <p>
                  A Lahore where the exchange of bold ideas is a civic habit, not an annual
                  event — and where a university stage can shape a city&apos;s conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow reveal">What We Stand For</div>
          <h2 className="h-lg reveal">Core Values</h2>
          <div className="grid grid-3 value-grid" style={{ marginTop: '40px' }}>
            {values.map(([ic, title, desc], i) => (
              <div key={title} className={`card reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="card-body">
                  <div className="icon-badge">{icon(ic)}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      >
        <div className="container">
          <div className="eyebrow reveal">Guidance</div>
          <h2 className="h-lg reveal" style={{ marginBottom: '36px' }}>
            Message from the President
          </h2>
          <div className="profile-hero reveal reveal-delay-1">
            <img src={PresidentImage} alt="President & Organizer" />
            <div>
              <h3 className="h-md" style={{ fontSize: '26px' }}>
                Ayesha Bint e Hamid
              </h3>
              <p className="text-muted" style={{ margin: '6px 0 20px' }}>
                President & Official Organizer &middot; TEDxUMT Lahore
              </p>
              <p className="text-lead">
                &quot;TEDxUMT Lahore is more than an event—it's a community driven by curiosity, innovation, and the belief that ideas can transform lives. We are proud to create a space where
                every voice has the opportunity to inspire, connect, and make a meaningful impact.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

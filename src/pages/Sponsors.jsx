import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { SPONSORS } from '../data/siteData'
import { icon } from '../utils/format'
import PageHero from '../components/common/PageHero'

export default function Sponsors() {
  const ref = useReveal()

  const packages = [
    ['Silver', 'Logo placement, 4 event passes, social mention'],
    ['Gold', 'Stage mention, booth space, 10 event passes, newsletter feature'],
    ['Title', 'Naming rights, keynote intro, unlimited passes, year-round partnership'],
  ]

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Sponsors"
        title="Partner with ideas worth spreading"
        desc="Sponsorship at TEDxUMT Lahore puts your brand in front of the city's most curious minds — students, founders, and researchers alike."
      />

      <section className="section">
        <div className="container two-col-story">
          <div className="reveal">
            <div className="eyebrow">Why Sponsor</div>
            <h2 className="h-lg">Why Sponsor TEDxUMT Lahore?</h2>
            <p className="text-lead" style={{ marginTop: '16px' }}>
              Our audience isn&apos;t a captive crowd — they choose to spend a day thinking.
              Sponsors join that trust, aligning their brand with curiosity, craft, and the next
              generation of Pakistani leaders.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card reveal reveal-delay-1">
              <div className="card-body">
                <div className="icon-badge">{icon('impact')}</div>
                <h3>4,200+ Reach</h3>
                <p>Across three flagship events and our digital channels.</p>
              </div>
            </div>
            <div className="card reveal reveal-delay-2">
              <div className="card-body">
                <div className="icon-badge">{icon('collaboration')}</div>
                <h3>Curated Audience</h3>
                <p>Students, faculty, founders, and civic leaders.</p>
              </div>
            </div>
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
          <div className="eyebrow reveal">Packages</div>
          <h2 className="h-lg reveal" style={{ marginBottom: '36px' }}>
            Sponsorship Packages
          </h2>
          <div className="grid grid-3">
            {packages.map(([tier, desc], i) => (
              <div key={tier} className={`card reveal reveal-delay-${i + 1}`}>
                <div className="card-body">
                  <span className="card-tag">{tier} Tier</span>
                  <h3>{tier} Partner</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow reveal">Current Partners</div>
          <h2 className="h-lg reveal" style={{ marginBottom: '40px' }}>
            Our Sponsors
          </h2>
          {Object.entries(SPONSORS).map(([tier, list]) => (
            <div key={tier} className="sponsor-tier">
              <h3 className="reveal">{tier}</h3>
              <div className="grid grid-4">
                {list.map((s) => (
                  <div key={s.name} className="sponsor-logo-card reveal">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section newsletter">
        <div className="container">
          <h2 className="h-lg reveal">Ready to partner with us?</h2>
          <Link to="/apply" className="btn btn-primary reveal reveal-delay-1" style={{ marginTop: '20px' }}>
            Become a Sponsor
          </Link>
        </div>
      </section>
    </div>
  )
}

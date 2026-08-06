import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchSponsorTiers } from '../api/services'
import { icon } from '../utils/format'
import { useSiteConfig } from '../context/SiteConfigContext'
import PageHero from '../components/common/PageHero'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Sponsors() {
  const { settings } = useSiteConfig()
  const { data, loading, error, refetch } = useApi(fetchSponsorTiers, [], { initialData: [] })

  const tiers = data ?? []
  // Packages are described on every tier; only tiers with logos get a wall.
  const tiersWithSponsors = tiers.filter((t) => (t.sponsors ?? []).length > 0)
  const ref = useReveal([tiers.length])

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
                <h3>{settings.attendees_count} Reach</h3>
                <p>Across {settings.events_count} flagship events and our digital channels.</p>
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
          <AsyncBoundary
            loading={loading}
            error={error}
            isEmpty={tiers.length === 0}
            emptyMessage="Our sponsorship packages for this season are being finalised."
            onRetry={refetch}
          >
            <div className="grid grid-3">
              {tiers.map((tier, i) => (
                <div key={tier.id} className={`card reveal reveal-delay-${(i % 3) + 1}`}>
                  <div className="card-body">
                    <span className="card-tag">{tier.name} Tier</span>
                    <h3>{tier.name} Partner</h3>
                    {tier.description && <p>{tier.description}</p>}
                    {tier.benefit_list?.length > 0 && (
                      <ul className="benefit-list">
                        {tier.benefit_list.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>

      {tiersWithSponsors.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="eyebrow reveal">Current Partners</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '40px' }}>
              Our Sponsors
            </h2>
            {tiersWithSponsors.map((tier) => (
              <div key={tier.id} className="sponsor-tier">
                <h3 className="reveal">{tier.name}</h3>
                <div className="grid grid-4">
                  {tier.sponsors.map((s) => (
                    <SponsorLogo key={s.id} sponsor={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section newsletter">
        <div className="container">
          <h2 className="h-lg reveal">Ready to partner with us?</h2>
          <Link
            to="/apply"
            className="btn btn-primary reveal reveal-delay-1"
            style={{ marginTop: '20px' }}
          >
            Become a Sponsor
          </Link>
        </div>
      </section>
    </div>
  )
}

function SponsorLogo({ sponsor }) {
  const inner = sponsor.logo ? (
    <img src={sponsor.logo} alt={sponsor.name} loading="lazy" />
  ) : (
    sponsor.name
  )

  if (sponsor.website) {
    return (
      <a
        className="sponsor-logo-card reveal"
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    )
  }

  return <div className="sponsor-logo-card reveal">{inner}</div>
}

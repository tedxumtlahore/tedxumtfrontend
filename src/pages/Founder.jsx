import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchFounder } from '../api/services'
import PageHero from '../components/common/PageHero'
import AsyncBoundary from '../components/common/AsyncBoundary'

/**
 * The Founder section.
 *
 * Content comes from the Founder model, which has its own entry in the Django
 * admin under Website Content. There is only ever one.
 *
 * The portrait and body reuse the `profile-hero` layout from the About page
 * rather than introducing a second treatment for the same kind of content.
 */
export default function Founder() {
  const { data: founder, loading, error, refetch } = useApi(fetchFounder)
  const ref = useReveal([founder?.id])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Founder"
        title="The person who started it"
        desc="TEDxUMT Lahore began with one licence application and the belief that ideas here deserved a stage."
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        // `fetchFounder` resolves to null on a 404, which is simply the state
        // before anyone has filled the section in — not something to alarm a
        // visitor about.
        isEmpty={!founder}
        emptyMessage="Our founder's story is being written — check back shortly."
        onRetry={refetch}
      >
        {founder && (
          <section className="section">
            <div className="container">
              <div className="profile-hero reveal reveal-delay-1">
                {founder.photo && <img src={founder.photo} alt={founder.name} />}
                <div>
                  <h2 className="h-md" style={{ fontSize: '26px' }}>
                    {founder.name}
                  </h2>
                  <p className="text-muted" style={{ margin: '6px 0 20px' }}>
                    {founder.role_title}
                  </p>
                  <p className="text-lead cms-text">{founder.story}</p>
                  <FounderLinks founder={founder} />
                </div>
              </div>
            </div>
          </section>
        )}
      </AsyncBoundary>
    </div>
  )
}

/**
 * Optional contact links. Each is blank by default, so the row disappears
 * entirely rather than rendering empty anchors.
 */
function FounderLinks({ founder }) {
  const links = [
    founder.linkedin && { key: 'linkedin', label: 'LinkedIn', href: founder.linkedin },
    founder.instagram && { key: 'instagram', label: 'Instagram', href: founder.instagram },
    founder.email && { key: 'email', label: 'Email', href: `mailto:${founder.email}` },
  ].filter(Boolean)

  if (links.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
      {links.map(({ key, label, href }) => (
        <a
          key={key}
          href={href}
          className="link-underline"
          target={key === 'email' ? undefined : '_blank'}
          rel={key === 'email' ? undefined : 'noopener noreferrer'}
        >
          {label}
        </a>
      ))}
    </div>
  )
}

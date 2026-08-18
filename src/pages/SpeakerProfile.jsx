import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchSpeaker, fetchSpeakers } from '../api/services'
import { portraitFor } from '../utils/media'
import SpeakerCard from '../components/common/SpeakerCard'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

export default function SpeakerProfile() {
  const { slug } = useParams()
  const { data: sp, loading, error, refetch } = useApi(() => fetchSpeaker(slug), [slug])

  const eventSlug = sp?.event_slug
  const related = useApi(
    () => fetchSpeakers({ event: eventSlug }),
    [eventSlug],
    { initialData: [], skip: !eventSlug },
  )

  const ref = useReveal([sp, related.data?.length])

  if (error?.status === 404) return <NotFound type="Speaker" />

  if (loading || error || !sp) {
    return (
      <div style={{ paddingTop: '170px', minHeight: '60vh' }}>
        <div className="container">
          <AsyncBoundary loading={loading} error={error} onRetry={refetch}>
            <div />
          </AsyncBoundary>
        </div>
      </div>
    )
  }

  const others = (related.data ?? []).filter((s) => s.slug !== sp.slug).slice(0, 3)
  const socials = [
    sp.linkedin && ['in', sp.linkedin, 'LinkedIn'],
    sp.instagram && ['IG', sp.instagram, 'Instagram'],
    sp.website && ['@', sp.website, 'Website'],
  ].filter(Boolean)

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/speakers">Speakers</Link> / {sp.name}
          </div>
          <div className="profile-hero reveal in">
            <img src={portraitFor(sp, sp.profile_image)} alt={sp.name} />
            <div>
              {sp.event_slug ? (
                <Link to={`/events/${sp.event_slug}`} className="eyebrow">
                  {sp.event_title}
                </Link>
              ) : (
                <div className="eyebrow">{sp.event_title}</div>
              )}
              <h1 className="h-lg" style={{ fontSize: '40px' }}>
                {sp.name}
              </h1>
              <p className="text-muted" style={{ margin: '8px 0 20px' }}>
                {sp.designation}
                {sp.organization ? ` · ${sp.organization}` : ''}
              </p>
              <div className="pill" style={{ marginBottom: '20px' }}>
                &quot;{sp.talk_title}&quot;
              </div>
              <p className="text-lead cms-text">{sp.bio}</p>
              {socials.length > 0 && (
                <div className="footer-social" style={{ marginTop: '24px' }}>
                  {socials.map(([label, url, name]) => (
                    <a
                      key={name}
                      className="social-dot"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${sp.name} on ${name}`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section
          className="section"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        >
          <div className="container">
            <div className="eyebrow reveal">Also On Stage</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '32px' }}>
              Related Speakers
            </h2>
            <div className="grid grid-3">
              {others.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

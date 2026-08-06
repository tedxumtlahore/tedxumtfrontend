import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchEvent } from '../api/services'
import { formatDate, formatTime } from '../utils/format'
import { wideFor } from '../utils/media'
import SpeakerCard from '../components/common/SpeakerCard'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

export default function EventDetail() {
  const { slug } = useParams()
  const { data: ev, loading, error, refetch } = useApi(() => fetchEvent(slug), [slug])
  const ref = useReveal([ev])

  if (error?.status === 404) return <NotFound type="Event" />

  if (loading || error || !ev) {
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

  const venue = ev.venue ?? {}
  const venueLabel = [venue.name, venue.city].filter(Boolean).join(', ')
  const schedule = ev.schedule_items ?? []
  const speakers = ev.speakers ?? []

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/events">Events</Link> / {ev.title}
          </div>
          <div className="eyebrow reveal in">
            {ev.status === 'upcoming' ? 'Upcoming Event' : 'Past Event'}
          </div>
          <h1 className="h-display reveal in" style={{ fontSize: 'clamp(38px,6vw,64px)' }}>
            {ev.title}
          </h1>
          <p className="reveal in reveal-delay-1">{ev.short_description}</p>
          <div className="card-meta reveal in reveal-delay-2" style={{ marginTop: '20px' }}>
            <span>&#128197; {formatDate(ev.start_datetime)}</span>
            {venueLabel && <span>&#128205; {venueLabel}</span>}
            {ev.speaker_count > 0 && <span>&#127908; {ev.speaker_count} Speakers</span>}
          </div>
          {ev.status === 'upcoming' && (
            <a
              href={ev.registration_url || '/apply'}
              target={ev.registration_url ? '_blank' : undefined}
              rel={ev.registration_url ? 'noopener noreferrer' : undefined}
              className="btn btn-primary reveal in reveal-delay-3"
              style={{ marginTop: '28px' }}
            >
              Register Now
            </a>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="card-media reveal"
            style={{ borderRadius: '20px', border: '1px solid var(--border)', aspectRatio: '21/9' }}
          >
            <img
              src={wideFor(ev, ev.banner_image || ev.featured_image, 1400, 600)}
              alt={ev.title}
            />
          </div>
          {ev.description && (
            <p className="text-lead reveal" style={{ marginTop: '32px', maxWidth: '820px' }}>
              {ev.description}
            </p>
          )}
        </div>
      </section>

      {schedule.length > 0 && (
        <section
          className="section"
          style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div className="eyebrow reveal">Program</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '40px' }}>
              Schedule Timeline
            </h2>
            <div className="timeline reveal reveal-delay-1">
              {schedule.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="time">{formatTime(item.start_time)}</div>
                  <h4>{item.title}</h4>
                  {item.speaker_name && <p className="text-muted">{item.speaker_name}</p>}
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {speakers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="eyebrow reveal">On Stage</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '36px' }}>
              Featured Speakers
            </h2>
            <div className="grid grid-4">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="section"
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      >
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <div className="reveal">
            <div className="eyebrow">Location</div>
            <h2 className="h-lg">Venue Information</h2>
            <p className="text-lead" style={{ marginTop: '14px' }}>
              {venue.address ? `${venue.name} — ${venue.address}` : venueLabel}. Parking and shuttle
              service available from the main campus gate; accessibility support on request.
            </p>
            {venue.google_maps && (
              <a
                href={venue.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
                style={{ display: 'inline-block', marginTop: '18px' }}
              >
                Open in Google Maps &rarr;
              </a>
            )}
          </div>
          <div className="map-placeholder reveal reveal-delay-1">
            Map preview — {venueLabel || 'venue to be announced'}
          </div>
        </div>
      </section>
    </div>
  )
}

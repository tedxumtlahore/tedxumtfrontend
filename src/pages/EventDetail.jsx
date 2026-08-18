import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchEvent, fetchEventTicketing } from '../api/services'
import { formatDate, formatTime } from '../utils/format'
import { wideFor } from '../utils/media'
import SpeakerCard from '../components/common/SpeakerCard'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

/**
 * The register button, driven by the event's live ticketing state.
 *
 * Rendered separately so a slow ticketing lookup never delays the rest of the
 * page, and so a closed or sold-out event says why rather than offering a
 * button that fails on submit.
 */
function RegisterCta({ event }) {
  const { data } = useApi(() => fetchEventTicketing(event.slug), [event.slug])

  if (!data) return null

  if (!data.registration_is_open) {
    // An external registration_url still wins if ticketing is not being used.
    if (event.registration_url) {
      return (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary reveal in reveal-delay-3"
          style={{ marginTop: '28px' }}
        >
          Register Now
        </a>
      )
    }
    return (
      <p className="reveal in reveal-delay-3 text-muted" style={{ marginTop: '28px' }}>
        {data.closed_reason}
      </p>
    )
  }

  return (
    <div className="reveal in reveal-delay-3" style={{ marginTop: '28px' }}>
      <Link to={`/events/${event.slug}/register`} className="btn btn-primary">
        {data.is_free ? 'Get a free ticket' : `Register — ${data.currency} ${data.ticket_price}`}
      </Link>
      {data.seats_remaining !== null && data.seats_remaining <= 20 && (
        <p className="form-note" style={{ marginTop: '10px' }}>
          Only {data.seats_remaining} seat{data.seats_remaining === 1 ? '' : 's'} left.
        </p>
      )}
    </div>
  )
}

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
          {ev.status === 'upcoming' && <RegisterCta event={ev} />}
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
            <p className="text-lead reveal cms-text" style={{ marginTop: '32px', maxWidth: '820px' }}>
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
                  <p className="cms-text">{item.description}</p>
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

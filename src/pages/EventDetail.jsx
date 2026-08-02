import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { findEvent } from '../utils/helpers'
import { SPEAKERS } from '../data/siteData'
import { IMG } from '../utils/images'
import { formatDate } from '../utils/format'
import SpeakerCard from '../components/common/SpeakerCard'
import NotFound from './NotFound'

export default function EventDetail() {
  const { id } = useParams()
  const ref = useReveal()
  const ev = findEvent(id)

  if (!ev) return <NotFound type="Event" />

  const relatedSpeakers = SPEAKERS.filter((s) =>
    s.event.toLowerCase().includes(ev.theme.toLowerCase()),
  )

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/events">Events</Link> / {ev.theme} {ev.year}
          </div>
          <div className="eyebrow reveal in">
            {ev.status === 'upcoming' ? 'Upcoming Event' : 'Past Event'}
          </div>
          <h1 className="h-display reveal in" style={{ fontSize: 'clamp(38px,6vw,64px)' }}>
            {ev.theme} {ev.year}
          </h1>
          <p className="reveal in reveal-delay-1">{ev.desc}</p>
          <div className="card-meta reveal in reveal-delay-2" style={{ marginTop: '20px' }}>
            <span>&#128197; {formatDate(ev.date)}</span>
            <span>&#128205; {ev.venue}</span>
            <span>&#127908; {ev.speakerCount} Speakers</span>
          </div>
          {ev.status === 'upcoming' && (
            <Link
              to="/apply"
              className="btn btn-primary reveal in reveal-delay-3"
              style={{ marginTop: '28px' }}
            >
              Register Now
            </Link>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="card-media reveal"
            style={{ borderRadius: '20px', border: '1px solid var(--border)', aspectRatio: '21/9' }}
          >
            <img src={IMG.wide(ev.id, 1400, 600)} alt={ev.theme} />
          </div>
        </div>
      </section>

      {ev.schedule && (
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
              {ev.schedule.map((s) => (
                <div key={s.time + s.title} className="timeline-item">
                  <div className="time">{s.time}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedSpeakers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="eyebrow reveal">On Stage</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '36px' }}>
              Featured Speakers
            </h2>
            <div className="grid grid-4">
              {relatedSpeakers.map((speaker) => (
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
              {ev.venue}. Parking and shuttle service available from the main campus gate;
              accessibility support on request.
            </p>
          </div>
          <div className="map-placeholder reveal reveal-delay-1">
            Map preview — {ev.venue}
          </div>
        </div>
      </section>
    </div>
  )
}

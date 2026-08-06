import { Link } from 'react-router-dom'
import { formatDate, daysUntil } from '../../utils/format'
import { wideFor } from '../../utils/media'

export default function EventCard({ event: ev }) {
  const isUpcoming = ev.status === 'upcoming'
  const venue = [ev.venue_name, ev.venue_city].filter(Boolean).join(', ')

  const badge = isUpcoming ? (
    <span className="pill">{daysUntil(ev.start_datetime)} days to go</span>
  ) : (
    <span
      className="pill"
      style={{
        background: 'rgba(255,255,255,.06)',
        color: 'var(--muted)',
        borderColor: 'var(--border)',
      }}
    >
      {ev.year}
    </span>
  )

  return (
    <Link to={`/events/${ev.slug}`} className="card reveal">
      <div className="card-media">
        <img
          src={wideFor(ev, ev.featured_image)}
          alt={`${ev.title} event banner`}
          loading="lazy"
        />
      </div>
      <div className="card-body">
        {badge}
        <h3>{ev.title}</h3>
        <p>{ev.short_description}</p>
        <div className="card-meta">
          <span>&#128197; {formatDate(ev.start_datetime)}</span>
          {venue && <span>&#128205; {venue}</span>}
        </div>
        <div style={{ marginTop: '18px' }}>
          <span className="link-underline">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  )
}

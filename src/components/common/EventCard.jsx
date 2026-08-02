import { Link } from 'react-router-dom'
import { IMG } from '../../utils/images'
import { formatDate, daysUntil } from '../../utils/format'

export default function EventCard({ event: ev }) {
  const badge =
    ev.status === 'upcoming' ? (
      <span className="pill">{daysUntil(ev.date)} days to go</span>
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
    <Link to={`/events/${ev.id}`} className="card reveal">
      <div className="card-media">
        <img src={IMG.wide(ev.id)} alt={`${ev.theme} event banner`} loading="lazy" />
      </div>
      <div className="card-body">
        {badge}
        <h3>
          {ev.theme} {ev.year}
        </h3>
        <p>{ev.desc}</p>
        <div className="card-meta">
          <span>&#128197; {formatDate(ev.date)}</span>
          <span>&#128205; {ev.venue}</span>
        </div>
        <div style={{ marginTop: '18px' }}>
          <span className="link-underline">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  )
}

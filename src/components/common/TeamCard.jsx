import { portraitFor } from '../../utils/media'

export default function TeamCard({ member: m }) {
  return (
    <div className="person-card reveal">
      <img src={portraitFor(m, m.photo)} alt={m.name} loading="lazy" />
      <div className="person-overlay">
        <span className="role">{m.department_name}</span>
        <h4>{m.name}</h4>
        <p className="topic">{m.role}</p>
        <div className="person-social">
          {m.linkedin && (
            <a
              className="social-dot"
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on LinkedIn`}
            >
              in
            </a>
          )}
          {m.instagram && (
            <a
              className="social-dot"
              href={m.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on Instagram`}
            >
              IG
            </a>
          )}
          {m.email && (
            <a className="social-dot" href={`mailto:${m.email}`} aria-label={`Email ${m.name}`}>
              @
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

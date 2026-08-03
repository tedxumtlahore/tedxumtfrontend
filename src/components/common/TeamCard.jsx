import { IMG } from '../../utils/images'

export default function TeamCard({ member: m }) {
  return (
    <div className="person-card reveal">
      <img src={m.imgSrc || IMG.portrait(m.seed)} alt={m.name} loading="lazy" />
      <div className="person-overlay">
        <span className="role">{m.dept}</span>
        <h4>{m.name}</h4>
        <p className="topic">{m.role}</p>
        <div className="person-social">
        {m.linkedin && (
          <a className="social-dot" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
        )}
      </div>
      </div>
    </div>
  )
}

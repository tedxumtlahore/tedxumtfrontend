import { Link } from 'react-router-dom'
import { IMG } from '../../utils/images'

export default function SpeakerCard({ speaker: sp }) {
  return (
    <Link to={`/speakers/${sp.id}`} className="person-card reveal">
      <img src={IMG.portrait(sp.seed)} alt={sp.name} loading="lazy" />
      <div className="person-overlay">
        <span className="role">{sp.profession}</span>
        <h4>{sp.name}</h4>
        <p className="topic">&quot;{sp.topic}&quot;</p>
        <div className="person-social">
          <span className="social-dot">in</span>
          <span className="social-dot">tw</span>
          <span className="social-dot">@</span>
        </div>
      </div>
    </Link>
  )
}

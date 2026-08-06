import { Link } from 'react-router-dom'
import { portraitFor } from '../../utils/media'

export default function SpeakerCard({ speaker: sp }) {
  return (
    <Link to={`/speakers/${sp.slug}`} className="person-card reveal">
      <img src={portraitFor(sp, sp.profile_image)} alt={sp.name} loading="lazy" />
      <div className="person-overlay">
        <span className="role">{sp.designation}</span>
        <h4>{sp.name}</h4>
        <p className="topic">&quot;{sp.talk_title}&quot;</p>
        {sp.organization && <p className="org">{sp.organization}</p>}
      </div>
    </Link>
  )
}

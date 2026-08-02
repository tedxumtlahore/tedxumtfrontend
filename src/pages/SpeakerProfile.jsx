import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { findSpeaker } from '../utils/helpers'
import { SPEAKERS } from '../data/siteData'
import { IMG } from '../utils/images'
import SpeakerCard from '../components/common/SpeakerCard'
import NotFound from './NotFound'

export default function SpeakerProfile() {
  const { id } = useParams()
  const ref = useReveal()
  const sp = findSpeaker(id)

  if (!sp) return <NotFound type="Speaker" />

  const related = SPEAKERS.filter((s) => s.id !== sp.id && s.event === sp.event).slice(0, 3)

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/speakers">Speakers</Link> / {sp.name}
          </div>
          <div className="profile-hero reveal in">
            <img src={IMG.portrait(sp.seed, 600, 760)} alt={sp.name} />
            <div>
              <div className="eyebrow">{sp.event}</div>
              <h1 className="h-lg" style={{ fontSize: '40px' }}>
                {sp.name}
              </h1>
              <p className="text-muted" style={{ margin: '8px 0 20px' }}>
                {sp.profession} &middot; {sp.org}
              </p>
              <div className="pill" style={{ marginBottom: '20px' }}>
                &quot;{sp.topic}&quot;
              </div>
              <p className="text-lead">{sp.bio}</p>
              <div className="footer-social" style={{ marginTop: '24px' }}>
                <span className="social-dot">in</span>
                <span className="social-dot">tw</span>
                <span className="social-dot">@</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
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
              {related.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { icon } from '../utils/format'
import PageHero from '../components/common/PageHero'

export default function Apply() {
  const ref = useReveal()

  const cards = [
    ['speaker', 'Become a Speaker', "Pitch us the idea you can't stop thinking about."],
    ['volunteer', 'Volunteer', 'Join the crew that makes event day run without a hitch.'],
    ['team', 'Join the Team', 'Work year-round with our organizing committee.'],
    ['partner', 'Become a Partner', 'Collaborate with us on programming or community initiatives.'],
    ['sponsor', 'Become a Sponsor', "Put your brand in front of Lahore's most curious minds."],
  ]

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Apply"
        title="However you want in, there's a seat here"
        desc="Speak, volunteer, sponsor, or join the team that builds it all."
      />

      <section className="section">
        <div className="container grid grid-3">
          {cards.map(([ic, title, desc], i) => (
            <div key={title} className={`apply-card reveal reveal-delay-${(i % 3) + 1}`}>
              <div className="icon-badge">{icon(ic)}</div>
              <h3>{title}</h3>
              <p style={{ margin: '10px 0 22px' }}>{desc}</p>
              <Link to="/contact" className="link-underline">
                Apply Now &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

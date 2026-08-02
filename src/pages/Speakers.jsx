import { useReveal } from '../hooks/useReveal'
import { SPEAKERS } from '../data/siteData'
import PageHero from '../components/common/PageHero'
import SpeakerCard from '../components/common/SpeakerCard'

export default function Speakers() {
  const ref = useReveal()

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Speakers"
        title="Voices that shaped our stage"
        desc="Researchers, builders, and storytellers who turned eighteen minutes into something people still talk about."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {SPEAKERS.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchSpeakers } from '../api/services'
import PageHero from '../components/common/PageHero'
import SpeakerCard from '../components/common/SpeakerCard'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Speakers() {
  const { data, loading, error, refetch } = useApi(
    () => fetchSpeakers({ page_size: 100 }),
    [],
    { initialData: [] },
  )

  const speakers = data ?? []
  const ref = useReveal([speakers.length])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Speakers"
        title="Voices that shaped our stage"
        desc="Researchers, builders, and storytellers who turned eighteen minutes into something people still talk about."
      />

      <section className="section">
        <div className="container">
          <AsyncBoundary
            loading={loading}
            error={error}
            isEmpty={speakers.length === 0}
            emptyMessage="Our speaker lineup is being finalised — check back soon."
            onRetry={refetch}
          >
            <div className="grid grid-4">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>
    </div>
  )
}

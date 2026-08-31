import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchFounder } from '../api/services'
import PageHero from '../components/common/PageHero'
import AsyncBoundary from '../components/common/AsyncBoundary'

/**
 * The Founder section.
 *
 * Content is a `Message` with message_type='founder', edited in the Django
 * admin under Messages — the same place the President and Organizer notes
 * live, so there is nothing new for an editor to learn.
 *
 * The portrait and body reuse the `profile-hero` layout from the About page
 * rather than introducing a second treatment for the same kind of content.
 */
export default function Founder() {
  const { data: founder, loading, error, refetch } = useApi(fetchFounder)
  const ref = useReveal([founder?.id])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Founder"
        title="The person who started it"
        desc="TEDxUMT Lahore began with one licence application and the belief that ideas here deserved a stage."
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        // `fetchFounder` resolves to null on a 404, which is simply the state
        // before anyone has filled the section in — not something to alarm a
        // visitor about.
        isEmpty={!founder}
        emptyMessage="Our founder's story is being written — check back shortly."
        onRetry={refetch}
      >
        {founder && (
          <section className="section">
            <div className="container">
              <div className="profile-hero reveal reveal-delay-1">
                {founder.photo && <img src={founder.photo} alt={founder.person_name} />}
                <div>
                  <h2 className="h-md" style={{ fontSize: '26px' }}>
                    {founder.person_name}
                  </h2>
                  <p className="text-muted" style={{ margin: '6px 0 20px' }}>
                    {founder.role_title}
                  </p>
                  <p className="text-lead cms-text">{founder.message_body}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </AsyncBoundary>
    </div>
  )
}

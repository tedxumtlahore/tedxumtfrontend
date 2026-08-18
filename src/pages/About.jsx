import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchAbout } from '../api/services'
import { icon } from '../utils/format'
import { useSiteConfig } from '../context/SiteConfigContext'
import PageHero from '../components/common/PageHero'
import AsyncBoundary from '../components/common/AsyncBoundary'
import TEDImage from '../images/TED.png'
import TEDxImage from '../images/TEDx.jpg'
import OathImage from '../images/OathTEDX.jpeg'

/**
 * Bundled artwork used when an editor hasn't uploaded a section image yet.
 * Keyed by section_key so each section keeps its intended illustration.
 */
const FALLBACK_IMAGES = {
  what_is_ted: TEDImage,
  what_is_tedx: TEDxImage,
  our_story: OathImage,
}

// Mission and Vision render as a card pair rather than image sections.
const CARD_SECTIONS = ['mission', 'vision']

export default function About() {
  const { settings } = useSiteConfig()
  const { data, loading, error, refetch } = useApi(fetchAbout, [], {
    initialData: { sections: [], values: [], messages: [] },
  })

  const sections = data?.sections ?? []
  const values = data?.values ?? []
  const messages = data?.messages ?? []

  const storySections = sections.filter((s) => !CARD_SECTIONS.includes(s.section_key))
  const cardSections = sections.filter((s) => CARD_SECTIONS.includes(s.section_key))

  const ref = useReveal([sections.length, values.length, messages.length])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="About Us"
        title="What is TEDx, and why does it live here?"
        desc="TEDxUMT Lahore is the independently organized answer to a simple question: what happens when a university opens its stage to the whole city?"
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={sections.length === 0 && values.length === 0}
        emptyMessage="Our About page is being written — check back shortly."
        onRetry={refetch}
      >
        <>
          {storySections.map((section, i) => (
            <StorySection
              key={section.id}
              section={section}
              tedEventUrl={settings.ted_event_url}
              shaded={i % 2 === 1}
            />
          ))}

          {cardSections.length > 0 && (
            <section
              className="section"
              style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="container">
                <div className="grid grid-2">
                  {cardSections.map((section, i) => (
                    <div key={section.id} className={`card reveal${i ? ` reveal-delay-${i}` : ''}`}>
                      <div className="card-body">
                        <div className="icon-badge">{icon(section.section_key)}</div>
                        <h3>{section.heading}</h3>
                        <p className="cms-text">{section.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {values.length > 0 && (
            <section className="section">
              <div className="container">
                <div className="eyebrow reveal">What We Stand For</div>
                <h2 className="h-lg reveal">Core Values</h2>
                <div className="grid grid-3 value-grid" style={{ marginTop: '40px' }}>
                  {values.map((value, i) => (
                    <div key={value.id} className={`card reveal reveal-delay-${(i % 4) + 1}`}>
                      <div className="card-body">
                        <div className="icon-badge">{icon(value.icon_key)}</div>
                        <h3>{value.title}</h3>
                        <p className="cms-text">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {messages.map((message, i) => (
            <section
              key={message.id}
              className="section"
              style={
                i % 2 === 0
                  ? { background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }
                  : undefined
              }
            >
              <div className="container">
                <div className="eyebrow reveal">Guidance</div>
                <h2 className="h-lg reveal" style={{ marginBottom: '36px' }}>
                  Message from the {message.message_type === 'president' ? 'President' : 'Team'}
                </h2>
                <div className="profile-hero reveal reveal-delay-1">
                  {message.photo && <img src={message.photo} alt={message.person_name} />}
                  <div>
                    <h3 className="h-md" style={{ fontSize: '26px' }}>
                      {message.person_name}
                    </h3>
                    <p className="text-muted" style={{ margin: '6px 0 20px' }}>
                      {message.role_title}
                    </p>
                    <p className="text-lead cms-text">&quot;{message.message_body}&quot;</p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </>
      </AsyncBoundary>
    </div>
  )
}

function StorySection({ section, tedEventUrl, shaded }) {
  const image = section.image || FALLBACK_IMAGES[section.section_key]
  const imageFirst = section.image_position === 'left'
  const linkUrl =
    section.external_link_url || (section.section_key === 'our_story' ? tedEventUrl : null)
  const linkLabel = section.external_link_label || 'Official TED Event Listing'

  const text = (
    <div className="reveal" style={{ order: imageFirst ? 2 : 1 }}>
      {section.eyebrow && <div className="eyebrow">{section.eyebrow}</div>}
      <h2 className="h-lg">{section.heading}</h2>
      <p className="text-lead cms-text" style={{ marginTop: '16px' }}>
        {section.body}
      </p>
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
          style={{ display: 'inline-block', marginTop: '24px' }}
        >
          {linkLabel} &rarr;
        </a>
      )}
    </div>
  )

  const visual = image ? (
    <div className="about-visual reveal reveal-delay-1" style={{ order: imageFirst ? 1 : 2 }}>
      <img
        src={image}
        alt={section.heading}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  ) : null

  return (
    <section
      className="section"
      style={
        shaded
          ? {
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }
          : undefined
      }
    >
      <div className="container two-col-story">
        {imageFirst ? (
          <>
            {visual}
            {text}
          </>
        ) : (
          <>
            {text}
            {visual}
          </>
        )}
      </div>
    </section>
  )
}

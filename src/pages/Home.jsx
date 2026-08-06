import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { useSiteConfig } from '../context/SiteConfigContext'
import { fetchBlogIndex, fetchEvents, fetchSpeakers, fetchSponsorTiers } from '../api/services'
import { formatDate } from '../utils/format'
import { wideFor } from '../utils/media'
import campusImg from '../images/UMT Campus 2.jpeg'
import Hero from '../components/home/Hero'
import Countdown from '../components/home/Countdown'
import Newsletter from '../components/home/Newsletter'
import SpeakerCard from '../components/common/SpeakerCard'
import BlogCard from '../components/common/BlogCard'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Home() {
  const { settings } = useSiteConfig()

  const events = useApi(() => fetchEvents({ status: 'upcoming' }), [], { initialData: [] })
  const speakers = useApi(() => fetchSpeakers({ page_size: 4 }), [], { initialData: [] })
  const blog = useApi(fetchBlogIndex, [], { initialData: { featured: null, posts: [] } })
  const sponsors = useApi(fetchSponsorTiers, [], { initialData: [] })

  const upcoming = events.data?.[0] ?? null
  const featuredSpeakers = (speakers.data ?? []).slice(0, 4)
  const posts = [blog.data?.featured, ...(blog.data?.posts ?? [])].filter(Boolean).slice(0, 3)
  const sponsorLogos = (sponsors.data ?? []).flatMap((tier) => tier.sponsors ?? []).slice(0, 4)

  // Re-run the reveal observer once the async sections have rendered.
  const ref = useReveal([upcoming, featuredSpeakers.length, posts.length, sponsorLogos.length])

  return (
    <div ref={ref}>
      <Hero />

      <section className="section about-preview">
        <div className="container grid grid-2">
          <div className="reveal">
            <div className="eyebrow">About Us</div>
            <h2 className="h-lg">
              Where the University
              <br />
              of Management and Technology
              <br />
              meets the world stage.
            </h2>
            <p className="text-lead" style={{ margin: '20px 0 28px' }}>
              {settings.about_summary}
            </p>
            <Link to="/about" className="link-underline">
              Read Our Story &rarr;
            </Link>
            <div className="stat-row">
              <div>
                <div className="num">{settings.events_count}</div>
                <div className="lbl">Events Hosted</div>
              </div>
              <div>
                <div className="num">{settings.speakers_count}</div>
                <div className="lbl">Speakers</div>
              </div>
              <div>
                <div className="num">{settings.attendees_count}</div>
                <div className="lbl">Attendees</div>
              </div>
            </div>
          </div>
          <div className="about-visual reveal reveal-delay-2">
            <img
              src={campusImg}
              alt="UMT Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">Next Gathering</div>
                <h2 className="h-lg">Featured Upcoming Event</h2>
              </div>
              <Link to="/events" className="link-underline">
                All Events &rarr;
              </Link>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="event-feature">
                <div className="media">
                  {upcoming.registration_url && (
                    <span className="badge-live">
                      <span className="dot" /> Registration Open
                    </span>
                  )}
                  <img
                    src={wideFor(upcoming, upcoming.banner_image || upcoming.featured_image, 900, 700)}
                    alt={upcoming.title}
                  />
                </div>
                <div className="content">
                  <div className="eyebrow">{upcoming.title}</div>
                  <h3 className="h-md" style={{ fontSize: '28px' }}>
                    {upcoming.short_description}
                  </h3>
                  <div className="card-meta" style={{ margin: '20px 0 28px' }}>
                    <span>&#128197; {formatDate(upcoming.start_datetime)}</span>
                    <span>&#128205; {upcoming.venue_name}</span>
                    {upcoming.speaker_count > 0 && (
                      <span>&#127908; {upcoming.speaker_count} Speakers</span>
                    )}
                  </div>
                  <Link
                    to={`/events/${upcoming.slug}`}
                    className="btn btn-primary"
                    style={{ width: 'fit-content' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Countdown event={upcoming} />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">On Stage</div>
              <h2 className="h-lg">Featured Speakers</h2>
            </div>
            <Link to="/speakers" className="link-underline">
              All Speakers &rarr;
            </Link>
          </div>
          <AsyncBoundary
            loading={speakers.loading}
            error={speakers.error}
            isEmpty={featuredSpeakers.length === 0}
            emptyMessage="Speakers for the next event are being announced soon."
            onRetry={speakers.refetch}
          >
            <div className="grid grid-4">
              {featuredSpeakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Latest</div>
              <h2 className="h-lg">Announcements</h2>
            </div>
            <Link to="/blog" className="link-underline">
              Visit the Blog &rarr;
            </Link>
          </div>
          <AsyncBoundary
            loading={blog.loading}
            error={blog.error}
            isEmpty={posts.length === 0}
            emptyMessage="No announcements yet."
            onRetry={blog.refetch}
          >
            <div className="grid grid-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Backed By</div>
              <h2 className="h-lg">Our Sponsors</h2>
            </div>
            <Link to="/sponsors" className="link-underline">
              Sponsorship Info &rarr;
            </Link>
          </div>
          <AsyncBoundary
            loading={sponsors.loading}
            error={sponsors.error}
            isEmpty={sponsorLogos.length === 0}
            emptyMessage="Sponsors for this season will be announced shortly."
            onRetry={sponsors.refetch}
          >
            <div className="grid grid-4">
              {sponsorLogos.map((s) => (
                <div key={s.id} className="sponsor-logo-card reveal">
                  {s.logo ? <img src={s.logo} alt={s.name} /> : s.name}
                </div>
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}

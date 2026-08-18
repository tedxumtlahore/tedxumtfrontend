import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchBlogIndex } from '../api/services'
import { formatShortDate } from '../utils/format'
import { wideFor } from '../utils/media'
import PageHero from '../components/common/PageHero'
import BlogCard from '../components/common/BlogCard'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Blog() {
  const { data, loading, error, refetch } = useApi(fetchBlogIndex, [], {
    initialData: { featured: null, posts: [], categories: [] },
  })

  const featured = data?.featured ?? null
  const rest = data?.posts ?? []
  const ref = useReveal([featured, rest.length])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Blog"
        title="Writing from the TEDxUMT Lahore team"
        desc="Essays, recaps, and the occasional behind-the-scenes look at how we build the event."
      />

      <section className="section">
        <div className="container">
          <AsyncBoundary
            loading={loading}
            error={error}
            isEmpty={!featured && rest.length === 0}
            emptyMessage="No posts published yet — our first article is on the way."
            onRetry={refetch}
          >
            <>
              {featured && (
                <Link
                  to={`/blog/${featured.slug}`}
                  className="card reveal blog-featured"
                  style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}
                >
                  <div className="card-media" style={{ aspectRatio: 'auto' }}>
                    <img
                      src={wideFor(featured, featured.cover_image, 900, 700)}
                      alt={featured.title}
                    />
                  </div>
                  <div
                    className="card-body"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '44px',
                    }}
                  >
                    <span className="card-tag">{featured.category_name}</span>
                    <h3 style={{ fontSize: '26px' }}>{featured.title}</h3>
                    <p className="cms-text">{featured.excerpt}</p>
                    <div className="card-meta">
                      <span>{formatShortDate(featured.published_at)}</span>
                      {featured.reading_minutes > 0 && (
                        <span>{featured.reading_minutes} min read</span>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid grid-3" style={{ marginTop: featured ? '40px' : 0 }}>
                  {rest.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          </AsyncBoundary>
        </div>
      </section>
    </div>
  )
}

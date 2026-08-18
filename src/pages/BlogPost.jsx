import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchBlogPost } from '../api/services'
import { formatShortDate } from '../utils/format'
import { wideFor } from '../utils/media'
import BlogCard from '../components/common/BlogCard'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams()
  const { data: post, loading, error, refetch } = useApi(() => fetchBlogPost(slug), [slug])
  const ref = useReveal([post])

  if (error?.status === 404) return <NotFound type="Article" />

  if (loading || error || !post) {
    return (
      <div style={{ paddingTop: '170px', minHeight: '60vh' }}>
        <div className="container">
          <AsyncBoundary loading={loading} error={error} onRetry={refetch}>
            <div />
          </AsyncBoundary>
        </div>
      </div>
    )
  }

  const related = post.related_posts ?? []

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/blog">Blog</Link> / {post.title}
          </div>
          <span className="card-tag reveal in">{post.category_name}</span>
          <h1
            className="h-lg reveal in"
            style={{ fontSize: 'clamp(32px,5vw,50px)', marginTop: '10px' }}
          >
            {post.title}
          </h1>
          <p className="text-muted reveal in reveal-delay-1" style={{ marginTop: '12px' }}>
            {formatShortDate(post.published_at)} &middot; {post.author_name}
            {post.reading_minutes > 0 && ` · ${post.reading_minutes} min read`}
          </p>
          {(post.tags ?? []).length > 0 && (
            <div className="tag-row reveal in reveal-delay-2" style={{ marginTop: '14px' }}>
              {post.tags.map((tag) => (
                <span key={tag.id} className="card-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div
            className="card-media reveal"
            style={{ borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '40px' }}
          >
            <img src={wideFor(post, post.cover_image, 1200, 700)} alt={post.title} />
          </div>
          <p className="text-lead reveal cms-text" style={{ maxWidth: 'none', fontSize: '19px' }}>
            {post.excerpt}
          </p>
          {/* Content is authored as plain text in the CMS; each blank line is a paragraph. */}
          {String(post.content || '')
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p
                key={i}
                className="reveal cms-text"
                style={{ marginTop: i === 0 ? '22px' : '16px', color: 'var(--light)' }}
              >
                {paragraph}
              </p>
            ))}
          <Link
            to="/blog"
            className="link-underline reveal"
            style={{ marginTop: '32px', display: 'inline-flex' }}
          >
            &larr; Back to Blog
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="section"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        >
          <div className="container">
            <div className="eyebrow reveal">Keep Reading</div>
            <h2 className="h-lg reveal" style={{ marginBottom: '32px' }}>
              More from {post.category_name}
            </h2>
            <div className="grid grid-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

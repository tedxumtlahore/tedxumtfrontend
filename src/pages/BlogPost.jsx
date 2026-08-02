import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { findBlogPost } from '../utils/helpers'
import { IMG } from '../utils/images'
import NotFound from './NotFound'

export default function BlogPost() {
  const { id } = useParams()
  const ref = useReveal()
  const post = findBlogPost(id)

  if (!post) return <NotFound type="Article" />

  return (
    <div ref={ref}>
      <section className="page-hero" style={{ paddingTop: '170px' }}>
        <div className="container">
          <div className="breadcrumb reveal in">
            <Link to="/blog">Blog</Link> / {post.title}
          </div>
          <span className="card-tag reveal in">{post.category}</span>
          <h1 className="h-lg reveal in" style={{ fontSize: 'clamp(32px,5vw,50px)', marginTop: '10px' }}>
            {post.title}
          </h1>
          <p className="text-muted reveal in reveal-delay-1" style={{ marginTop: '12px' }}>
            {post.date} &middot; TEDxUMT Lahore Team
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div
            className="card-media reveal"
            style={{ borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '40px' }}
          >
            <img src={IMG.wide(post.seed, 1200, 700)} alt={post.title} />
          </div>
          <p className="text-lead reveal" style={{ maxWidth: 'none', fontSize: '19px' }}>
            {post.excerpt}
          </p>
          <p className="reveal" style={{ marginTop: '22px', color: 'var(--light)' }}>
            Every year, our programming committee begins with a wide net — open calls, faculty
            nominations, and a fair share of cold outreach to people doing work we admire from a
            distance. What follows is months of coaching, cutting, and rewriting, all in service
            of the same goal: eighteen minutes that earn their place on the stage.
          </p>
          <p className="reveal" style={{ marginTop: '16px', color: 'var(--light)' }}>
            That process rarely feels glamorous from the inside. It&apos;s Google Docs with more
            comments than text, rehearsal rooms booked past midnight, and speakers rewriting their
            opening line for the ninth time. But it&apos;s also the only way we know to protect
            what makes a TEDx talk different from a keynote — the sense that an idea is still
            being discovered, live, in front of you.
          </p>
          <Link to="/blog" className="link-underline reveal" style={{ marginTop: '32px', display: 'inline-flex' }}>
            &larr; Back to Blog
          </Link>
        </div>
      </section>
    </div>
  )
}

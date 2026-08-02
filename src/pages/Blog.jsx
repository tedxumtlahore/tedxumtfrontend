import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { BLOG } from '../data/siteData'
import { IMG } from '../utils/images'
import PageHero from '../components/common/PageHero'
import BlogCard from '../components/common/BlogCard'

export default function Blog() {
  const ref = useReveal()
  const featured = BLOG.find((b) => b.featured)
  const rest = BLOG.filter((b) => !b.featured)

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Blog"
        title="Writing from the TEDxUMT Lahore team"
        desc="Essays, recaps, and the occasional behind-the-scenes look at how we build the event."
      />

      {featured && (
        <section className="section">
          <div className="container">
            <Link
              to={`/blog/${featured.id}`}
              className="card reveal"
              style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}
            >
              <div className="card-media" style={{ aspectRatio: 'auto' }}>
                <img src={IMG.wide(featured.seed, 900, 700)} alt={featured.title} />
              </div>
              <div
                className="card-body"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '44px' }}
              >
                <span className="card-tag">{featured.category}</span>
                <h3 style={{ fontSize: '26px' }}>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <div className="card-meta">
                  <span>{featured.date}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { formatShortDate } from '../../utils/format'
import { wideFor } from '../../utils/media'

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card reveal">
      <div className="card-media">
        <img src={wideFor(post, post.cover_image)} alt={post.title} loading="lazy" />
      </div>
      <div className="card-body">
        <span className="card-tag">{post.category_name}</span>
        <h3>{post.title}</h3>
        <p className="cms-text">{post.excerpt}</p>
        <div className="card-meta">
          <span>{formatShortDate(post.published_at)}</span>
          {post.reading_minutes > 0 && <span>{post.reading_minutes} min read</span>}
        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { IMG } from '../../utils/images'

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} className="card reveal">
      <div className="card-media">
        <img src={IMG.wide(post.seed)} alt={post.title} loading="lazy" />
      </div>
      <div className="card-body">
        <span className="card-tag">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="card-meta">
          <span>{post.date}</span>
        </div>
      </div>
    </Link>
  )
}

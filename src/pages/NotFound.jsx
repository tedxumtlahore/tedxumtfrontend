import { Link } from 'react-router-dom'

export default function NotFound({ type = 'Page' }) {
  return (
    <section className="section" style={{ paddingTop: '200px', textAlign: 'center' }}>
      <div className="container">
        <div className="eyebrow reveal in" style={{ justifyContent: 'center' }}>
          404
        </div>
        <h1 className="h-lg reveal in">{type} not found</h1>
        <p className="reveal in reveal-delay-1" style={{ margin: '14px auto 28px' }}>
          The idea you&apos;re looking for may have moved, or never existed.
        </p>
        <Link to="/" className="btn btn-primary reveal in reveal-delay-2">
          Back Home
        </Link>
      </div>
    </section>
  )
}

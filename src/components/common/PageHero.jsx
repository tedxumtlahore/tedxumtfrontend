export default function PageHero({ eyebrow, title, desc, children, style }) {
  return (
    <section className="page-hero" style={style}>
      <div className="container">
        <div className="eyebrow reveal in">{eyebrow}</div>
        <h1 className="h-display reveal in" style={{ fontSize: 'clamp(38px,6vw,64px)' }}>
          {title}
        </h1>
        {desc ? <p className="reveal in reveal-delay-1">{desc}</p> : null}
        {children}
      </div>
    </section>
  )
}

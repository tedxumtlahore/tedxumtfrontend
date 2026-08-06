/**
 * Teaser shown when the next event exists but is still a draft.
 *
 * The card underneath is entirely placeholder text — the real event's title,
 * date, and venue are never sent to the browser while it is unpublished, so
 * there is nothing here to uncover by removing the blur.
 */
export default function ComingSoonEvent() {
  return (
    <div className="coming-soon-wrap reveal reveal-delay-1">
      <div className="event-feature coming-soon-card" aria-hidden="true">
        <div className="media">
          <div className="coming-soon-media" />
        </div>
        <div className="content">
          <div className="eyebrow">Next Event</div>
          <h3 className="h-md" style={{ fontSize: '28px' }}>
            Something worth showing up for is being put together right now.
          </h3>
          <div className="card-meta" style={{ margin: '20px 0 28px' }}>
            <span>&#128197; Date to be announced</span>
            <span>&#128205; Venue to be announced</span>
          </div>
          <span className="btn btn-primary" style={{ width: 'fit-content' }}>
            Details Soon
          </span>
        </div>
      </div>

      <div className="coming-soon-overlay">
        <h2 className="h-lg">Coming Soon</h2>
        <p>We&apos;re finalising the details. Sign up below to hear it first.</p>
      </div>
    </div>
  )
}

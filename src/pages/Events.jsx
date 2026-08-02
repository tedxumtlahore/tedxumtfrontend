import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { EVENTS } from '../data/siteData'
import PageHero from '../components/common/PageHero'
import EventCard from '../components/common/EventCard'

export default function Events() {
  const ref = useReveal()
  const [filter, setFilter] = useState('all')

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Events"
        title="Every idea starts on a stage"
        desc="From our flagship annual gathering to the archive of talks that came before it."
      />

      <section className="section">
        <div className="container">
          <div className="tabs">
            <button
              type="button"
              className={`tab-btn${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              type="button"
              className={`tab-btn${filter === 'upcoming' ? ' active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`tab-btn${filter === 'past' ? ' active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
          <div id="eventsGrid" className="grid grid-3">
            {EVENTS.filter((ev) => filter === 'all' || ev.status === filter).map((ev) => (
              <div key={ev.id} className="ev-item" data-status={ev.status}>
                <EventCard event={ev} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

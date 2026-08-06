import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchEvents } from '../api/services'
import PageHero from '../components/common/PageHero'
import EventCard from '../components/common/EventCard'
import AsyncBoundary from '../components/common/AsyncBoundary'

const FILTERS = [
  ['all', 'All Events'],
  ['upcoming', 'Upcoming'],
  ['past', 'Past'],
]

export default function Events() {
  const [filter, setFilter] = useState('all')

  const { data, loading, error, refetch } = useApi(
    () => fetchEvents(filter === 'all' ? {} : { status: filter }),
    [filter],
    { initialData: [] },
  )

  const events = data ?? []
  const ref = useReveal([events.length, filter])

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
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`tab-btn${filter === value ? ' active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <AsyncBoundary
            loading={loading}
            error={error}
            isEmpty={events.length === 0}
            emptyMessage={
              filter === 'upcoming'
                ? 'No upcoming events announced yet — watch this space.'
                : 'No events to show here yet.'
            }
            onRetry={refetch}
          >
            <div id="eventsGrid" className="grid grid-3">
              {events.map((ev) => (
                <div key={ev.id} className="ev-item" data-status={ev.status}>
                  <EventCard event={ev} />
                </div>
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>
    </div>
  )
}

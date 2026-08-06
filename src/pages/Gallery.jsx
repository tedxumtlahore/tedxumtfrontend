import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchGallery } from '../api/services'
import PageHero from '../components/common/PageHero'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Gallery() {
  const [filter, setFilter] = useState('all')

  const { data, loading, error, refetch } = useApi(
    () => fetchGallery(filter === 'all' ? {} : { media_type: filter }),
    [filter],
    { initialData: { mediaTypes: [], items: [] } },
  )

  const items = data?.items ?? []
  const tabs = [['all', 'All'], ...(data?.mediaTypes ?? []).map((t) => [t.value, t.label])]
  const ref = useReveal([items.length, filter])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the stage and beyond"
        desc="A look behind the curtain — talks, rehearsals, and the community that makes it all happen."
      />

      <section className="section">
        <div className="container">
          <div className="tabs">
            {tabs.map(([value, label]) => (
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
            isEmpty={items.length === 0}
            emptyMessage="No media here yet — photos from the next event will land shortly."
            onRetry={refetch}
          >
            <div className="masonry" id="galleryMasonry">
              {items.map((item) => (
                <GalleryTile key={item.id} item={item} />
              ))}
            </div>
          </AsyncBoundary>
        </div>
      </section>
    </div>
  )
}

function GalleryTile({ item }) {
  const overlay =
    item.media_type === 'video'
      ? '▶ Watch'
      : item.media_type === 'bts'
        ? 'Behind the Scenes'
        : 'View'

  const tile = (
    <>
      <img src={item.image} alt={item.resolved_alt_text} loading="lazy" />
      <div className="masonry-overlay">
        <span>{overlay}</span>
      </div>
    </>
  )

  // Videos link out to the hosted clip; photos are just tiles.
  if (item.media_type === 'video' && item.video_url) {
    return (
      <a
        className="masonry-item reveal"
        data-type={item.media_type}
        href={item.video_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {tile}
      </a>
    )
  }

  return (
    <div className="masonry-item reveal" data-type={item.media_type}>
      {tile}
    </div>
  )
}

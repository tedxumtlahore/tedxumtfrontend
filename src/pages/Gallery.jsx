import { useMemo, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { IMG } from '../utils/images'
import PageHero from '../components/common/PageHero'

export default function Gallery() {
  const ref = useReveal()
  const [filter, setFilter] = useState('all')

  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        seed: `g${i}`,
        type: i % 5 === 0 ? 'video' : i % 7 === 0 ? 'bts' : 'photo',
      })),
    [],
  )

  const filtered = items.filter((it) => filter === 'all' || it.type === filter)

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
            <button
              type="button"
              className={`tab-btn${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`tab-btn${filter === 'photo' ? ' active' : ''}`}
              onClick={() => setFilter('photo')}
            >
              Photos
            </button>
            <button
              type="button"
              className={`tab-btn${filter === 'video' ? ' active' : ''}`}
              onClick={() => setFilter('video')}
            >
              Videos
            </button>
            <button
              type="button"
              className={`tab-btn${filter === 'bts' ? ' active' : ''}`}
              onClick={() => setFilter('bts')}
            >
              Behind the Scenes
            </button>
          </div>
          <div className="masonry" id="galleryMasonry">
            {filtered.map((it) => (
              <div key={it.id} className="masonry-item reveal" data-type={it.type}>
                <img
                  src={IMG.wide(it.seed, 500, it.id % 3 === 0 ? 650 : 400)}
                  alt={`Gallery image ${it.id + 1}`}
                  loading="lazy"
                />
                <div className="masonry-overlay">
                  <span>
                    {it.type === 'video'
                      ? '\u25B6 Watch'
                      : it.type === 'bts'
                        ? 'Behind the Scenes'
                        : 'View'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

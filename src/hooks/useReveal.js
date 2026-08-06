import { useEffect, useMemo, useRef } from 'react'

/**
 * Attaches the scroll-reveal observer to everything with `.reveal` inside the
 * returned ref.
 *
 * Pass values that change when new content renders (e.g. a list length) so the
 * observer picks up elements that arrived after an API call resolved. Those
 * values are collapsed into one stable key, because React throws if a
 * dependency array changes length between renders.
 */
export function useReveal(deps = []) {
  const ref = useRef(null)
  const depKey = useMemo(() => JSON.stringify(deps ?? []), [deps])

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const elements = root.querySelectorAll('.reveal:not(.in)')
    if (!elements.length) return undefined

    // Without IntersectionObserver, show everything rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('in'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [depKey])

  return ref
}

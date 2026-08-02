import { useEffect, useRef } from 'react'

export function useReveal(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const elements = root.querySelectorAll('.reveal:not(.in)')
    if (!elements.length) return undefined

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
  }, deps)

  return ref
}

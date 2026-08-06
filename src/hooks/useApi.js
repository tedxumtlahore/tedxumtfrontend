import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Runs an async fetcher and tracks {data, loading, error}.
 *
 * `deps` behaves like a useEffect dependency array, but is collapsed into one
 * stable key first — React throws if a dependency array changes length between
 * renders, and callers build these arrays from API data.
 *
 * Results are only applied if the request is still the most recent one, so
 * navigating mid-flight never lands stale data on the new page.
 */
export function useApi(fetcher, deps = [], { initialData = null, skip = false } = {}) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const requestId = useRef(0)
  const depKey = useMemo(() => JSON.stringify(deps ?? []), [deps])

  const run = useCallback(() => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)

    return Promise.resolve()
      .then(() => fetcherRef.current())
      .then((result) => {
        if (id === requestId.current) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (id === requestId.current) {
          setError(err)
          setLoading(false)
        }
      })
  }, [])

  useEffect(() => {
    if (skip) {
      setLoading(false)
      return undefined
    }
    run()
    return () => {
      // Invalidate the in-flight request so its result is discarded.
      requestId.current += 1
    }
  }, [depKey, skip, run])

  return { data, loading, error, refetch: run }
}

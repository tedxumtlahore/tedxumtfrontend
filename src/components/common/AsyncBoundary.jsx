/**
 * Renders the right thing for each phase of an API call.
 *
 * Wrapping every data-driven section in this keeps the loading, error, and
 * empty states consistent instead of each page inventing its own.
 */
export default function AsyncBoundary({
  loading,
  error,
  isEmpty = false,
  emptyMessage = 'Nothing here yet — check back soon.',
  onRetry,
  children,
}) {
  if (loading) {
    return (
      <div className="async-state" role="status" aria-live="polite">
        <span className="async-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="async-state async-state-error" role="alert">
        <p>{error.message}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="async-state">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return children
}

/**
 * Date helpers.
 *
 * The API returns full ISO-8601 timestamps (2026-11-14T10:00:00+05:00) while
 * some content is still plain dates (2026-11-14). Both are handled here so
 * callers never have to care which shape they got.
 */
function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value

  // A bare YYYY-MM-DD is parsed as UTC by the Date constructor, which shifts
  // the day backwards in western timezones — pin it to local midnight instead.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatShortDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(value) {
  if (!value) return ''
  // Schedule items come back as "10:00:00" — a time with no date attached.
  const [hours, minutes] = String(value).split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function daysUntil(value) {
  const date = toDate(value)
  if (!date) return 0
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000))
}

export function yearOf(value) {
  return toDate(value)?.getFullYear() ?? null
}

export function icon(name) {
  const icons = {
    mission: '◆',
    vision: '○',
    innovation: '⚡',
    curiosity: '\u{1F50D}',
    leadership: '★',
    collaboration: '∞',
    creativity: '\u{1F3A8}',
    impact: '\u{1F310}',
    speaker: '\u{1F3A4}',
    volunteer: '\u{1F91D}',
    team: '\u{1F465}',
    partner: '\u{1F91D}',
    sponsor: '\u{1F3C6}',
  }
  return icons[name] || '◆'
}

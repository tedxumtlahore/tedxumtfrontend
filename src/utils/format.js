export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function daysUntil(iso) {
  const d = new Date(`${iso}T00:00:00`).getTime() - Date.now()
  return Math.max(0, Math.ceil(d / 86400000))
}

export function icon(name) {
  const icons = {
    mission: '\u25C6',
    vision: '\u25CB',
    innovation: '\u26A1',
    curiosity: '\u{1F50D}',
    leadership: '\u2605',
    collaboration: '\u221E',
    creativity: '\u{1F3A8}',
    impact: '\u{1F310}',
    speaker: '\u{1F3A4}',
    volunteer: '\u{1F91D}',
    team: '\u{1F465}',
    partner: '\u{1F91D}',
    sponsor: '\u{1F3C6}',
  }
  return icons[name] || '\u25C6'
}

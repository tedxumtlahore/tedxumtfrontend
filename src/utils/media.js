import { IMG } from './images'

/**
 * Image helpers for API-backed content.
 *
 * Uploaded media wins; when an editor hasn't attached an image yet we fall back
 * to a deterministic placeholder keyed on the record's slug, so the layout
 * never collapses and the same record always gets the same placeholder.
 */

export function portraitFor(record, uploaded) {
  return uploaded || IMG.portrait(seedFor(record))
}

export function wideFor(record, uploaded, width, height) {
  return uploaded || IMG.wide(seedFor(record), width, height)
}

export function seedFor(record) {
  if (typeof record === 'string') return record
  return record?.slug || record?.id || 'tedxumt'
}

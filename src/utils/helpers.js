import { EVENTS, SPEAKERS, BLOG } from '../data/siteData'

export function findEvent(id) {
  return EVENTS.find((e) => e.id === id)
}

export function findSpeaker(id) {
  return SPEAKERS.find((s) => s.id === id)
}

export function findBlogPost(id) {
  return BLOG.find((b) => b.id === id)
}

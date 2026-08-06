import client, { unwrapList } from './client'

/**
 * One function per backend endpoint. Components never talk to axios directly —
 * they call these, so the response shape is normalised in exactly one place.
 */

// ── Site shell ─────────────────────────────────────────────────────────────
export async function fetchSiteConfig() {
  const { data } = await client.get('/site-config/')
  return data
}

export async function fetchFaqs() {
  const { data } = await client.get('/faq/')
  return unwrapList(data)
}

// ── About ──────────────────────────────────────────────────────────────────
export async function fetchAbout() {
  const { data } = await client.get('/about/')
  return {
    sections: data.sections ?? [],
    values: data.values ?? [],
    messages: data.messages ?? [],
  }
}

// ── Events ─────────────────────────────────────────────────────────────────
export async function fetchEvents(params = {}) {
  const { data } = await client.get('/events/', { params })
  return unwrapList(data)
}

export async function fetchEvent(slug) {
  const { data } = await client.get(`/events/${slug}/`)
  return data
}

export async function fetchFeaturedEvents() {
  const { data } = await client.get('/events/featured/')
  return unwrapList(data)
}

// ── Speakers ───────────────────────────────────────────────────────────────
export async function fetchSpeakers(params = {}) {
  const { data } = await client.get('/speakers/', { params })
  return unwrapList(data)
}

export async function fetchSpeaker(slug) {
  const { data } = await client.get(`/speakers/${slug}/`)
  return data
}

// ── Team ───────────────────────────────────────────────────────────────────
export async function fetchTeam() {
  const { data } = await client.get('/team/')
  return data.departments ?? []
}

// ── Gallery ────────────────────────────────────────────────────────────────
export async function fetchGallery(params = {}) {
  const { data } = await client.get('/gallery/', { params })
  return {
    mediaTypes: data.media_types ?? [],
    items: data.results ?? [],
  }
}

// ── Blog ───────────────────────────────────────────────────────────────────
export async function fetchBlogIndex() {
  const { data } = await client.get('/blog/')
  return {
    featured: data.featured ?? null,
    posts: data.posts ?? [],
    categories: data.categories ?? [],
  }
}

export async function fetchBlogPost(slug) {
  const { data } = await client.get(`/blog-posts/${slug}/`)
  return data
}

// ── Sponsors ───────────────────────────────────────────────────────────────
export async function fetchSponsorTiers() {
  const { data } = await client.get('/sponsors/')
  return data.tiers ?? []
}

// ── Submissions ────────────────────────────────────────────────────────────
export async function submitContactMessage(payload) {
  const { data } = await client.post('/contact/', payload)
  return data
}

export async function subscribeToNewsletter(email) {
  const { data } = await client.post('/newsletter/', { email })
  return data
}

export async function fetchApplicationOptions() {
  const { data } = await client.get('/apply/options/')
  return {
    availability: data.availability ?? [],
    partnershipTypes: data.partnership_types ?? [],
  }
}

export async function submitSpeakerApplication(payload) {
  const { data } = await client.post('/apply/speaker/', payload)
  return data
}

export async function submitVolunteerApplication(payload) {
  const { data } = await client.post('/apply/volunteer/', payload)
  return data
}

export async function submitPartnerApplication(payload) {
  const { data } = await client.post('/apply/partner/', payload)
  return data
}

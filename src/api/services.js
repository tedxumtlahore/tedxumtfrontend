import client, { API_BASE_URL, unwrapList } from './client'

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

/**
 * What the homepage should feature.
 *
 * Returns {state, event} where state is 'published' | 'coming_soon' | 'none'.
 * In the 'coming_soon' state `event` is null by design — the backend withholds
 * an unpublished event's details rather than relying on the blur to hide them.
 */
export async function fetchNextEvent() {
  const { data } = await client.get('/events/next/')
  return { state: data.state ?? 'none', event: data.event ?? null }
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

// ── Ticketing ──────────────────────────────────────────────────────────────
export async function fetchEventTicketing(slug) {
  const { data } = await client.get(`/events/${slug}/ticketing/`)
  return data
}

export async function registerForEvent(slug, payload) {
  const { data } = await client.post(`/events/${slug}/register/`, payload)
  return data
}

export async function fetchRegistration(publicRef) {
  const { data } = await client.get(`/registrations/status/${publicRef}/`)
  return data
}

export async function fetchPaymentAccounts() {
  const { data } = await client.get('/payment-accounts/')
  return data.accounts ?? []
}

/**
 * Tell us about a transfer that was already made.
 *
 * Sent as multipart because it may carry a screenshot. This never marks the
 * order paid — an organizer still checks the statement.
 */
export async function submitPaymentProof(publicRef, { reference, paidFromNumber, proof }) {
  const form = new FormData()
  if (reference) form.append('reference', reference)
  if (paidFromNumber) form.append('paid_from_number', paidFromNumber)
  if (proof) form.append('proof', proof)

  const { data } = await client.post(
    `/registrations/status/${publicRef}/payment-proof/`, form,
  )
  return data
}

export async function fetchTicket(accessToken) {
  const { data } = await client.get(`/tickets/by-token/${accessToken}/`)
  return data
}

/** Absolute URLs for the ticket's QR image and PDF — used as <img>/<a> targets. */
export function ticketQrUrl(accessToken) {
  return `${API_BASE_URL}/tickets/by-token/${accessToken}/qr.png`
}

export function ticketPdfUrl(accessToken) {
  return `${API_BASE_URL}/tickets/by-token/${accessToken}/pdf/`
}

// ── Accounts ───────────────────────────────────────────────────────────────
// Attendees, volunteers and organizers all authenticate through the same JWT
// endpoint; what they are allowed to do is decided by the backend from their
// groups, never by the frontend. `fetchMe` is what tells the UI which is which.

export async function createAccount({ fullName, email, password }) {
  const { data } = await client.post('/accounts/register/', {
    full_name: fullName,
    email,
    password,
  })
  return data
}

export async function signIn(username, password) {
  const { data } = await client.post('/auth/token/', { username, password })
  return data
}

export async function fetchMe() {
  const { data } = await client.get('/accounts/me/')
  return data
}

export async function fetchMyRegistrations() {
  const { data } = await client.get('/accounts/me/registrations/')
  return unwrapList(data)
}

export async function claimRegistration(publicRef) {
  const { data } = await client.post('/accounts/me/registrations/claim/', {
    public_ref: publicRef,
  })
  return data
}

// ── Volunteer check-in ─────────────────────────────────────────────────────
export async function volunteerLogin(username, password) {
  const { data } = await client.post('/auth/token/', { username, password })
  return data
}

export async function verifyTicket(token, event) {
  const { data } = await client.post('/checkin/verify/', { token, event })
  return data
}

/**
 * Verify and consume a ticket.
 *
 * A refused scan comes back as 409 with the full result payload — including the
 * attendee's name, which is exactly what the volunteer needs when they have to
 * explain the refusal to the person in front of them. That is an outcome, not a
 * transport failure, so it is returned rather than thrown.
 */
export async function checkInTicket(token, event) {
  try {
    const { data } = await client.post('/checkin/', { token, event })
    return data
  } catch (err) {
    if (err.status === 409 && err.data && 'result' in err.data) {
      return err.data
    }
    throw err
  }
}

export async function fetchCheckInHistory() {
  const { data } = await client.get('/checkin/history/')
  return data.results ?? []
}

// ── Organizer dashboard ────────────────────────────────────────────────────
export async function fetchDashboard(eventSlug) {
  const { data } = await client.get('/dashboard/', {
    params: eventSlug ? { event: eventSlug } : {},
  })
  return data
}

export async function fetchAnalytics(eventSlug, days = 30) {
  const { data } = await client.get('/analytics/', {
    params: { ...(eventSlug ? { event: eventSlug } : {}), days },
  })
  return data
}

/**
 * Download the attendee CSV.
 *
 * Fetched through the client rather than linked directly, because the export is
 * organizer-only and a plain <a href> carries no Authorization header.
 */
export async function downloadAttendeeCsv(eventSlug) {
  const response = await client.get('/registrations/export/', {
    params: eventSlug ? { event: eventSlug } : {},
    responseType: 'blob',
  })

  const disposition = response.headers['content-disposition'] || ''
  const match = /filename="?([^"]+)"?/.exec(disposition)
  const filename = match ? match[1] : 'attendees.csv'

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return filename
}

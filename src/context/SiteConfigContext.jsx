import { createContext, useContext, useMemo } from 'react'
import { fetchSiteConfig } from '../api/services'
import { useApi } from '../hooks/useApi'

const SiteConfigContext = createContext(null)

/**
 * Fallbacks so the shell (navbar, footer, hero) still renders sensibly if the
 * API is unreachable — the site degrades instead of going blank.
 */
const FALLBACK = {
  settings: {
    site_name: 'TEDxUMT Lahore',
    tagline: 'Ideas Worth Spreading',
    email: 'tedxumtlahore@umt.edu.pk',
    address: 'UMT Campus, C-II, Johar Town, Lahore',
    events_count: '3',
    speakers_count: '30+',
    attendees_count: '4,200+',
    about_summary:
      "Founded in December 2025, TEDxUMT Lahore is the University of Management and " +
      "Technology's first officially licensed TEDx organization.",
    footer_tagline:
      "Bringing ideas worth spreading to Lahore's brightest minds since 2025.",
    copyright_text:
      'This independent TEDx event is operated under license from TED.',
    ted_event_url: 'https://www.ted.com/tedx/events/69864',
  },
  hero: {
    eyebrow: 'TEDxUMT Lahore  ·  University of Management and Technology',
    headline_line1: 'Ideas worth',
    headline_line2: 'spreading.',
    subheading:
      "An independently organized TED event bringing Lahore's boldest thinkers, " +
      'builders, and storytellers to one stage.',
    cta_primary_label: 'Register',
    cta_primary_url: '/apply',
    cta_secondary_label: 'Become a Speaker',
    cta_secondary_url: '/apply',
    background_image: null,
  },
  navigation: [
    { id: 'home', label: 'Home', url: '/' },
    { id: 'about', label: 'About', url: '/about' },
    { id: 'events', label: 'Events', url: '/events' },
    { id: 'founder', label: 'Founder', url: '/founder' },
    { id: 'team', label: 'Team', url: '/team' },
    { id: 'gallery', label: 'Gallery', url: '/gallery' },
    { id: 'blog', label: 'Blog', url: '/blog' },
    { id: 'sponsors', label: 'Sponsors', url: '/sponsors' },
    { id: 'contact', label: 'Contact', url: '/contact' },
  ],
  social_links: [],
  faqs: [],
}

export function SiteConfigProvider({ children }) {
  const { data, loading, error } = useApi(fetchSiteConfig, [])

  const value = useMemo(() => {
    const config = data ?? {}
    return {
      settings: { ...FALLBACK.settings, ...(config.settings ?? {}) },
      hero: { ...FALLBACK.hero, ...(config.hero ?? {}) },
      navigation: config.navigation?.length ? config.navigation : FALLBACK.navigation,
      socialLinks: config.social_links ?? FALLBACK.social_links,
      faqs: config.faqs ?? FALLBACK.faqs,
      loading,
      error,
      isOffline: Boolean(error),
    }
  }, [data, loading, error])

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider')
  return ctx
}

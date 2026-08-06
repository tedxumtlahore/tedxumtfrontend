# TEDxUMT Lahore — Website

React + Vite frontend for the TEDxUMT Lahore website. Every piece of content on
the site comes from the Django CMS at runtime; there is no hardcoded copy left in
the source.

---

## Quick start

The backend must be running first — see `../backend/Readme.md`.

```bash
npm install
```

Copy `.env.example` to `.env` and point it at your API:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

The site runs at <http://localhost:5173>. That origin is already in the
backend's default `CORS_ALLOWED_ORIGINS`.

```bash
npm run build
```

```bash
npm run lint
```

---

## How data flows

```
src/api/client.js      one axios instance; normalises every error into ApiError
src/api/services.js    one function per endpoint; unwraps pagination
src/hooks/useApi.js    runs a fetcher, tracks {data, loading, error, refetch}
```

Components never call axios directly. They call a service through `useApi` and
wrap the result in `<AsyncBoundary>`, which renders the loading, error, and empty
states consistently.

```jsx
const { data, loading, error, refetch } = useApi(fetchSpeakers, [], { initialData: [] })

<AsyncBoundary loading={loading} error={error} isEmpty={!data.length} onRetry={refetch}>
  {data.map((s) => <SpeakerCard key={s.id} speaker={s} />)}
</AsyncBoundary>
```

`useApi` ignores results from superseded requests, so switching routes mid-flight
never lands stale data on the new page.

### Site shell

`SiteConfigContext` fetches `/api/site-config/` once on boot and supplies the
navbar, footer, hero, and FAQ content to the whole tree via `useSiteConfig()`.
It ships hardcoded fallbacks for that payload only — if the API is unreachable
the chrome still renders instead of the page going blank.

### Images

Uploaded media wins. When an editor hasn't attached an image yet, `utils/media.js`
substitutes a deterministic placeholder keyed on the record's slug, so layouts
never collapse and a given record always gets the same placeholder.

---

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/events`, `/events/:slug` | Events, Event detail |
| `/speakers`, `/speakers/:slug` | Speakers, Speaker profile |
| `/team` | Team |
| `/gallery` | Gallery |
| `/blog`, `/blog/:slug` | Blog, Article |
| `/sponsors` | Sponsors |
| `/apply` | Speaker / Volunteer / Partner applications |
| `/contact` | Contact form + FAQ |

Detail routes are keyed on the backend's slug. An unknown slug returns a 404 page
rather than an error state.

---

## Forms

The contact form, newsletter signup, and all three application tracks POST to the
API. Backend field validation is rendered inline next to the offending input, and
the returned message is surfaced as a toast.

---

## Tech stack

React 19 · React Router 7 · Vite 8 · axios · oxlint

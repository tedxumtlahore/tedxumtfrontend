import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Speakers from './pages/Speakers'
import SpeakerProfile from './pages/SpeakerProfile'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Sponsors from './pages/Sponsors'
import Apply from './pages/Apply'
import Contact from './pages/Contact'
import EventRegister from './pages/EventRegister'
import RegistrationStatus from './pages/RegistrationStatus'
import TicketView from './pages/TicketView'
import SignIn from './pages/SignIn'
import MyTickets from './pages/MyTickets'
import NotFound from './pages/NotFound'

/**
 * The staff-only routes are code-split.
 *
 * The check-in page pulls in the QR camera library, which is by far the
 * heaviest dependency in the app. Bundling it with everything else meant every
 * attendee downloaded a barcode scanner just to read the homepage. These two
 * routes are used by a handful of people on one day, so they load on demand.
 */
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Organizer = lazy(() => import('./pages/Organizer'))

/** Shown for the moment a lazy route's chunk is in flight. */
function RouteFallback() {
  return (
    <div className="async-state" role="status" aria-live="polite" style={{ margin: '160px auto', maxWidth: '420px' }}>
      <span className="async-spinner" aria-hidden="true" />
      <p>Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:slug" element={<EventDetail />} />
              <Route path="events/:slug/register" element={<EventRegister />} />
              <Route path="registration/:publicRef" element={<RegistrationStatus />} />
              <Route path="ticket/:accessToken" element={<TicketView />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="speakers" element={<Speakers />} />
              <Route path="speakers/:slug" element={<SpeakerProfile />} />
              <Route path="team" element={<Team />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="sponsors" element={<Sponsors />} />
              <Route path="apply" element={<Apply />} />
              <Route path="contact" element={<Contact />} />
              {/* The QR encodes /checkin/<token>; both forms need the portal. */}
              <Route
                path="checkin"
                element={<Suspense fallback={<RouteFallback />}><CheckIn /></Suspense>}
              />
              <Route
                path="checkin/:token"
                element={<Suspense fallback={<RouteFallback />}><CheckIn /></Suspense>}
              />
              <Route
                path="organizer"
                element={<Suspense fallback={<RouteFallback />}><Organizer /></Suspense>}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  )
}

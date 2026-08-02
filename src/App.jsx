import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
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
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="speakers" element={<Speakers />} />
            <Route path="speakers/:id" element={<SpeakerProfile />} />
            <Route path="team" element={<Team />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="apply" element={<Apply />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

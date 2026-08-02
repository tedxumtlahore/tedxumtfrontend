import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useScrollToTop } from '../../hooks/useScrollToTop'

export default function Layout() {
  useScrollToTop()

  return (
    <>
      <Navbar />
      <main id="app">
        <div className="route-fade">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}

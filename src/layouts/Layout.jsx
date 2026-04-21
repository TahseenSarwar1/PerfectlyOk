import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { to: '/',          label: 'Home',      icon: '🏠' },
  { to: '/mood',      label: 'Mood',      icon: '🌤️' },
  { to: '/chat',      label: 'Chat',      icon: '💬' },
  { to: '/vent',      label: 'Vent',      icon: '📝' },
  { to: '/gym',       label: 'Gym',       icon: '🧘' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
]

export default function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:animate-float inline-block transition-transform duration-300">🌿</span>
            <span className="font-display text-xl font-semibold text-stone-700 tracking-tight">Antigravity</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-soft/20 ${
                    isActive ? 'bg-blue-soft/30 text-blue-dark' : 'text-stone-warm hover:text-stone-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-blue-soft/20 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-stone-700 mb-1 transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-stone-700 mb-1 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-stone-700 transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-3 shadow-float animate-fade-in">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-soft/30 text-blue-dark' : 'text-stone-warm hover:bg-blue-light/20'
                  }`
                }
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-xs text-stone-muted border-t border-blue-light/30">
        <p>Antigravity · Made with care for students everywhere 🌿</p>
        <p className="mt-1 opacity-60">This is a supportive space, not a substitute for professional help.</p>
      </footer>
    </div>
  )
}

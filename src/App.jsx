import React, { useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import { Menu, X, Zap, Calendar, Radio, Users, Trophy, Home } from 'lucide-react'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import LiveRacePage from './pages/LiveRacePage'
import PilotsPage from './pages/PilotsPage'
import LeaderboardPage from './pages/LeaderboardPage'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/live', label: 'Live Race', icon: Radio },
  { to: '/pilots', label: 'Pilots', icon: Users },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mighty-400 to-mighty-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-racing text-lg font-bold text-white tracking-wider">
                  MIGHTY DRONES
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Minneapolis FPV Racing
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-mighty-600/20 text-mighty-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-700 bg-slate-800 pb-3 px-4">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-mighty-600/20 text-mighty-400'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/live" element={<LiveRacePage />} />
          <Route path="/pilots" element={<PilotsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Mighty Drones &middot; Minneapolis, MN &middot;{' '}
            <a
              href="https://www.multigp.com/chapters/view/?chapter=Mighty-Drones"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mighty-400 hover:text-mighty-300"
            >
              MultiGP Chapter Page
            </a>
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Powered by MultiGP &amp; FPVTrackside
          </p>
        </div>
      </footer>
    </div>
  )
}

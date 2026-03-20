import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Radio, Users, Trophy, MapPin, ArrowRight, Zap } from 'lucide-react'
import { CHAPTER_CONFIG, PILOTS } from '../config'
import { getChapterRaces } from '../services/multigp'
import { MOCK_LIVE_RACE } from '../services/fpvtrackside'

export default function HomePage() {
  const [nextRace, setNextRace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChapterRaces().then(races => {
      if (races && races.length > 0) {
        const sorted = [...races].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        setNextRace(sorted[0])
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-mighty-950 to-slate-800 border border-slate-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwZWE1ZTkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBIMjR2NGgxMnpNNiAzNHYySDR2LTJoMnptMC0zMFYwSDR2NGgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-mighty-600/20 text-mighty-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            FPV Drone Racing
          </div>
          <h1 className="font-racing text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
            {CHAPTER_CONFIG.name.toUpperCase()}
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            {CHAPTER_CONFIG.location}
          </p>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            {CHAPTER_CONFIG.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-mighty-600 hover:bg-mighty-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Calendar className="w-5 h-5" />
              View Events
            </Link>
            <Link
              to="/live"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Radio className="w-5 h-5" />
              Live Race
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pilots', value: PILOTS.length, icon: Users, color: 'text-mighty-400' },
          { label: 'Organizers', value: CHAPTER_CONFIG.organizers.length, icon: Zap, color: 'text-race-yellow' },
          { label: 'Next Event', value: nextRace ? formatShortDate(nextRace.startDate) : '—', icon: Calendar, color: 'text-race-green' },
          { label: 'Season', value: '2026', icon: Trophy, color: 'text-race-orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="font-racing text-2xl font-bold text-white">{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Next race card */}
      {nextRace && (
        <section>
          <h2 className="font-racing text-xl font-bold text-white mb-4 tracking-wide">
            NEXT RACE
          </h2>
          <Link
            to="/events"
            className="block bg-slate-800 rounded-xl border border-slate-700 hover:border-mighty-600/50 transition-colors p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{nextRace.name}</h3>
                <div className="space-y-1.5">
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatFullDate(nextRace.startDate)}
                  </p>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {nextRace.address || nextRace.city}, {nextRace.state}
                  </p>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {nextRace.pilotCount} pilots registered
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 mt-1" />
            </div>
          </Link>
        </section>
      )}

      {/* Organizers */}
      <section>
        <h2 className="font-racing text-xl font-bold text-white mb-4 tracking-wide">
          CHAPTER ORGANIZERS
        </h2>
        <div className="flex gap-4 flex-wrap">
          {CHAPTER_CONFIG.organizers.map(name => (
            <div key={name} className="bg-slate-800 rounded-xl border border-slate-700 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mighty-500 to-mighty-700 flex items-center justify-center text-white font-bold text-sm">
                {name[0]}
              </div>
              <span className="text-white font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

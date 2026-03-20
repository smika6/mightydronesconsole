import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { getChapterRaces, getPastRaces, getRaceDetails } from '../services/multigp'

export default function EventsPage() {
  const [upcomingRaces, setUpcomingRaces] = useState([])
  const [pastRaces, setPastRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRace, setExpandedRace] = useState(null)
  const [raceDetails, setRaceDetails] = useState({})
  const [tab, setTab] = useState('upcoming')

  useEffect(() => {
    Promise.all([getChapterRaces(), getPastRaces()]).then(([upcoming, past]) => {
      setUpcomingRaces(upcoming || [])
      setPastRaces(past || [])
      setLoading(false)
    })
  }, [])

  const toggleExpand = async (raceId) => {
    if (expandedRace === raceId) {
      setExpandedRace(null)
      return
    }
    setExpandedRace(raceId)
    if (!raceDetails[raceId]) {
      const details = await getRaceDetails(raceId)
      if (details) {
        setRaceDetails(prev => ({ ...prev, [raceId]: details }))
      }
    }
  }

  const races = tab === 'upcoming' ? upcomingRaces : pastRaces

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-mighty-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-racing text-2xl font-bold text-white tracking-wider">EVENTS</h1>
        <a
          href="https://www.multigp.com/chapters/view/?chapter=Mighty-Drones"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-mighty-400 hover:text-mighty-300 text-sm"
        >
          View on MultiGP <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['upcoming', 'past'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-mighty-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t === 'upcoming' ? 'Upcoming' : 'Past Events'}
          </button>
        ))}
      </div>

      {/* Race list */}
      {races.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No {tab} events found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {races.map(race => (
            <div
              key={race.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(race.id)}
                className="w-full px-6 py-5 text-left hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{race.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        race.status === 'upcoming'
                          ? 'bg-race-green/20 text-race-green'
                          : 'bg-slate-600/30 text-slate-400'
                      }`}>
                        {race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(race.startDate)}
                      </span>
                      {race.address && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {race.address}
                        </span>
                      )}
                      {race.courseName && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {race.courseName}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {race.pilotCount} pilots
                      </span>
                    </div>
                  </div>
                  {expandedRace === race.id
                    ? <ChevronUp className="w-5 h-5 text-slate-500 mt-1" />
                    : <ChevronDown className="w-5 h-5 text-slate-500 mt-1" />
                  }
                </div>
              </button>

              {/* Expanded details */}
              {expandedRace === race.id && (
                <div className="px-6 pb-5 border-t border-slate-700 pt-4">
                  {raceDetails[race.id] ? (
                    <div className="space-y-4">
                      {raceDetails[race.id].description && (
                        <p className="text-slate-300 text-sm">
                          {raceDetails[race.id].description}
                        </p>
                      )}
                      {raceDetails[race.id].entries && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">
                            Registered Pilots
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {raceDetails[race.id].entries.map((entry, i) => (
                              <span
                                key={i}
                                className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full"
                              >
                                {entry.pilotName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <a
                        href={`https://www.multigp.com/races/view/?race=${race.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-mighty-400 hover:text-mighty-300 text-sm"
                      >
                        Full details on MultiGP <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className="w-4 h-4 border-2 border-mighty-400 border-t-transparent rounded-full animate-spin" />
                      Loading details...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

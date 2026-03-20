import React, { useState } from 'react'
import { Youtube, ExternalLink, Trophy, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { PILOTS } from '../config'
import { MOCK_HISTORICAL } from '../services/fpvtrackside'

export default function PilotsPage() {
  const [expandedPilot, setExpandedPilot] = useState(null)

  // Compute stats from mock historical data
  const pilotStats = computePilotStats(MOCK_HISTORICAL)

  return (
    <div className="space-y-6">
      <h1 className="font-racing text-2xl font-bold text-white tracking-wider">PILOTS</h1>

      <div className="grid gap-4">
        {PILOTS.map(pilot => {
          const stats = pilotStats[pilot.callsign] || {}
          const isExpanded = expandedPilot === pilot.callsign

          return (
            <div
              key={pilot.callsign}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
            >
              {/* Pilot header */}
              <button
                onClick={() => setExpandedPilot(isExpanded ? null : pilot.callsign)}
                className="w-full px-6 py-5 text-left hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {pilot.avatar ? (
                    <img
                      src={pilot.avatar}
                      alt={pilot.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mighty-500 to-mighty-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {pilot.name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{pilot.name}</h3>
                      {pilot.youtube && (
                        <Youtube className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{pilot.bio}</p>
                  </div>

                  {/* Quick stats */}
                  <div className="hidden md:flex items-center gap-6">
                    {stats.wins !== undefined && (
                      <>
                        <div className="text-center">
                          <p className="font-racing text-xl font-bold text-race-green">{stats.wins}</p>
                          <p className="text-xs text-slate-500">Wins</p>
                        </div>
                        <div className="text-center">
                          <p className="font-racing text-xl font-bold text-white">{stats.races}</p>
                          <p className="text-xs text-slate-500">Races</p>
                        </div>
                        <div className="text-center">
                          <p className="font-racing text-xl font-bold text-mighty-400">
                            {stats.bestLap ? `${stats.bestLap.toFixed(2)}s` : '—'}
                          </p>
                          <p className="text-xs text-slate-500">Best Lap</p>
                        </div>
                      </>
                    )}
                  </div>

                  {isExpanded
                    ? <ChevronUp className="w-5 h-5 text-slate-500" />
                    : <ChevronDown className="w-5 h-5 text-slate-500" />
                  }
                </div>
              </button>

              {/* Expanded section */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Stats detail */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        Season Stats
                      </h4>
                      {stats.races ? (
                        <div className="grid grid-cols-2 gap-3">
                          <StatCard icon={Trophy} label="Wins" value={stats.wins} color="text-race-green" />
                          <StatCard icon={Trophy} label="Podiums" value={stats.podiums} color="text-race-yellow" />
                          <StatCard icon={Clock} label="Best Lap" value={stats.bestLap ? `${stats.bestLap.toFixed(2)}s` : '—'} color="text-mighty-400" />
                          <StatCard icon={TrendingUp} label="Avg Lap" value={stats.avgLap ? `${stats.avgLap.toFixed(2)}s` : '—'} color="text-slate-300" />
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">No race data yet.</p>
                      )}

                      {/* Recent results */}
                      {stats.recentResults && stats.recentResults.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Recent Results</h4>
                          <div className="space-y-1.5">
                            {stats.recentResults.map((r, i) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-slate-700/50 rounded-lg px-3 py-2">
                                <span className="text-slate-300">{r.eventName}</span>
                                <span className={`font-mono font-bold ${
                                  r.position === 1 ? 'text-race-green' :
                                  r.position <= 3 ? 'text-race-yellow' : 'text-slate-400'
                                }`}>
                                  P{r.position}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* YouTube section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        YouTube
                      </h4>
                      {pilot.youtube ? (
                        <div className="space-y-3">
                          <a
                            href={pilot.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-lg px-4 py-3 transition-colors"
                          >
                            <Youtube className="w-6 h-6 text-red-500" />
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">Watch on YouTube</p>
                              <p className="text-slate-400 text-xs truncate">{pilot.youtube}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-red-400" />
                          </a>
                          {/* Embedded video placeholder — when YouTube Data API is configured */}
                          <div className="aspect-video bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                            <div className="text-center">
                              <Youtube className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                              <p className="text-slate-500 text-sm">
                                Latest video preview
                              </p>
                              <p className="text-slate-600 text-xs mt-1">
                                Add YouTube Data API key for auto-embeds
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                          <Youtube className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="text-slate-500 text-sm">
                            No YouTube channel linked yet.
                          </p>
                          <p className="text-slate-600 text-xs mt-1">
                            Add it in config.js
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <Icon className={`w-4 h-4 ${color} mb-1`} />
      <p className={`font-racing text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function computePilotStats(historicalData) {
  const stats = {}
  for (const event of historicalData) {
    for (const result of event.results) {
      if (!stats[result.pilot]) {
        stats[result.pilot] = {
          races: 0,
          wins: 0,
          podiums: 0,
          bestLap: Infinity,
          totalAvgLap: 0,
          recentResults: [],
        }
      }
      const s = stats[result.pilot]
      s.races++
      if (result.position === 1) s.wins++
      if (result.position <= 3) s.podiums++
      if (result.bestLap < s.bestLap) s.bestLap = result.bestLap
      s.totalAvgLap += result.avgLap
      s.recentResults.push({
        eventName: event.eventName,
        date: event.date,
        position: result.position,
        bestLap: result.bestLap,
      })
    }
  }
  // Compute averages
  for (const pilot of Object.keys(stats)) {
    const s = stats[pilot]
    s.avgLap = s.totalAvgLap / s.races
    if (!isFinite(s.bestLap)) s.bestLap = null
    s.recentResults = s.recentResults.slice(0, 5)
  }
  return stats
}

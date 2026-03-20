import React, { useState, useMemo } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus, Clock, Award } from 'lucide-react'
import { MOCK_HISTORICAL } from '../services/fpvtrackside'

const TABS = [
  { id: 'standings', label: 'Season Standings' },
  { id: 'laptimes', label: 'Fastest Laps' },
  { id: 'headtohead', label: 'Head to Head' },
]

export default function LeaderboardPage() {
  const [tab, setTab] = useState('standings')
  const [selectedPilots, setSelectedPilots] = useState([])

  const standings = useMemo(() => computeStandings(MOCK_HISTORICAL), [])
  const fastestLaps = useMemo(() => computeFastestLaps(MOCK_HISTORICAL), [])
  const allPilots = useMemo(() => [...new Set(MOCK_HISTORICAL.flatMap(e => e.results.map(r => r.pilot)))], [])

  return (
    <div className="space-y-6">
      <h1 className="font-racing text-2xl font-bold text-white tracking-wider">LEADERBOARD</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-mighty-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Season Standings */}
      {tab === 'standings' && (
        <div className="space-y-3">
          {standings.map((pilot, idx) => (
            <div
              key={pilot.name}
              className={`bg-slate-800 rounded-xl border overflow-hidden flex items-center ${
                idx === 0 ? 'border-race-green/40' :
                idx === 1 ? 'border-slate-600' :
                idx === 2 ? 'border-race-orange/30' :
                'border-slate-700'
              }`}
            >
              {/* Rank */}
              <div className={`w-16 flex-shrink-0 flex items-center justify-center py-5 ${
                idx === 0 ? 'bg-race-green/10' :
                idx === 1 ? 'bg-slate-700/30' :
                idx === 2 ? 'bg-race-orange/10' : ''
              }`}>
                {idx < 3 ? (
                  <Trophy className={`w-6 h-6 ${
                    idx === 0 ? 'text-race-green' :
                    idx === 1 ? 'text-slate-300' :
                    'text-race-orange'
                  }`} />
                ) : (
                  <span className="font-racing text-xl text-slate-500">#{idx + 1}</span>
                )}
              </div>

              {/* Pilot info */}
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{pilot.name}</h3>
                  <TrendIndicator trend={pilot.trend} />
                </div>
                <div className="flex gap-4 mt-1 text-sm text-slate-400">
                  <span>{pilot.races} races</span>
                  <span>{pilot.wins}W / {pilot.podiums}P</span>
                </div>
              </div>

              {/* Points */}
              <div className="px-6 text-right">
                <p className="font-racing text-2xl font-bold text-white">{pilot.points}</p>
                <p className="text-xs text-slate-500">points</p>
              </div>
            </div>
          ))}

          {/* Points system explainer */}
          <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-500">
            Points: 1st = 25, 2nd = 20, 3rd = 16, 4th = 13, 5th = 10, 6th+ = 8
          </div>
        </div>
      )}

      {/* Fastest Laps */}
      {tab === 'laptimes' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-5 py-3 text-xs text-slate-400 font-medium">#</th>
                <th className="px-5 py-3 text-xs text-slate-400 font-medium">Pilot</th>
                <th className="px-5 py-3 text-xs text-slate-400 font-medium">Best Lap</th>
                <th className="px-5 py-3 text-xs text-slate-400 font-medium">Event</th>
                <th className="px-5 py-3 text-xs text-slate-400 font-medium hidden sm:table-cell">Avg Lap</th>
              </tr>
            </thead>
            <tbody>
              {fastestLaps.map((entry, idx) => (
                <tr
                  key={`${entry.pilot}-${entry.event}`}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30"
                >
                  <td className="px-5 py-3">
                    <span className={`font-racing font-bold ${
                      idx === 0 ? 'text-race-green' :
                      idx === 1 ? 'text-slate-300' :
                      idx === 2 ? 'text-race-orange' :
                      'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white font-medium">{entry.pilot}</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono font-bold ${
                      idx === 0 ? 'text-race-green' : 'text-white'
                    }`}>
                      {entry.bestLap.toFixed(2)}s
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-sm">{entry.event}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-sm hidden sm:table-cell">
                    {entry.avgLap.toFixed(2)}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Head to Head */}
      {tab === 'headtohead' && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Select two pilots to compare their records.</p>
          <div className="flex gap-3 flex-wrap">
            {allPilots.map(pilot => (
              <button
                key={pilot}
                onClick={() => {
                  setSelectedPilots(prev => {
                    if (prev.includes(pilot)) return prev.filter(p => p !== pilot)
                    if (prev.length >= 2) return [prev[1], pilot]
                    return [...prev, pilot]
                  })
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPilots.includes(pilot)
                    ? 'bg-mighty-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {pilot}
              </button>
            ))}
          </div>

          {selectedPilots.length === 2 && (
            <HeadToHead
              pilot1={selectedPilots[0]}
              pilot2={selectedPilots[1]}
              data={MOCK_HISTORICAL}
            />
          )}
        </div>
      )}
    </div>
  )
}

function HeadToHead({ pilot1, pilot2, data }) {
  const comparison = useMemo(() => {
    let p1Wins = 0, p2Wins = 0
    const events = []

    for (const event of data) {
      const r1 = event.results.find(r => r.pilot === pilot1)
      const r2 = event.results.find(r => r.pilot === pilot2)
      if (r1 && r2) {
        if (r1.position < r2.position) p1Wins++
        else if (r2.position < r1.position) p2Wins++
        events.push({
          name: event.eventName,
          date: event.date,
          p1Pos: r1.position,
          p2Pos: r2.position,
          p1Lap: r1.bestLap,
          p2Lap: r2.bestLap,
        })
      }
    }

    return { p1Wins, p2Wins, events }
  }, [pilot1, pilot2, data])

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Scoreboard */}
      <div className="flex items-center border-b border-slate-700">
        <div className={`flex-1 p-5 text-center ${comparison.p1Wins > comparison.p2Wins ? 'bg-race-green/10' : ''}`}>
          <p className="font-bold text-white text-lg">{pilot1}</p>
          <p className={`font-racing text-3xl font-bold ${
            comparison.p1Wins > comparison.p2Wins ? 'text-race-green' : 'text-slate-400'
          }`}>{comparison.p1Wins}</p>
          <p className="text-xs text-slate-500">wins</p>
        </div>
        <div className="px-4 text-slate-600 font-racing text-sm">VS</div>
        <div className={`flex-1 p-5 text-center ${comparison.p2Wins > comparison.p1Wins ? 'bg-race-green/10' : ''}`}>
          <p className="font-bold text-white text-lg">{pilot2}</p>
          <p className={`font-racing text-3xl font-bold ${
            comparison.p2Wins > comparison.p1Wins ? 'text-race-green' : 'text-slate-400'
          }`}>{comparison.p2Wins}</p>
          <p className="text-xs text-slate-500">wins</p>
        </div>
      </div>

      {/* Event breakdown */}
      <div className="divide-y divide-slate-700/50">
        {comparison.events.map(evt => (
          <div key={evt.name} className="flex items-center px-5 py-3 text-sm">
            <div className="w-24 text-right">
              <span className={`font-mono font-bold ${
                evt.p1Pos < evt.p2Pos ? 'text-race-green' : 'text-slate-400'
              }`}>
                P{evt.p1Pos}
              </span>
              <span className="text-slate-600 ml-2">{evt.p1Lap.toFixed(2)}s</span>
            </div>
            <div className="flex-1 text-center text-slate-500 text-xs px-3 truncate">
              {evt.name}
            </div>
            <div className="w-24">
              <span className={`font-mono font-bold ${
                evt.p2Pos < evt.p1Pos ? 'text-race-green' : 'text-slate-400'
              }`}>
                P{evt.p2Pos}
              </span>
              <span className="text-slate-600 ml-2">{evt.p2Lap.toFixed(2)}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendIndicator({ trend }) {
  if (trend > 0) return <TrendingUp className="w-4 h-4 text-race-green" />
  if (trend < 0) return <TrendingDown className="w-4 h-4 text-race-red" />
  return <Minus className="w-4 h-4 text-slate-500" />
}

const POINTS_TABLE = { 1: 25, 2: 20, 3: 16, 4: 13, 5: 10 }

function computeStandings(data) {
  const pilots = {}
  const latestEvent = data[0]
  const secondLatest = data[1]

  for (const event of data) {
    for (const result of event.results) {
      if (!pilots[result.pilot]) {
        pilots[result.pilot] = { name: result.pilot, points: 0, wins: 0, podiums: 0, races: 0, trend: 0 }
      }
      const p = pilots[result.pilot]
      p.points += POINTS_TABLE[result.position] || 8
      p.races++
      if (result.position === 1) p.wins++
      if (result.position <= 3) p.podiums++
    }
  }

  // Compute trend (position change from second-latest to latest event)
  if (latestEvent && secondLatest) {
    const latestOrder = latestEvent.results.map(r => r.pilot)
    const prevOrder = secondLatest.results.map(r => r.pilot)
    for (const pilot of Object.values(pilots)) {
      const curIdx = latestOrder.indexOf(pilot.name)
      const prevIdx = prevOrder.indexOf(pilot.name)
      if (curIdx >= 0 && prevIdx >= 0) {
        pilot.trend = prevIdx - curIdx // positive = improved
      }
    }
  }

  return Object.values(pilots).sort((a, b) => b.points - a.points)
}

function computeFastestLaps(data) {
  const laps = []
  for (const event of data) {
    for (const result of event.results) {
      laps.push({
        pilot: result.pilot,
        bestLap: result.bestLap,
        avgLap: result.avgLap,
        event: event.eventName,
        date: event.date,
      })
    }
  }
  return laps.sort((a, b) => a.bestLap - b.bestLap)
}

import React, { useState, useEffect } from 'react'
import { Radio, Clock, Flag, Zap, AlertCircle } from 'lucide-react'
import { MOCK_LIVE_RACE } from '../services/fpvtrackside'
import { FPVTRACKSIDE_CONFIG } from '../config'

export default function LiveRacePage() {
  // For now, use mock data. When FPVTrackside event ID is provided,
  // this will poll the live API.
  const [race, setRace] = useState(MOCK_LIVE_RACE)
  const [isLive, setIsLive] = useState(false)
  const [eventIdInput, setEventIdInput] = useState('')

  // Sort pilots by position
  const sortedPilots = [...race.pilots].sort((a, b) => a.position - b.position)

  // Find best overall lap
  const bestOverallLap = Math.min(...race.pilots.map(p => p.bestLap))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-racing text-2xl font-bold text-white tracking-wider">LIVE RACE</h1>
          {isLive ? (
            <span className="flex items-center gap-2 bg-race-red/20 text-race-red text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-race-red rounded-full live-indicator" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-2 bg-slate-700 text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
              DEMO DATA
            </span>
          )}
        </div>
      </div>

      {/* Connect to FPVTrackside */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-mighty-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-3">
              Enter an FPVTrackside Event ID to connect to live timing data.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventIdInput}
                onChange={e => setEventIdInput(e.target.value)}
                placeholder="FPVTrackside Event ID (UUID)"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mighty-500"
              />
              <button
                onClick={() => {
                  if (eventIdInput.trim()) {
                    setIsLive(true)
                    // In production, this would start polling:
                    // pollLiveData(eventIdInput, setRace)
                  }
                }}
                className="bg-mighty-600 hover:bg-mighty-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Race header */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-3">{race.eventName}</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-slate-400">Round</span>
            <p className="font-racing text-lg text-white">
              {race.currentRound} / {race.totalRounds}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Heat</span>
            <p className="font-racing text-lg text-white">
              {race.currentHeat} / {race.heatsInRound}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Status</span>
            <p className="font-racing text-lg text-race-green uppercase">
              {race.status.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Live standings */}
      <div className="space-y-3">
        {sortedPilots.map((pilot, idx) => (
          <div
            key={pilot.name}
            className={`bg-slate-800 rounded-xl border overflow-hidden transition-all ${
              idx === 0
                ? 'border-race-green/50 glow-green'
                : 'border-slate-700'
            }`}
          >
            <div className="flex items-center">
              {/* Position */}
              <div className={`w-16 flex-shrink-0 flex items-center justify-center py-5 ${
                idx === 0 ? 'bg-race-green/10' : idx === 1 ? 'bg-slate-700/30' : 'bg-slate-800'
              }`}>
                <span className={`font-racing text-2xl font-bold ${
                  idx === 0 ? 'text-race-green' : idx === 1 ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  P{pilot.position}
                </span>
              </div>

              {/* Pilot info */}
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pilot.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{pilot.name}</h3>
                  <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                    {pilot.channel}
                  </span>
                </div>

                {/* Lap times */}
                <div className="flex gap-2 flex-wrap">
                  {pilot.laps.map(lap => (
                    <span
                      key={lap.lap}
                      className={`text-xs px-2 py-1 rounded font-mono ${
                        lap.time === bestOverallLap
                          ? 'bg-purple-600/20 text-purple-400 font-bold'
                          : lap.time === pilot.bestLap
                          ? 'bg-race-green/20 text-race-green'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      L{lap.lap}: {lap.time.toFixed(2)}s
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 px-5 text-right">
                <div>
                  <p className="text-xs text-slate-500">Best Lap</p>
                  <p className={`font-mono font-bold ${
                    pilot.bestLap === bestOverallLap ? 'text-purple-400' : 'text-white'
                  }`}>
                    {pilot.bestLap.toFixed(2)}s
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-mono text-white">{pilot.totalTime.toFixed(2)}s</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Laps</p>
                  <p className="font-mono text-white">{pilot.laps.length}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-600/30" /> Overall fastest lap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-race-green/30" /> Personal best lap
        </span>
      </div>
    </div>
  )
}

// ============================================================
// FPVTrackside Service
// ============================================================
// Handles communication with FPVTrackside's API for live race
// data and historical results.

import { FPVTRACKSIDE_CONFIG } from '../config'

const { baseUrl, pollIntervalMs } = FPVTRACKSIDE_CONFIG

// Fetch rounds for a specific event
export async function getEventRounds(eventId) {
  try {
    const response = await fetch(`${baseUrl}/api/public/rounds/eventId/${eventId}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (err) {
    console.error('[FPVTrackside] Failed to fetch rounds:', err)
    return null
  }
}

// Poll for live race data (returns a cleanup function)
export function pollLiveData(eventId, onUpdate) {
  let active = true

  const poll = async () => {
    if (!active) return
    const data = await getEventRounds(eventId)
    if (data && active) {
      onUpdate(data)
    }
    if (active) {
      setTimeout(poll, pollIntervalMs)
    }
  }

  poll()

  return () => { active = false }
}

// Parse FPVTrackside race results into our normalized format
export function parseRaceResults(rawData) {
  if (!rawData || !Array.isArray(rawData)) return []

  return rawData.map(round => ({
    roundId: round.ID || round.id,
    roundNumber: round.RoundNumber || round.roundNumber,
    name: round.Name || round.name,
    eventType: round.EventType || round.eventType,
    roundType: round.RoundType || round.roundType,
    heats: (round.Heats || round.heats || []).map(heat => ({
      heatNumber: heat.HeatNumber || heat.heatNumber,
      results: (heat.Results || heat.results || []).map(result => ({
        pilotName: result.PilotName || result.pilotName,
        position: result.Position || result.position,
        laps: result.Laps || result.laps || 0,
        bestLap: result.BestLap || result.bestLap,
        totalTime: result.TotalTime || result.totalTime,
        consecutiveLaps: result.ConsecutiveLaps || result.consecutiveLaps,
        status: result.Status || result.status || 'finished',
      })),
    })),
  }))
}

// ============================================================
// Mock live race data (for development / demo)
// ============================================================
export const MOCK_LIVE_RACE = {
  eventId: 'demo-event-001',
  eventName: 'Indoor Whoop Night #12',
  status: 'in_progress', // 'upcoming', 'in_progress', 'completed'
  currentRound: 3,
  totalRounds: 6,
  currentHeat: 2,
  heatsInRound: 4,
  pilots: [
    {
      name: 'Tbell',
      channel: 'R1',
      color: '#ef4444',
      laps: [
        { lap: 1, time: 12.45 },
        { lap: 2, time: 11.89 },
        { lap: 3, time: 12.12 },
      ],
      bestLap: 11.89,
      totalTime: 36.46,
      position: 2,
    },
    {
      name: 'Fabulous_Disaster',
      channel: 'R2',
      color: '#3b82f6',
      laps: [
        { lap: 1, time: 11.67 },
        { lap: 2, time: 11.92 },
        { lap: 3, time: 11.55 },
      ],
      bestLap: 11.55,
      totalTime: 35.14,
      position: 1,
    },
    {
      name: 'NorthStarFPV',
      channel: 'R3',
      color: '#22c55e',
      laps: [
        { lap: 1, time: 13.01 },
        { lap: 2, time: 12.78 },
        { lap: 3, time: 12.34 },
      ],
      bestLap: 12.34,
      totalTime: 38.13,
      position: 3,
    },
    {
      name: 'FrostyFlips',
      channel: 'R4',
      color: '#eab308',
      laps: [
        { lap: 1, time: 13.55 },
        { lap: 2, time: 13.12 },
      ],
      bestLap: 13.12,
      totalTime: 26.67,
      position: 4,
    },
  ],
}

// Mock historical results for stats
export const MOCK_HISTORICAL = [
  {
    eventName: 'Winter Series Final',
    date: '2026-02-22',
    results: [
      { pilot: 'Fabulous_Disaster', position: 1, bestLap: 10.89, avgLap: 11.34 },
      { pilot: 'Tbell', position: 2, bestLap: 11.12, avgLap: 11.67 },
      { pilot: 'NorthStarFPV', position: 3, bestLap: 11.45, avgLap: 12.01 },
      { pilot: 'FrostyFlips', position: 4, bestLap: 12.01, avgLap: 12.56 },
      { pilot: 'LakeEffectFPV', position: 5, bestLap: 12.23, avgLap: 12.89 },
    ],
  },
  {
    eventName: 'Winter Series Round 4',
    date: '2026-02-08',
    results: [
      { pilot: 'Tbell', position: 1, bestLap: 11.01, avgLap: 11.45 },
      { pilot: 'Fabulous_Disaster', position: 2, bestLap: 11.23, avgLap: 11.78 },
      { pilot: 'FrostyFlips', position: 3, bestLap: 11.89, avgLap: 12.34 },
      { pilot: 'NorthStarFPV', position: 4, bestLap: 12.12, avgLap: 12.67 },
      { pilot: 'LakeEffectFPV', position: 5, bestLap: 12.45, avgLap: 13.01 },
    ],
  },
  {
    eventName: 'Winter Series Round 3',
    date: '2026-01-25',
    results: [
      { pilot: 'Fabulous_Disaster', position: 1, bestLap: 10.67, avgLap: 11.12 },
      { pilot: 'NorthStarFPV', position: 2, bestLap: 11.23, avgLap: 11.78 },
      { pilot: 'Tbell', position: 3, bestLap: 11.34, avgLap: 11.89 },
      { pilot: 'FrostyFlips', position: 4, bestLap: 12.01, avgLap: 12.45 },
      { pilot: 'LakeEffectFPV', position: 5, bestLap: 12.56, avgLap: 13.12 },
    ],
  },
  {
    eventName: 'Winter Series Round 2',
    date: '2026-01-11',
    results: [
      { pilot: 'Tbell', position: 1, bestLap: 11.23, avgLap: 11.78 },
      { pilot: 'Fabulous_Disaster', position: 2, bestLap: 11.45, avgLap: 11.89 },
      { pilot: 'NorthStarFPV', position: 3, bestLap: 11.89, avgLap: 12.34 },
      { pilot: 'FrostyFlips', position: 4, bestLap: 12.34, avgLap: 12.89 },
      { pilot: 'LakeEffectFPV', position: 5, bestLap: 12.67, avgLap: 13.23 },
    ],
  },
  {
    eventName: 'Winter Series Round 1',
    date: '2025-12-28',
    results: [
      { pilot: 'NorthStarFPV', position: 1, bestLap: 11.01, avgLap: 11.56 },
      { pilot: 'Tbell', position: 2, bestLap: 11.12, avgLap: 11.67 },
      { pilot: 'Fabulous_Disaster', position: 3, bestLap: 11.34, avgLap: 11.89 },
      { pilot: 'FrostyFlips', position: 4, bestLap: 12.12, avgLap: 12.67 },
      { pilot: 'LakeEffectFPV', position: 5, bestLap: 12.89, avgLap: 13.45 },
    ],
  },
]

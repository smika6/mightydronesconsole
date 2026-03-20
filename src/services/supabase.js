// ============================================================
// Supabase Data Service
// ============================================================
// Handles persistent storage for historical race data.
// Falls back to localStorage when Supabase is not configured.

import { SUPABASE_CONFIG } from '../config'

const isConfigured = () => !!SUPABASE_CONFIG.url && !!SUPABASE_CONFIG.anonKey

let supabase = null

async function getClient() {
  if (!isConfigured()) return null
  if (!supabase) {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  }
  return supabase
}

// ============================================================
// Race Results Storage
// ============================================================

export async function saveRaceResult(result) {
  const client = await getClient()
  if (client) {
    const { error } = await client.from('race_results').upsert(result, {
      onConflict: 'event_id,pilot_name',
    })
    if (error) console.error('[Supabase] Save error:', error)
    return !error
  }
  // Fallback: localStorage
  const results = getLocalResults()
  const key = `${result.event_id}:${result.pilot_name}`
  results[key] = result
  localStorage.setItem('mighty_drones_results', JSON.stringify(results))
  return true
}

export async function getRaceResults(filters = {}) {
  const client = await getClient()
  if (client) {
    let query = client.from('race_results').select('*')
    if (filters.pilotName) query = query.eq('pilot_name', filters.pilotName)
    if (filters.eventId) query = query.eq('event_id', filters.eventId)
    if (filters.after) query = query.gte('race_date', filters.after)
    query = query.order('race_date', { ascending: false })
    const { data, error } = await query
    if (error) console.error('[Supabase] Query error:', error)
    return data || []
  }
  // Fallback: localStorage
  const results = Object.values(getLocalResults())
  return results
    .filter(r => {
      if (filters.pilotName && r.pilot_name !== filters.pilotName) return false
      if (filters.eventId && r.event_id !== filters.eventId) return false
      return true
    })
    .sort((a, b) => new Date(b.race_date) - new Date(a.race_date))
}

// ============================================================
// Lap Times Storage
// ============================================================

export async function saveLapTimes(lapData) {
  const client = await getClient()
  if (client) {
    const { error } = await client.from('lap_times').insert(lapData)
    if (error) console.error('[Supabase] Lap save error:', error)
    return !error
  }
  // Fallback: localStorage
  const laps = getLocalLaps()
  laps.push(...(Array.isArray(lapData) ? lapData : [lapData]))
  localStorage.setItem('mighty_drones_laps', JSON.stringify(laps))
  return true
}

export async function getPilotLapHistory(pilotName, limit = 100) {
  const client = await getClient()
  if (client) {
    const { data, error } = await client
      .from('lap_times')
      .select('*')
      .eq('pilot_name', pilotName)
      .order('recorded_at', { ascending: false })
      .limit(limit)
    if (error) console.error('[Supabase] Lap query error:', error)
    return data || []
  }
  const laps = getLocalLaps()
  return laps
    .filter(l => l.pilot_name === pilotName)
    .slice(0, limit)
}

// ============================================================
// Pilot Stats (computed)
// ============================================================

export async function getPilotStats(pilotName) {
  const results = await getRaceResults({ pilotName })
  if (results.length === 0) return null

  const wins = results.filter(r => r.position === 1).length
  const podiums = results.filter(r => r.position <= 3).length
  const bestLap = Math.min(...results.map(r => r.best_lap).filter(Boolean))
  const avgLap = results.reduce((sum, r) => sum + (r.avg_lap || 0), 0) / results.length

  return {
    totalRaces: results.length,
    wins,
    podiums,
    bestLap: isFinite(bestLap) ? bestLap : null,
    avgLap: avgLap || null,
    winRate: ((wins / results.length) * 100).toFixed(1),
    podiumRate: ((podiums / results.length) * 100).toFixed(1),
    recentResults: results.slice(0, 5),
  }
}

// ============================================================
// Local storage helpers
// ============================================================

function getLocalResults() {
  try {
    return JSON.parse(localStorage.getItem('mighty_drones_results') || '{}')
  } catch { return {} }
}

function getLocalLaps() {
  try {
    return JSON.parse(localStorage.getItem('mighty_drones_laps') || '[]')
  } catch { return [] }
}

// ============================================================
// Supabase Schema (run this in Supabase SQL editor to set up)
// ============================================================
export const SETUP_SQL = `
-- Race results table
CREATE TABLE IF NOT EXISTS race_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  race_date TIMESTAMPTZ NOT NULL,
  pilot_name TEXT NOT NULL,
  position INTEGER,
  best_lap REAL,
  avg_lap REAL,
  total_time REAL,
  laps_completed INTEGER,
  course_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, pilot_name)
);

-- Lap times table
CREATE TABLE IF NOT EXISTS lap_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  pilot_name TEXT NOT NULL,
  round_number INTEGER,
  heat_number INTEGER,
  lap_number INTEGER,
  lap_time REAL NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_results_pilot ON race_results(pilot_name);
CREATE INDEX IF NOT EXISTS idx_results_date ON race_results(race_date DESC);
CREATE INDEX IF NOT EXISTS idx_laps_pilot ON lap_times(pilot_name);
CREATE INDEX IF NOT EXISTS idx_laps_event ON lap_times(event_id);

-- Enable Row Level Security (public read, authenticated write)
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lap_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON race_results FOR SELECT USING (true);
CREATE POLICY "Public read" ON lap_times FOR SELECT USING (true);
CREATE POLICY "Anon insert" ON race_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert" ON lap_times FOR INSERT WITH CHECK (true);
`

export { isConfigured }

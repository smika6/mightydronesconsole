-- ============================================================
-- Mighty Drones Web Console - Supabase Schema Setup
-- ============================================================
-- Run this in Supabase > SQL Editor > New Query

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

-- Enable Row Level Security (public read, anon write)
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lap_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read race_results" ON race_results FOR SELECT USING (true);
CREATE POLICY "Public read lap_times" ON lap_times FOR SELECT USING (true);
CREATE POLICY "Anon insert race_results" ON race_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert lap_times" ON lap_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update race_results" ON race_results FOR UPDATE USING (true);

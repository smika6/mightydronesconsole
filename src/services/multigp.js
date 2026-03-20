// ============================================================
// MultiGP API Service
// ============================================================
// Handles all communication with the MultiGP API.
// Falls back to mock data when no API key is configured.

import { MULTIGP_CONFIG } from '../config'

const { baseUrl, apiKey } = MULTIGP_CONFIG

const isConfigured = () => !!apiKey

async function apiCall(action, params = {}) {
  if (!isConfigured()) {
    console.warn('[MultiGP] No API key configured — using mock data')
    return null
  }

  try {
    const response = await fetch(`${baseUrl}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, ...params }),
    })
    const data = await response.json()
    if (!data.status) {
      console.error('[MultiGP] API error:', data.statusDescription)
      return null
    }
    return data.data
  } catch (err) {
    console.error('[MultiGP] Request failed:', err)
    return null
  }
}

// Fetch chapter info
export async function getChapterInfo() {
  const data = await apiCall('chapter/findChapterFromApiKey')
  return data || MOCK_DATA.chapter
}

// Fetch upcoming races for the chapter
export async function getChapterRaces() {
  const data = await apiCall('race/list', {
    chapterUrlName: MULTIGP_CONFIG.chapterUrl,
    isUpcoming: true,
  })
  return data || MOCK_DATA.races
}

// Fetch past race results
export async function getPastRaces() {
  const data = await apiCall('race/list', {
    chapterUrlName: MULTIGP_CONFIG.chapterUrl,
    isUpcoming: false,
  })
  return data || MOCK_DATA.pastRaces
}

// Fetch details for a specific race
export async function getRaceDetails(raceId) {
  const data = await apiCall('race/view', { id: raceId })
  return data || MOCK_DATA.raceDetail
}

// Search for a pilot
export async function searchPilot(username) {
  const data = await apiCall('user/search', { search: username })
  return data
}

// ============================================================
// Mock Data (used when no API key is configured)
// ============================================================
const MOCK_DATA = {
  chapter: {
    id: 'mighty-drones',
    name: 'Mighty Drones',
    description: 'Minneapolis FPV drone racing chapter',
    city: 'Minneapolis',
    state: 'MN',
    memberCount: 24,
    raceCount: 47,
    tier: 'Standard',
  },

  races: [
    {
      id: 'race-001',
      name: 'Spring Opener 2026',
      startDate: '2026-04-12T13:00:00',
      city: 'Minneapolis',
      state: 'MN',
      address: 'Theodore Wirth Park',
      courseName: 'Wirth Park Circuit',
      mainImageUrl: null,
      pilotCount: 16,
      status: 'upcoming',
    },
    {
      id: 'race-002',
      name: 'Indoor Whoop Night #12',
      startDate: '2026-03-28T18:00:00',
      city: 'Minneapolis',
      state: 'MN',
      address: 'Northeast Warehouse',
      courseName: 'Whoop Arena',
      mainImageUrl: null,
      pilotCount: 12,
      status: 'upcoming',
    },
    {
      id: 'race-003',
      name: 'MultiGP Global Qualifier Week 1',
      startDate: '2026-05-03T10:00:00',
      city: 'Minneapolis',
      state: 'MN',
      address: 'Flying Field #3',
      courseName: 'GQ Track 2026',
      mainImageUrl: null,
      pilotCount: 20,
      status: 'upcoming',
    },
  ],

  pastRaces: [
    {
      id: 'race-past-001',
      name: 'Winter Series Final',
      startDate: '2026-02-22T12:00:00',
      city: 'Minneapolis',
      state: 'MN',
      courseName: 'Indoor Arena',
      pilotCount: 18,
      status: 'completed',
    },
    {
      id: 'race-past-002',
      name: 'Winter Series Round 4',
      startDate: '2026-02-08T12:00:00',
      city: 'Minneapolis',
      state: 'MN',
      courseName: 'Indoor Arena',
      pilotCount: 15,
      status: 'completed',
    },
    {
      id: 'race-past-003',
      name: 'Winter Series Round 3',
      startDate: '2026-01-25T12:00:00',
      city: 'Minneapolis',
      state: 'MN',
      courseName: 'Indoor Arena',
      pilotCount: 14,
      status: 'completed',
    },
  ],

  raceDetail: {
    id: 'race-001',
    name: 'Spring Opener 2026',
    startDate: '2026-04-12T13:00:00',
    description: 'First outdoor race of the season! Bring your 5" quads ready to rip.',
    courseName: 'Wirth Park Circuit',
    address: 'Theodore Wirth Park',
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9969,
    longitude: -93.3245,
    entries: [
      { pilotName: 'Tbell', status: 'registered' },
      { pilotName: 'Fabulous_Disaster', status: 'registered' },
      { pilotName: 'NorthStarFPV', status: 'registered' },
      { pilotName: 'FrostyFlips', status: 'registered' },
      { pilotName: 'LakeEffectFPV', status: 'registered' },
    ],
  },
}

export { MOCK_DATA, isConfigured }

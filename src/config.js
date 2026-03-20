// ============================================================
// Mighty Drones Web Console - Configuration
// ============================================================
// Edit this file to configure your chapter's settings.

export const CHAPTER_CONFIG = {
  name: 'Mighty Drones',
  location: 'Minneapolis, MN',
  organizers: ['Tbell', 'Fabulous_Disaster'],
  description: 'Minneapolis FPV drone racing chapter — pushing limits and having fun.',
  socials: {
    multigp: 'https://www.multigp.com/chapters/view/?chapter=Mighty-Drones',
    youtube: '',
    facebook: '',
    instagram: '',
  },
}

// MultiGP API Configuration
// To get your chapter API key: Log into MultiGP > Chapter Admin > API Keys
export const MULTIGP_CONFIG = {
  baseUrl: 'https://www.multigp.com/mgp/multigpwebservice',
  apiKey: '', // Your chapter API key goes here
  chapterUrl: 'Mighty-Drones', // URL slug from your MultiGP chapter page
}

// FPVTrackside Configuration
export const FPVTRACKSIDE_CONFIG = {
  baseUrl: 'https://www.fpvtrackside.com',
  pollIntervalMs: 5000, // How often to poll for live data during races
}

// Supabase Configuration
// Sign up free at https://supabase.com
export const SUPABASE_CONFIG = {
  url: 'https://yjedkclrdyotzcliktzf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZWRrY2xyZHlvdHpjbGlrdHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjkzOTYsImV4cCI6MjA4OTYwNTM5Nn0.-PZsmM7qeNBeZoEKagPSjxW3CUU9RCOuGD6mN5aWrG0',
}

// ============================================================
// Pilot Directory
// ============================================================
// Add your chapter pilots here. YouTube URLs and callsigns.
export const PILOTS = [
  {
    name: 'Tbell',
    callsign: 'Tbell',
    youtube: '', // e.g. 'https://www.youtube.com/@TbellFPV'
    multigpId: '',
    bio: 'Chapter organizer. Minneapolis ripper.',
    avatar: null, // URL to avatar image, or null for generated initials
  },
  {
    name: 'Fabulous_Disaster',
    callsign: 'Fabulous_Disaster',
    youtube: '',
    multigpId: '',
    bio: 'Chapter organizer. Sending it in the Twin Cities.',
    avatar: null,
  },
  // Add more pilots:
  // {
  //   name: 'PilotName',
  //   callsign: 'CALLSIGN',
  //   youtube: 'https://www.youtube.com/@channel',
  //   multigpId: '',
  //   bio: 'Short bio here.',
  //   avatar: null,
  // },
]

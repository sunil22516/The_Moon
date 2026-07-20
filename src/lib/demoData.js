// Demo posts — shown when Supabase isn't configured or feed is empty
// All clearly labeled isDemo: true and tagged "SAMPLE" in the UI

export const DEMO_POSTS = [
  {
    id: 'demo-1',
    user: { id: 'u1', username: 'luna.beats', display_name: 'Luna Beats', avatar_url: null },
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover_url: '/postcards/postcard_midnight.jpg',
    caption: 'Midnight Vibes 🌙',
    duration_seconds: 45,
    category: 'Lo-fi Hip Hop',
    tags: ['lofi', 'chill', 'nightvibes'],
    is_demo: true,
    like_count: 1247,
    comment_count: 89,
    share_count: 234,
    play_count: 8420,
    created_at: '2026-07-15T20:00:00Z',
    lyrics: [
      { time: 0, text: '🎵 Instrumental — close your eyes' },
      { time: 8, text: 'Let the bass take you somewhere' },
      { time: 16, text: 'Midnight hours, city quiet' },
      { time: 24, text: 'Headphones on, world on mute' },
      { time: 32, text: 'Every beat a heartbeat echoing' },
      { time: 40, text: 'Lost in sound, found in feeling' },
    ],
  },
  {
    id: 'demo-2',
    user: { id: 'u2', username: 'desi.cipher', display_name: 'Desi Cipher', avatar_url: null },
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover_url: '/postcards/postcard_golden.jpg',
    caption: 'Golden Hour ✨ original verse',
    duration_seconds: 52,
    category: 'Desi Hip Hop',
    tags: ['desi', 'hiphop', 'original', 'bars'],
    is_demo: true,
    like_count: 3891,
    comment_count: 312,
    share_count: 567,
    play_count: 15300,
    created_at: '2026-07-14T18:30:00Z',
    lyrics: [
      { time: 0, text: 'Sun going down, gold in the sky' },
      { time: 7, text: 'Desi beats rolling, feeling so fly' },
      { time: 14, text: 'From the gullies to the global stage' },
      { time: 21, text: 'Writing history on every page' },
      { time: 28, text: 'Apni awaaz, apni pehchaan' },
      { time: 35, text: 'Every bar hits like a plan' },
      { time: 42, text: 'Golden hour — our time to shine' },
    ],
  },
  {
    id: 'demo-3',
    user: { id: 'u3', username: 'cloud.walker', display_name: 'Cloud Walker', avatar_url: null },
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover_url: '/postcards/postcard_neon.jpg',
    caption: 'Neon Dreams 💜 late night session',
    duration_seconds: 38,
    category: 'Chill Trap',
    tags: ['trap', 'chill', 'neon', 'dreamy'],
    is_demo: true,
    like_count: 2156,
    comment_count: 145,
    share_count: 389,
    play_count: 11200,
    created_at: '2026-07-13T23:15:00Z',
    lyrics: [
      { time: 0, text: 'Neon lights reflecting rain' },
      { time: 8, text: 'Walking streets without a name' },
      { time: 16, text: 'Bass so deep it fills the void' },
      { time: 24, text: 'Every sound, every noise' },
      { time: 32, text: 'Dreams in purple, thoughts in pink' },
    ],
  },
  {
    id: 'demo-4',
    user: { id: 'u4', username: 'raw.theory', display_name: 'Raw Theory', avatar_url: null },
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover_url: '/postcards/postcard_street.jpg',
    caption: 'Street Lights 🔥 freestyle',
    duration_seconds: 60,
    category: 'Boom Bap',
    tags: ['boombap', 'freestyle', 'raw', 'streetrap'],
    is_demo: true,
    like_count: 5678,
    comment_count: 423,
    share_count: 891,
    play_count: 22400,
    created_at: '2026-07-12T21:00:00Z',
    lyrics: [
      { time: 0, text: 'Street lights flickering, mic check' },
      { time: 8, text: 'Raw theory dropping, show respect' },
      { time: 16, text: 'Boom bap classic, never fading' },
      { time: 24, text: 'Underground king, no debating' },
      { time: 32, text: 'Every word hits like concrete' },
      { time: 40, text: 'Real talk from the real street' },
      { time: 48, text: 'No filter, no pretending' },
      { time: 56, text: 'The message never-ending' },
    ],
  },
  {
    id: 'demo-5',
    user: { id: 'u5', username: 'neon.collective', display_name: 'Neon Collective', avatar_url: null },
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover_url: '/postcards/postcard_pulse.jpg',
    caption: 'City Pulse 🌃 electronic vibes',
    duration_seconds: 47,
    category: 'Electronic',
    tags: ['electronic', 'synth', 'city', 'future'],
    is_demo: true,
    like_count: 1834,
    comment_count: 97,
    share_count: 278,
    play_count: 9100,
    created_at: '2026-07-11T19:45:00Z',
    lyrics: [
      { time: 0, text: '🎵 Synth waves incoming...' },
      { time: 10, text: 'City never sleeps, neither do we' },
      { time: 20, text: 'Pulse of the crowd, frequency' },
      { time: 30, text: 'Electric hearts, digital souls' },
      { time: 40, text: 'The future is ours to control' },
    ],
  },
];

export function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

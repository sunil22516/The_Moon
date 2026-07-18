# Moon App — Immersive Rebuild Walkthrough

## What Changed

The Moon app was rebuilt from a basic flat-list music player into a **full-screen, TikTok-style music discovery experience** with animated postcards, gesture controls, and a premium dark glassmorphic UI.

### Before → After

| Feature | Before | After |
|---|---|---|
| Feed | Basic FlatList with row cards | Full-screen vertical swipe with snap-to-card |
| Track visuals | Small 48×48 thumbnail | Animated postcard covering 80% of screen with Live Photo-style breathing |
| Social | Simple like button | Vertical sidebar: like (animated), comment, share, menu |
| Navigation | React Navigation bottom tabs | Custom glassmorphic BottomTaskbar with glow effects |
| Playback | Play/pause only | Tap-to-pause, volume bar, progress bar, lyrics sheet |
| Create | Just upload | Modal with Karaoke + Upload options |
| Auth | Plain inputs | Premium dark UI with animated glowing logo |
| Demo labeling | None | "SAMPLE TRACK" badge on all demo content |

---

## Architecture

```
The_Moon/
├── App.js                           ← Entry: GestureHandler root + Stack nav
├── babel.config.js                  ← Reanimated plugin
├── lib/
│   └── supabase.js                  ← Supabase client (preserved)
├── assets/
│   ├── logo.png
│   └── postcards/                   ← 5 AI-generated postcard images
│       ├── postcard_midnight.jpg
│       ├── postcard_golden.jpg
│       ├── postcard_neon.jpg
│       ├── postcard_street.jpg
│       └── postcard_pulse.jpg
└── src/
    ├── constants/
    │   ├── theme.js                 ← Design tokens: colors, typography, spacing, shadows
    │   └── mockData.js              ← 5 demo tracks with metadata + lyrics
    ├── utils/
    │   └── audioManager.js          ← Singleton audio controller (expo-av)
    ├── components/
    │   ├── AnimatedPostcard.js       ← Live Photo breathing animation
    │   ├── SongCard.js              ← Full-viewport card (core content unit)
    │   ├── SocialSidebar.js         ← Like/comment/share rail
    │   ├── BottomTaskbar.js         ← Home/Create/Discover bar
    │   ├── VolumeBar.js             ← Gradient volume slider
    │   ├── ProgressBar.js           ← Song progress indicator
    │   ├── LyricsSheet.js           ← Expandable lyrics bottom sheet
    │   ├── SearchModal.js           ← Full-screen search with filtering
    │   ├── ProfileButton.js         ← Top-left avatar button
    │   └── CreateModal.js           ← Karaoke/Upload options
    └── screens/
        ├── FeedScreen.js            ← Main feed (Home + Global switching)
        ├── AuthScreen.js            ← Glowing logo auth screen
        ├── UploadScreen.js          ← Redesigned Supabase upload
        ├── KaraokeScreen.js         ← Sing-along UI with auto-scrolling lyrics
        └── ProfileScreen.js         ← User profile with stats + menu
```

---

## Key Features Built

### 1. Full-Screen Vertical Swipe Feed
- `FlatList` with `pagingEnabled` and `snapToInterval` for TikTok-style card snapping
- Scroll **up** = next song, **down** = previous
- Auto-plays audio when a card enters view
- `getItemLayout` for optimal scroll performance

### 2. Animated Postcard (iPhone Live Photo Feel)
- `react-native-reanimated` with `withRepeat` + `withSequence`
- Subtle scale oscillation: 1.0 → 1.04 → 1.0 over 6 seconds
- Gentle XY drift (±5px X, ±3px Y) at different frequencies
- Creates an alive, breathing visual without video overhead

### 3. Social Sidebar
- Vertical right rail (like TikTok)
- **Like**: Animated spring bounce (scale 1.4x → 1x) on tap, fills heart, updates count
- **Comment + Share**: UI-ready buttons (handlers can be wired when backend supports)
- **Menu**: Overflow dropdown slot

### 4. Bottom Taskbar
- Glassmorphic blur bar (`expo-blur`) with rounded corners
- **Home** + **Discover** tabs with active glow indicator
- **Create** button: center-elevated with purple-to-pink gradient, shadow glow
- Switching tabs changes the feed data source (chronological vs trending)

### 5. Lyrics Bottom Sheet
- Tap "Lyrics" pill → animated slide-up sheet with blur background
- Auto-highlights current lyric line based on playback time
- Past lines dim, next lines preview
- Swipe down or tap outside to dismiss

### 6. Demo Content Labeling
- Every demo track has `isDemo: true` in mock data
- "SAMPLE TRACK" badge rendered on each card's postcard area
- Search results show "SAMPLE" badge
- Karaoke screen shows "SAMPLE TRACK · Karaoke UI Preview" banner

---

## Dependencies Added

| Package | Purpose |
|---|---|
| `react-native-gesture-handler@~2.20.2` | Native gesture recognition for swipes |
| `react-native-reanimated@~3.16.1` | 60fps UI-thread animations |
| `expo-blur@~14.0.3` | Glassmorphic blur effects |
| `expo-linear-gradient@~14.0.2` | Gradient fills |
| `expo-haptics@~14.0.1` | Haptic feedback |
| `@react-navigation/native-stack@^6.9.26` | Stack navigator for modal screens |
| `expo-asset` | Asset management (auto-resolved) |

---

## How to Run

```bash
cd "c:\Users\sunil\Desktop\The Moon Inc\The_Moon"
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press:
- `a` for Android emulator
- `i` for iOS simulator

> [!NOTE]
> The app requires Supabase credentials to be set in [lib/supabase.js](file:///c:/Users/sunil/Desktop/The%20Moon%20Inc/The_Moon/lib/supabase.js) for auth to work. To bypass auth and go straight to the feed for demo purposes, you can temporarily change `if (!session)` to `if (false)` in [App.js](file:///c:/Users/sunil/Desktop/The%20Moon%20Inc/The_Moon/App.js).

> [!TIP]
> The minor `react-native@0.76.5 vs 0.76.9` version warning is non-critical and won't affect functionality. To fix: `npx expo install react-native`

---

## Verification

- ✅ Expo dev server starts successfully at `localhost:8081`
- ✅ All 15 new source files created (10 components, 5 screens)
- ✅ 5 AI-generated postcard images in `assets/postcards/`
- ✅ 5 demo tracks with royalty-free audio (SoundHelix CC0)
- ✅ Supabase auth integration preserved
- ✅ Demo content clearly labeled with "SAMPLE TRACK" badges

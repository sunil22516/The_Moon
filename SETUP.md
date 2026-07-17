# Moon demo — setup, right now

## 1. Supabase (5 min)
1. supabase.com → New project → name it, set a DB password, pick a region.
2. Dashboard → SQL Editor → paste `supabase_schema.sql` → Run.
3. Dashboard → Storage → create two buckets: `audio` and `covers` → mark both **Public**.
4. Dashboard → Project Settings → API → copy the `Project URL` and `anon public` key.
5. Paste both into `lib/supabase.js` (`supabaseUrl`, `supabaseAnonKey`).

## 2. Run the app
```
cd moon-app
npm install
npx expo install expo-av expo-document-picker expo-image-picker @react-native-async-storage/async-storage
npx expo start
```
Scan the QR code with the **Expo Go** app on your phone (iOS: Camera app, Android: Expo Go's scanner).

## 3. Approve tracks as they come in
No admin screen yet — after a friend uploads, go to Supabase Dashboard → Table Editor → `tracks`,
find the row, set `approved` to `true`. It'll show up in Feed/Trending immediately.

## 4. Send this to your friends tonight
- They open the Expo Go link/QR you send them.
- Sign up with email + password.
- Upload tab → pick a track they actually own → title → upload.
- You approve it → tell them to check the Feed tab.

## What's deliberately missing (don't build tonight)
- Comments (button exists, not wired — add a `comments` table same pattern as `likes` when you want it)
- Push notifications
- Real trending algorithm (this is just sorted by raw like count — fine for now)
- App store builds — Expo Go is enough for a friends-only test

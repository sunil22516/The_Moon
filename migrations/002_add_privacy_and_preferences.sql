-- ═══════════════════════════════════════════════
-- MOON — Migration 002: Privacy, Preferences, Lyrics
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- Add new columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Add lyrics column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS lyrics jsonb DEFAULT '[]';

-- Update posts_read RLS: private accounts' posts visible only to owner + followers
DROP POLICY IF EXISTS "posts_read" ON posts;
CREATE POLICY "posts_read" ON posts FOR SELECT USING (
  -- Post owner can always see their own
  user_id = auth.uid()
  OR
  -- Public accounts' posts are visible to everyone
  NOT EXISTS (SELECT 1 FROM profiles WHERE id = posts.user_id AND is_private = true)
  OR
  -- Followers of private accounts can see their posts
  EXISTS (SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = posts.user_id)
);

-- Update profiles_read RLS: private profiles hidden from non-followers
DROP POLICY IF EXISTS "profiles_read" ON profiles;
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (
  -- Own profile
  id = auth.uid()
  OR
  -- Public profiles
  is_private = false
  OR
  -- Followers can see private profiles
  EXISTS (SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = profiles.id)
);

-- Storage policies for public buckets (run only if buckets exist)
-- These allow public reads and authenticated uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read, authenticated users can upload
CREATE POLICY "public_read_audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "auth_upload_audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY "public_read_covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "auth_upload_covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');
CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "auth_upload_avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

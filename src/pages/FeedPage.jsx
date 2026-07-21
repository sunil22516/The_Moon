import React, { useState, useEffect, useRef, useCallback } from 'react';
import VoiceCard from '../components/VoiceCard';
import SocialSidebar from '../components/SocialSidebar';
import BottomNav from '../components/BottomNav';
import TopBar from '../components/TopBar';
import LyricsSheet from '../components/LyricsSheet';
import CreateModal from '../components/CreateModal';
import CommentSheet from '../components/CommentSheet';
import SearchOverlay from '../components/SearchOverlay';
import { useAudio } from '../hooks/useAudio';
import { useSwipe } from '../hooks/useSwipe';
import { supabase } from '../lib/supabase';
import { DEMO_POSTS } from '../lib/demoData';

export default function FeedPage({ user, session, demoMode = false, onNavigate, onLogout }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [isSeeking, setIsSeeking] = useState(false);
  const [realPosts, setRealPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const feedRef = useRef(null);
  const audio = useAudio();

  // Fetch real posts from Supabase
  const fetchPosts = useCallback(async (tab) => {
    if (!supabase || demoMode) return;
    setLoadingPosts(true);
    try {
      let query = supabase
        .from('posts')
        .select('*, user:profiles(id, username, display_name, avatar_url)')
        .eq('is_demo', false);

      if (tab === 'discover') {
        query = query.order('like_count', { ascending: false }).limit(50);
      } else {
        query = query.order('created_at', { ascending: false }).limit(50);
      }

      const { data, error } = await query;
      if (!error && data) {
        setRealPosts(data);
      }
    } catch (err) {
      console.warn('Failed to fetch posts:', err);
    }
    setLoadingPosts(false);
  }, [demoMode]);

  // Fetch user's likes
  const fetchLikes = useCallback(async () => {
    if (!supabase || !user) return;
    const { data } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.id);
    if (data) {
      const map = {};
      data.forEach(l => { map[l.post_id] = true; });
      setLikedPosts(map);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(activeTab);
    fetchLikes();
  }, [activeTab, fetchPosts, fetchLikes]);

  // Merge real posts with demo posts as fallback
  const posts = (() => {
    const demoPosts = DEMO_POSTS.map(p => ({
      ...p,
      user: p.user || { id: p.user?.id, username: p.user?.username, display_name: p.user?.display_name, avatar_url: null },
    }));

    if (demoMode || realPosts.length === 0) {
      return demoPosts;
    }
    // Real posts first, then demo posts labeled as samples
    return [...realPosts, ...demoPosts];
  })();

  const currentPost = posts[currentIndex];

  // Load audio when current post changes
  useEffect(() => {
    if (!currentPost) return;
    const loadTrack = async () => {
      await audio.load(currentPost.audio_url);
      await audio.play();
    };
    loadTrack();
  }, [currentPost?.id]);

  // Scroll snap: detect which card is visible
  const handleScroll = useCallback(() => {
    const el = feedRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const cardHeight = el.clientHeight;
    const newIndex = Math.round(scrollTop / cardHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, posts.length]);

  // Tap to pause/play
  const handleTap = useCallback(async () => {
    if (showLyrics || showComments || showCreate || showSearch) return;
    await audio.toggle();
  }, [audio, showLyrics, showComments, showCreate, showSearch]);

  // Seek gestures
  const seekStartTimeRef = useRef(0);
  const handleSeekStart = useCallback(() => {
    setIsSeeking(true);
    seekStartTimeRef.current = audio.currentTime;
  }, [audio.currentTime]);

  const handleSeekMove = useCallback((dx) => {
    const seekDelta = (dx / window.innerWidth) * 30;
    audio.seek(seekStartTimeRef.current + seekDelta);
  }, [audio]);

  const handleSeekEnd = useCallback(() => {
    setIsSeeking(false);
  }, []);

  const { touchHandlers, mouseHandlers } = useSwipe({
    onTap: handleTap,
    onSeekStart: handleSeekStart,
    onSeekMove: handleSeekMove,
    onSeekEnd: handleSeekEnd,
  });

  // Tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, []);

  // Like — real Supabase write
  const handleLike = useCallback(async (postId) => {
    const isLiked = likedPosts[postId];
    // Optimistic update
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));

    if (!supabase || !user) return;

    try {
      if (isLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      }
    } catch (err) {
      // Revert on error
      setLikedPosts(prev => ({ ...prev, [postId]: isLiked }));
      console.warn('Like failed:', err);
    }
  }, [likedPosts, user]);

  return (
    <div style={styles.root}>
      <TopBar
        onProfilePress={() => onNavigate?.('profile')}
        onSearchPress={() => setShowSearch(true)}
      />

      <div
        ref={feedRef}
        style={styles.feed}
        onScroll={handleScroll}
        {...touchHandlers}
        {...mouseHandlers}
      >
        {posts.map((post, index) => (
          <div key={post.id} style={styles.cardWrapper}>
            <VoiceCard
              post={post}
              isActive={index === currentIndex}
              isPlaying={index === currentIndex && audio.isPlaying}
              currentTime={index === currentIndex ? audio.currentTime : 0}
              duration={index === currentIndex ? audio.duration : 0}
              volume={audio.volume}
              isSeeking={index === currentIndex && isSeeking}
              onTap={handleTap}
              onVolumeChange={audio.setVolume}
              onLyricsOpen={() => setShowLyrics(true)}
              onLike={() => handleLike(post.id)}
              onComment={() => setShowComments(true)}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({ title: post.caption, text: `Listen to ${post.caption} on Moon` });
                }
              }}
            />
            {index === currentIndex && (
              <div style={styles.sidebarPos}>
                <SocialSidebar
                  post={post}
                  liked={!!likedPosts[post.id]}
                  onLike={() => handleLike(post.id)}
                  onComment={() => setShowComments(true)}
                  onShare={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.caption, text: `Listen to ${post.caption} on Moon` });
                    }
                  }}
                  onMenu={() => {}}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreatePress={() => {
          if (demoMode || !user) {
            alert('Sign up to create posts!');
            return;
          }
          setShowCreate(true);
        }}
      />

      <LyricsSheet
        visible={showLyrics}
        lyrics={currentPost?.lyrics || []}
        currentTime={audio.currentTime}
        onClose={() => setShowLyrics(false)}
      />

      <CreateModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onKaraoke={() => { setShowCreate(false); alert('Karaoke mode coming soon!'); }}
        onUpload={() => { setShowCreate(false); onNavigate?.('upload'); }}
      />

      <CommentSheet
        visible={showComments}
        postId={currentPost?.id}
        userId={user?.id}
        isDemo={currentPost?.is_demo}
        onClose={() => setShowComments(false)}
      />

      <SearchOverlay
        visible={showSearch}
        posts={posts}
        onClose={() => setShowSearch(false)}
        onSelectPost={(post) => {
          const idx = posts.findIndex(p => p.id === post.id);
          if (idx >= 0) {
            setCurrentIndex(idx);
            if (feedRef.current) {
              feedRef.current.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
            }
          }
          setShowSearch(false);
        }}
      />
    </div>
  );
}

const styles = {
  root: {
    width: '100%', height: '100vh', background: 'var(--bg)',
    position: 'relative', overflow: 'hidden', maxWidth: 480, margin: '0 auto',
  },
  feed: {
    width: '100%', height: '100vh', overflowY: 'auto',
    scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch',
  },
  cardWrapper: {
    width: '100%', height: '100vh', scrollSnapAlign: 'start',
    scrollSnapStop: 'always', position: 'relative',
  },
  sidebarPos: { position: 'absolute', right: 8, top: '38%', zIndex: 10 },
};

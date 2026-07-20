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
import { DEMO_POSTS } from '../lib/demoData';

export default function FeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [isSeeking, setIsSeeking] = useState(false);
  const feedRef = useRef(null);
  const audio = useAudio();

  const posts = activeTab === 'discover'
    ? [...DEMO_POSTS].sort((a, b) => b.like_count - a.like_count)
    : DEMO_POSTS;

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

  // Like
  const handleLike = useCallback((postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const demoComments = [
    { id: 'c1', user: { username: 'musicfan', display_name: 'Music Fan' }, content: 'This is absolutely fire 🔥', created_at: '2026-07-15T10:00:00Z' },
    { id: 'c2', user: { username: 'beatmaker', display_name: 'BeatMaker' }, content: 'Love the vibes! Keep it up 💜', created_at: '2026-07-14T22:00:00Z' },
    { id: 'c3', user: { username: 'producer.x', display_name: 'Producer X' }, content: 'The production on this is insane', created_at: '2026-07-13T16:00:00Z' },
  ];

  return (
    <div style={styles.root}>
      <TopBar
        onProfilePress={() => {}}
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
        onCreatePress={() => setShowCreate(true)}
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
        onUpload={() => { setShowCreate(false); alert('Upload coming soon!'); }}
      />

      <CommentSheet
        visible={showComments}
        comments={demoComments}
        onClose={() => setShowComments(false)}
        onSubmit={(text) => { console.log('Comment:', text); }}
      />

      <SearchOverlay
        visible={showSearch}
        posts={DEMO_POSTS}
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
    width: '100%',
    height: '100vh',
    background: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 480,
    margin: '0 auto',
  },
  feed: {
    width: '100%',
    height: '100vh',
    overflowY: 'auto',
    scrollSnapType: 'y mandatory',
    WebkitOverflowScrolling: 'touch',
  },
  cardWrapper: {
    width: '100%',
    height: '100vh',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    position: 'relative',
  },
  sidebarPos: {
    position: 'absolute',
    right: 8,
    top: '38%',
    zIndex: 10,
  },
};

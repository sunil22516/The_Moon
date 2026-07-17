import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SongCard from '../components/SongCard';
import SocialSidebar from '../components/SocialSidebar';
import BottomTaskbar from '../components/BottomTaskbar';
import ProfileButton from '../components/ProfileButton';
import SearchModal from '../components/SearchModal';
import CreateModal from '../components/CreateModal';
import LyricsSheet from '../components/LyricsSheet';
import audioManager from '../utils/audioManager';
import { DEMO_TRACKS } from '../constants/mockData';
import { COLORS, SPACING } from '../constants/theme';

export default function FeedScreen({ navigation, feedType = 'home' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [activeTab, setActiveTab] = useState(feedType);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [screenDims, setScreenDims] = useState(Dimensions.get('window'));
  const flatListRef = useRef(null);

  // Track dimension changes (important for web resizing)
  useEffect(() => {
    const onChange = ({ window }) => setScreenDims(window);
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove?.();
  }, []);

  const SCREEN_WIDTH = screenDims.width;
  const SCREEN_HEIGHT = screenDims.height;

  // Sort tracks differently based on feed type
  const tracks =
    activeTab === 'global'
      ? [...DEMO_TRACKS].sort((a, b) => b.likeCount - a.likeCount)
      : DEMO_TRACKS;

  const currentTrack = tracks[currentIndex];

  // Set up audio status callback
  useEffect(() => {
    audioManager.onStatusUpdate((status) => {
      setIsPlaying(status.isPlaying);
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis);
    });

    return () => {
      audioManager.onStatusUpdate(null);
    };
  }, []);

  // Load and autoplay when current track changes
  useEffect(() => {
    if (!currentTrack) return;

    const loadAndPlay = async () => {
      await audioManager.load(currentTrack.id, currentTrack.audioUrl);
      await audioManager.play();
    };

    loadAndPlay();
  }, [currentTrack?.id, activeTab]);

  // Handle viewable items change for tracking current index
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex != null) {
        setCurrentIndex(newIndex);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Tap to toggle play/pause
  const handleTapToggle = useCallback(async () => {
    await audioManager.togglePlay();
  }, []);

  // Volume change
  const handleVolumeChange = useCallback(async (vol) => {
    await audioManager.setVolume(vol);
  }, []);

  // Tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
    flatListRef.current?.scrollToOffset?.({ offset: 0, animated: false });
  }, []);

  // Search select
  const handleSearchSelect = useCallback(
    (track) => {
      const idx = tracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        setCurrentIndex(idx);
        flatListRef.current?.scrollToIndex?.({ index: idx, animated: true });
      }
    },
    [tracks]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <SongCard
        track={item}
        isActive={index === currentIndex}
        isPlaying={index === currentIndex && isPlaying}
        positionMillis={index === currentIndex ? positionMillis : 0}
        durationMillis={index === currentIndex ? durationMillis : 0}
        onTapToggle={handleTapToggle}
        onVolumeChange={handleVolumeChange}
        onLyricsOpen={() => setShowLyrics(true)}
        screenWidth={SCREEN_WIDTH}
        screenHeight={SCREEN_HEIGHT}
      />
    ),
    [currentIndex, isPlaying, positionMillis, durationMillis, handleTapToggle, handleVolumeChange, SCREEN_WIDTH, SCREEN_HEIGHT]
  );

  // On web, FlatList pagingEnabled doesn't work well. Use a ScrollView-based approach.
  const isWeb = Platform.OS === 'web';

  const handleWebScroll = useCallback(
    (e) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / SCREEN_HEIGHT);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < tracks.length) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, SCREEN_HEIGHT, tracks.length]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ─── Main Feed ─────────────────────────────────────────── */}
      {isWeb ? (
        <ScrollView
          ref={flatListRef}
          pagingEnabled
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onScroll={handleWebScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {tracks.map((item, index) => (
            <View key={item.id} style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}>
              <SongCard
                track={item}
                isActive={index === currentIndex}
                isPlaying={index === currentIndex && isPlaying}
                positionMillis={index === currentIndex ? positionMillis : 0}
                durationMillis={index === currentIndex ? durationMillis : 0}
                onTapToggle={handleTapToggle}
                onVolumeChange={handleVolumeChange}
                onLyricsOpen={() => setShowLyrics(true)}
                screenWidth={SCREEN_WIDTH}
                screenHeight={SCREEN_HEIGHT}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: SCREEN_HEIGHT,
            offset: SCREEN_HEIGHT * index,
            index,
          })}
        />
      )}

      {/* ─── Top-left: Profile ─────────────────────────────────── */}
      <ProfileButton
        style={styles.profileButton}
        onPress={() => navigation?.navigate?.('Profile')}
      />

      {/* ─── Top-right: Search ─────────────────────────────────── */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowSearch(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* ─── Right: Social sidebar ─────────────────────────────── */}
      {currentTrack && (
        <SocialSidebar
          style={styles.socialSidebar}
          likeCount={currentTrack.likeCount}
          commentCount={currentTrack.commentCount}
          shareCount={currentTrack.shareCount}
          liked={currentTrack.liked}
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
          onMenu={() => {}}
        />
      )}

      {/* ─── Bottom: Taskbar ───────────────────────────────────── */}
      <BottomTaskbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreatePress={() => setShowCreate(true)}
      />

      {/* ─── Modals ────────────────────────────────────────────── */}
      <SearchModal
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectTrack={handleSearchSelect}
      />

      <CreateModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onKaraoke={() => navigation?.navigate?.('Karaoke', { track: currentTrack })}
        onUpload={() => navigation?.navigate?.('Upload')}
      />

      <LyricsSheet
        visible={showLyrics}
        lyrics={currentTrack?.lyrics || []}
        currentTime={positionMillis / 1000}
        onClose={() => setShowLyrics(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileButton: {
    position: 'absolute',
    top: 54,
    left: SPACING.lg,
    zIndex: 10,
  },
  searchButton: {
    position: 'absolute',
    top: 54,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  socialSidebar: {
    position: 'absolute',
    right: SPACING.lg,
    top: '40%',
    zIndex: 10,
  },
});

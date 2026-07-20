import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPostcard from './AnimatedPostcard';
import VolumeBar from './VolumeBar';
import ProgressBar from './ProgressBar';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

export default function SongCard({
  track,
  isActive = false,
  isPlaying = false,
  positionMillis = 0,
  durationMillis = 0,
  onTapToggle,
  onVolumeChange,
  onLyricsOpen,
  screenWidth,
  screenHeight,
}) {
  const SW = screenWidth || Dimensions.get('window').width;
  const SH = screenHeight || Dimensions.get('window').height;
  const innerWidth = SW * 0.88;
  const innerHeight = SH * 0.55;

  return (
    <Pressable
      style={[styles.container, { width: SW, height: SH }]}
      onPress={onTapToggle}
    >
      {/* Inner rounded rectangle — the postcard area */}
      <View style={[styles.postcardWrapper, { width: innerWidth, height: innerHeight }]}>
        <View style={styles.postcardContainer}>
          <AnimatedPostcard
            source={track.postcard}
            isActive={isActive}
            style={styles.postcard}
          />

          {/* Bottom gradient for text readability */}
          <LinearGradient
            colors={GRADIENTS.dark}
            style={styles.gradient}
          />

          {/* Demo badge */}
          {track.isDemo && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>SAMPLE TRACK</Text>
            </View>
          )}

          {/* Pause indicator */}
          {isActive && !isPlaying && (
            <View style={styles.pauseOverlay}>
              <View style={styles.pauseIcon}>
                <Ionicons name="pause" size={44} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Song info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {track.artist}
          <Text style={styles.songGenre}> · {track.genre}</Text>
        </Text>
      </View>

      {/* Progress bar */}
      <ProgressBar
        positionMillis={positionMillis}
        durationMillis={durationMillis}
        style={styles.progressBar}
      />

      {/* Volume bar */}
      <VolumeBar
        volume={0.8}
        onVolumeChange={onVolumeChange}
        style={styles.volumeBar}
      />

      {/* Lyrics tab */}
      <TouchableOpacity
        style={styles.lyricsTab}
        onPress={(e) => {
          e.stopPropagation?.();
          onLyricsOpen?.();
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="musical-notes" size={14} color={COLORS.accent} />
        <Text style={styles.lyricsTabText}>Lyrics</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 90,
    backgroundColor: COLORS.background,
  },
  postcardWrapper: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  postcardContainer: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  postcard: {
    borderRadius: RADIUS.xl,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  demoBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  demoBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  songInfo: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
  },
  songTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  songArtist: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  songGenre: {
    color: COLORS.textTertiary,
  },
  progressBar: {
    marginTop: SPACING.lg,
    width: '100%',
  },
  volumeBar: {
    marginTop: SPACING.sm,
    width: '100%',
  },
  lyricsTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  lyricsTabText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
  },
});

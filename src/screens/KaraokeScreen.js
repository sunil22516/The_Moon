import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function KaraokeScreen({ route, navigation }) {
  const track = route?.params?.track;
  const [currentTime, setCurrentTime] = useState(0);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  // Simulated time progression for karaoke
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mic pulse animation
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const lyrics = track?.lyrics || [];
  const currentLineIndex = lyrics.reduce((acc, line, index) => {
    if (currentTime >= line.time) return index;
    return acc;
  }, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1a0a2e', '#0A0A0A']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Karaoke</Text>
          {track && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {track.title} — {track.artist}
            </Text>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Lyrics display */}
      <ScrollView
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContent}
        showsVerticalScrollIndicator={false}
      >
        {lyrics.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.lyricLine,
              index === currentLineIndex && styles.lyricLineCurrent,
              index === currentLineIndex + 1 && styles.lyricLineNext,
              index < currentLineIndex && styles.lyricLinePast,
            ]}
          >
            {line.text}
          </Text>
        ))}

        {lyrics.length === 0 && (
          <Text style={styles.noLyrics}>
            No lyrics available for this track
          </Text>
        )}
      </ScrollView>

      {/* Mic indicator */}
      <View style={styles.micContainer}>
        <RNAnimated.View
          style={[styles.micPulse, { transform: [{ scale: pulseAnim }] }]}
        />
        <View style={styles.micButton}>
          <Ionicons name="mic" size={32} color={COLORS.accent} />
        </View>
        <Text style={styles.micLabel}>Mic ready</Text>
      </View>

      {/* Demo badge */}
      {track?.isDemo && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>SAMPLE TRACK · Karaoke UI Preview</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    marginTop: 2,
  },
  lyricsContainer: {
    flex: 1,
  },
  lyricsContent: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
    gap: SPACING.xxl,
    alignItems: 'center',
  },
  lyricLine: {
    ...TYPOGRAPHY.h2,
    color: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
    lineHeight: 36,
  },
  lyricLineCurrent: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  lyricLineNext: {
    color: 'rgba(255,255,255,0.4)',
  },
  lyricLinePast: {
    color: 'rgba(255,255,255,0.08)',
  },
  noLyrics: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 80,
  },
  micContainer: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: SPACING.xl,
  },
  micPulse: {
    position: 'absolute',
    top: SPACING.xl,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
  },
  demoBanner: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  demoBannerText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    letterSpacing: 1,
  },
});

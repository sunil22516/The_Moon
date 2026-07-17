import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import GlassView from './GlassView';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.55;

export default function LyricsSheet({ visible, lyrics = [], currentTime = 0, onClose }) {
  const slideAnim = useRef(new RNAnimated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      RNAnimated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Find the current lyric line index
  const currentLineIndex = lyrics.reduce((acc, line, index) => {
    if (currentTime >= line.time) return index;
    return acc;
  }, 0);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <RNAnimated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <GlassView intensity={40} style={styles.blurContainer}>
              {/* Handle bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Lyrics</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={22} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Lyrics */}
              <ScrollView
                style={styles.lyricsContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lyricsContent}
              >
                {lyrics.length > 0 ? (
                  lyrics.map((line, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.lyricLine,
                        index === currentLineIndex && styles.lyricLineActive,
                        index < currentLineIndex && styles.lyricLinePast,
                      ]}
                    >
                      {line.text}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.noLyrics}>No lyrics available</Text>
                )}
              </ScrollView>
            </GlassView>
          </TouchableOpacity>
        </RNAnimated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    height: SHEET_HEIGHT,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lyricsContainer: {
    flex: 1,
  },
  lyricsContent: {
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  lyricLine: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    lineHeight: 24,
  },
  lyricLineActive: {
    color: COLORS.textPrimary,
    ...TYPOGRAPHY.bodyBold,
    fontSize: 17,
  },
  lyricLinePast: {
    color: COLORS.textTertiary,
    opacity: 0.5,
  },
  noLyrics: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 40,
  },
});

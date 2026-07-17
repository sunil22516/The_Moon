import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, TYPOGRAPHY } from '../constants/theme';

export default function ProgressBar({ positionMillis = 0, durationMillis = 1, style }) {
  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.time}>{formatTime(positionMillis)}</Text>
      <View style={styles.barContainer}>
        <View style={styles.barBackground} />
        <LinearGradient
          colors={GRADIENTS.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%` }]}
        />
        <View style={[styles.dot, { left: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
      <Text style={styles.time}>{formatTime(durationMillis)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  time: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textTertiary,
    width: 36,
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  barBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1,
  },
  barFill: {
    position: 'absolute',
    left: 0,
    height: 2,
    borderRadius: 1,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginLeft: -4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});

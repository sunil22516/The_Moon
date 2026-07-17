import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS } from '../constants/theme';

export default function VolumeBar({ volume = 0.8, onVolumeChange, style }) {
  const [currentVolume, setCurrentVolume] = useState(volume);
  const barWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateVolume(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateVolume(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const updateVolume = (x) => {
    if (barWidth.current <= 0) return;
    const vol = Math.max(0, Math.min(1, x / barWidth.current));
    setCurrentVolume(vol);
    if (onVolumeChange) onVolumeChange(vol);
  };

  const getVolumeIcon = () => {
    if (currentVolume === 0) return 'volume-mute';
    if (currentVolume < 0.3) return 'volume-low';
    if (currentVolume < 0.7) return 'volume-medium';
    return 'volume-high';
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={getVolumeIcon()} size={16} color={COLORS.textSecondary} />
      <View
        style={styles.barContainer}
        onLayout={(e) => {
          barWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.barBackground} />
        <LinearGradient
          colors={GRADIENTS.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${currentVolume * 100}%` }]}
        />
        <View
          style={[
            styles.thumb,
            { left: `${currentVolume * 100}%` },
          ]}
        />
      </View>
      <Ionicons name="volume-high" size={16} color={COLORS.textTertiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  barContainer: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
  },
  barBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
  },
  barFill: {
    position: 'absolute',
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    marginLeft: -7,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
});

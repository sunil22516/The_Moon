import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassView from './GlassView';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function BottomTaskbar({ activeTab = 'home', onTabChange, onCreatePress, style }) {
  return (
    <View style={[styles.wrapper, style]}>
      <GlassView intensity={30} style={styles.container} fallbackColor="rgba(10, 10, 10, 0.85)">
        <View style={styles.innerContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => onTabChange?.('home')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={24}
              color={activeTab === 'home' ? COLORS.accent : COLORS.textTertiary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'home' && styles.tabLabelActive,
              ]}
            >
              Home
            </Text>
            {activeTab === 'home' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          {/* Create — center, larger */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreatePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createGradient}
            >
              <Ionicons name="add" size={30} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Global Feed */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => onTabChange?.('global')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'global' ? 'globe' : 'globe-outline'}
              size={24}
              color={activeTab === 'global' ? COLORS.accent : COLORS.textTertiary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'global' && styles.tabLabelActive,
              ]}
            >
              Discover
            </Text>
            {activeTab === 'global' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  container: {
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(10, 10, 10, 0.75)',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  tabLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textTertiary,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: COLORS.accent,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.accent,
    ...SHADOWS.glow,
  },
  createButton: {
    marginTop: -20,
    ...SHADOWS.glow,
  },
  createGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

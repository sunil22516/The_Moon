import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated as RNAnimated,
} from 'react-native';
import GlassView from './GlassView';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function CreateModal({ visible, onClose, onKaraoke, onUpload }) {
  const scaleAnim = useRef(new RNAnimated.Value(0.8)).current;
  const opacityAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      RNAnimated.parallel([
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          damping: 15,
          stiffness: 200,
          useNativeDriver: true,
        }),
        RNAnimated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <RNAnimated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <GlassView intensity={40} style={styles.blurContainer}>
              <Text style={styles.title}>Create</Text>
              <Text style={styles.subtitle}>What would you like to do?</Text>

              {/* Karaoke option */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  onClose();
                  onKaraoke?.();
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name="mic" size={28} color={COLORS.accent} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Sing Along</Text>
                    <Text style={styles.optionDescription}>
                      Karaoke with the current song
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
                </LinearGradient>
              </TouchableOpacity>

              {/* Upload option */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  onClose();
                  onUpload?.();
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(6, 182, 212, 0.15)', 'rgba(139, 92, 246, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name="cloud-upload" size={28} color={COLORS.cyan} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Upload Music</Text>
                    <Text style={styles.optionDescription}>
                      Share your own track
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
                </LinearGradient>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '85%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.card,
  },
  blurContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  optionDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

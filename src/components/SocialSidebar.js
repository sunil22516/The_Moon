import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';
import { formatCount } from '../constants/mockData';

export default function SocialSidebar({
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  liked = false,
  onLike,
  onComment,
  onShare,
  onMenu,
  style,
}) {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(likeCount);
  const likeScale = useSharedValue(1);

  const handleLike = () => {
    // Bounce animation
    likeScale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );

    setIsLiked(!isLiked);
    setCount((c) => (isLiked ? c - 1 : c + 1));
    if (onLike) onLike(!isLiked);
  };

  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const actions = [
    {
      icon: isLiked ? 'heart' : 'heart-outline',
      label: formatCount(count),
      color: isLiked ? COLORS.like : COLORS.textPrimary,
      onPress: handleLike,
      animStyle: likeAnimStyle,
    },
    {
      icon: 'chatbubble-outline',
      label: formatCount(commentCount),
      color: COLORS.textPrimary,
      onPress: onComment,
    },
    {
      icon: 'share-social-outline',
      label: formatCount(shareCount),
      color: COLORS.textPrimary,
      onPress: onShare,
    },
    {
      icon: 'ellipsis-horizontal',
      label: '',
      color: COLORS.textPrimary,
      onPress: onMenu,
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          {action.animStyle ? (
            <Animated.View style={action.animStyle}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </Animated.View>
          ) : (
            <Ionicons name={action.icon} size={28} color={action.color} />
          )}
          {action.label ? (
            <Text style={[styles.label, { color: action.color }]}>
              {action.label}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  button: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textPrimary,
  },
});

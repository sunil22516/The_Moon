import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function AnimatedPostcard({ source, style, isActive = true }) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
      scale.value = withTiming(1, { duration: 300 });
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      return;
    }

    // Subtle breathing scale — iPhone Live Photo bounce feel
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gentle horizontal drift
    translateX.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gentle vertical drift
    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
        withTiming(3, { duration: 3800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <AnimatedImage
      source={source}
      style={[styles.image, style, animatedStyle]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
});

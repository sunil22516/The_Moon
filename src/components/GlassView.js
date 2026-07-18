import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// Web-safe wrapper around BlurView.
// On native: uses expo-blur. On web: uses CSS backdrop-filter.
let BlurViewComponent = View;
try {
  if (Platform.OS !== 'web') {
    BlurViewComponent = require('expo-blur').BlurView;
  }
} catch (e) {
  // fallback to View
}

export default function GlassView({ intensity = 30, children, style, fallbackColor = 'rgba(20, 20, 20, 0.85)' }) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          {
            backgroundColor: fallbackColor,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurViewComponent intensity={intensity} tint="dark" style={[{ backgroundColor: fallbackColor }, style]}>
      {children}
    </BlurViewComponent>
  );
}

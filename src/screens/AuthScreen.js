import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  // Glowing logo animation
  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const handleSubmit = async () => {
    if (!email || !password) return Alert.alert('Enter email and password');
    setLoading(true);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#140a28', '#0A0A0A']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, glowStyle]}>
          <Text style={styles.logoText}>🌙</Text>
          <Text style={styles.brandName}>Moon</Text>
          <Text style={styles.tagline}>Discover music the way you discover videos</Text>
        </Animated.View>

        {/* Auth card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            selectionColor={COLORS.accent}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            selectionColor={COLORS.accent}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={loading ? ['#444', '#333'] : GRADIENTS.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggle}>
              {isSignUp
                ? 'Already have an account? Log in'
                : "New here? Sign up"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 10,
  },
  logoText: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  brandName: {
    ...TYPOGRAPHY.hero,
    color: COLORS.textPrimary,
  },
  tagline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: 220,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  cardTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...TYPOGRAPHY.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonWrapper: {
    marginTop: SPACING.sm,
    ...SHADOWS.glow,
  },
  button: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  toggle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

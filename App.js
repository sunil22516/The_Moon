import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';

import AuthScreen from './src/screens/AuthScreen';
import FeedScreen from './src/screens/FeedScreen';
import UploadScreen from './src/screens/UploadScreen';
import KaraokeScreen from './src/screens/KaraokeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

const darkTheme = {
  dark: true,
  colors: {
    background: '#0A0A0A',
    card: '#0A0A0A',
    text: '#FFFFFF',
    border: '#222222',
    primary: '#8B5CF6',
    notification: '#EC4899',
  },
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => {
      // If Supabase isn't configured, skip auth for demo
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // For demo: skip auth if Supabase isn't configured
  const skipAuth = !session;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" translucent />
      <NavigationContainer theme={darkTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A0A0A' },
            ...(Platform.OS === 'web'
              ? { animationEnabled: false }
              : {
                  gestureEnabled: true,
                  cardStyleInterpolator: ({ current }) => ({
                    cardStyle: { opacity: current.progress },
                  }),
                }),
          }}
        >
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Karaoke" component={KaraokeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

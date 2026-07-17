import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';

import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import TrendingScreen from './screens/TrendingScreen';
import UploadScreen from './screens/UploadScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (!session) return <AuthScreen />;

  return (
    <NavigationContainer theme={{ dark: true, colors: { background: '#000', card: '#000', text: '#fff', border: '#222', primary: '#8b5cf6' } }}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#000', borderTopColor: '#222' },
          tabBarActiveTintColor: '#8b5cf6',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Trending" component={TrendingScreen} />
        <Tab.Screen name="Upload" component={UploadScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

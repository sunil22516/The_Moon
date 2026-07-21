import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import './styles/animations.css';
import { supabase } from './lib/supabase';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import FeedPage from './pages/FeedPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('feed'); // 'feed' | 'upload' | 'profile'
  const [demoMode, setDemoMode] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) fetchProfile(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setDemoMode(false);
    setCurrentView('feed');
  };

  const handleOnboardingComplete = async (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingLogo}>🌙</div>
        <div className="animate-pulse-glow" style={styles.loadingDot} />
      </div>
    );
  }

  // Demo mode — no auth required
  if (demoMode) {
    return (
      <FeedPage
        user={null}
        session={null}
        demoMode={true}
        onNavigate={handleNavigate}
        onLogout={() => setDemoMode(false)}
      />
    );
  }

  // Not logged in
  if (!session) {
    return (
      <AuthPage
        onSkip={() => setDemoMode(true)}
        onAuthSuccess={() => {}}
      />
    );
  }

  // Logged in but onboarding not complete
  if (profile && !profile.onboarding_complete) {
    return (
      <OnboardingPage
        user={session.user}
        profile={profile}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Upload view
  if (currentView === 'upload') {
    return (
      <UploadPage
        user={session.user}
        onBack={() => setCurrentView('feed')}
        onPostCreated={() => setCurrentView('feed')}
      />
    );
  }

  // Profile view
  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={session.user}
        profile={profile}
        onBack={() => setCurrentView('feed')}
        onLogout={handleLogout}
      />
    );
  }

  // Main feed
  return (
    <FeedPage
      user={session.user}
      session={session}
      demoMode={false}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}

const styles = {
  loadingContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    gap: 24,
  },
  loadingLogo: {
    fontSize: 56,
    filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent)',
  },
};

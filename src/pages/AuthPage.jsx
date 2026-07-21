import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPage({ onSkip, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: email.split('@')[0] } },
        });
        if (err) throw err;
        if (data.user && !data.session) {
          setMessage('Check your email for a confirmation link!');
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (err) throw err;
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow} />

      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoEmoji}>🌙</div>
          <h1 style={styles.brandName}>Moon</h1>
          <p style={styles.tagline}>The Instagram of Voice</p>
        </div>

        {/* Auth card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {/* Google OAuth */}
          <button
            type="button"
            style={styles.googleBtn}
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />

            {error && <p style={styles.errorText}>{error}</p>}
            {message && <p style={styles.successText}>{message}</p>}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <button
            type="button"
            style={styles.toggleBtn}
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
          >
            {isSignUp ? 'Already have an account? Log in' : "New here? Sign up"}
          </button>
        </div>

        {/* Demo bypass */}
        <button style={styles.demoBtn} onClick={onSkip}>
          Try Demo →
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%', height: '100vh', background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', maxWidth: 480, margin: '0 auto',
  },
  bgGlow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: { width: '100%', padding: '0 24px', position: 'relative', zIndex: 1 },
  logoSection: { textAlign: 'center', marginBottom: 40 },
  logoEmoji: { fontSize: 56, marginBottom: 8, filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))' },
  brandName: { fontSize: 42, fontWeight: 900, letterSpacing: -1, color: 'var(--text-primary)', margin: 0 },
  tagline: { fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 },
  card: {
    background: 'rgba(255,255,255,0.04)', borderRadius: 24, padding: 24,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  cardTitle: { fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 20, color: 'var(--text-primary)' },
  googleBtn: {
    width: '100%', padding: '12px', borderRadius: 12,
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' },
  dividerLine: { flex: 1, height: 1, background: 'var(--border)' },
  dividerText: { fontSize: 12, color: 'var(--text-tertiary)' },
  input: {
    width: '100%', padding: '14px 16px', background: 'var(--surface)',
    borderRadius: 12, border: '1px solid var(--border)', color: 'var(--text-primary)',
    fontSize: 15, marginBottom: 12, boxSizing: 'border-box',
  },
  errorText: { color: 'var(--red)', fontSize: 13, textAlign: 'center', margin: '0 0 12px' },
  successText: { color: 'var(--green)', fontSize: 13, textAlign: 'center', margin: '0 0 12px' },
  submitBtn: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', border: 'none', boxShadow: '0 0 20px rgba(139,92,246,0.3)',
  },
  toggleBtn: {
    width: '100%', textAlign: 'center', color: 'var(--text-secondary)',
    fontSize: 13, marginTop: 20, cursor: 'pointer', background: 'none', border: 'none',
  },
  demoBtn: {
    display: 'block', width: '100%', textAlign: 'center', color: 'var(--accent)',
    fontSize: 15, fontWeight: 600, marginTop: 24, padding: '12px',
    background: 'rgba(139,92,246,0.08)', borderRadius: 12,
    border: '1px solid rgba(139,92,246,0.2)', cursor: 'pointer',
  },
};

import React, { useState } from 'react';

export default function AuthPage({ onSkip }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // TODO: wire Supabase auth
    setTimeout(() => {
      setLoading(false);
      alert('Auth will be wired to Supabase. Click "Try Demo" to explore the app.');
    }, 800);
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
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2 style={styles.cardTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>

          <button type="button" style={styles.toggleBtn} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Log in' : "New here? Sign up"}
          </button>
        </form>

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
    width: '100%',
    height: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 480,
    margin: '0 auto',
  },
  bgGlow: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    width: '100%',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
    filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))',
  },
  brandName: {
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: -1,
    color: 'var(--text-primary)',
    margin: 0,
  },
  tagline: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    marginTop: 8,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 24,
    color: 'var(--text-primary)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--surface)',
    borderRadius: 12,
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 15,
    marginBottom: 12,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    marginTop: 4,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
  },
  toggleBtn: {
    width: '100%',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: 13,
    marginTop: 20,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  demoBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    color: 'var(--accent)',
    fontSize: 15,
    fontWeight: 600,
    marginTop: 24,
    padding: '12px',
    background: 'rgba(139,92,246,0.08)',
    borderRadius: 12,
    border: '1px solid rgba(139,92,246,0.2)',
    cursor: 'pointer',
  },
};

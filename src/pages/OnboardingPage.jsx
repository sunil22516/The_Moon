import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UnlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const GENRES = ['Desi Hip Hop', 'Lo-fi', 'Indie', 'Boom Bap', 'R&B', 'Electronic', 'Spoken Word', 'Poetry', 'Cover Songs', 'Original Music', 'Rap', 'Chill Trap', 'Storytelling', 'Comedy', 'Podcasts', 'Shayari'];

export default function OnboardingPage({ user, profile, onComplete }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(profile?.username || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [selectedGenres, setSelectedGenres] = useState(profile?.preferences?.genres || []);
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      if (username === profile?.username) {
        setUsernameAvailable(true);
        return;
      }
      
      setCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();
          
        if (data && data.id !== user?.id) {
          setUsernameAvailable(false);
        } else {
          setUsernameAvailable(true);
        }
      } catch (err) {
        // PostgrestError when no rows found usually means available
        setUsernameAvailable(true);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [username, user, profile]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const submitProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      let avatarUrl = profile?.avatar_url;
      
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      const updates = {
        username,
        display_name: displayName,
        preferences: { genres: selectedGenres },
        is_private: isPrivate,
        avatar_url: avatarUrl,
        onboarding_complete: true
      };

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      onComplete(data || updates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else submitProfile();
  };

  const canContinue = () => {
    if (step === 1) return usernameAvailable && username.length >= 3 && displayName.length > 0;
    if (step === 2) return selectedGenres.length >= 3;
    return true;
  };

  return (
    <div className="animate-fadeInUp" style={{
      maxWidth: '480px',
      margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-xl) var(--space-lg)',
      backgroundColor: 'var(--bg)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            padding: 0,
            cursor: 'pointer',
            marginRight: 'var(--space-md)'
          }}>
            <ChevronLeftIcon />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{
                flex: 1,
                height: '4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: s <= step ? 'var(--accent)' : 'var(--surface-elevated)'
              }} />
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Step {step} of 4</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-card)',
        overflowY: 'auto'
      }}>
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 style={{ margin: '0 0 var(--space-lg) 0', fontSize: '1.5rem' }}>Create your profile</h2>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    paddingRight: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                  {checkingUsername ? (
                    <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : usernameAvailable === true ? (
                    <span style={{ color: '#4ade80' }}><CheckIcon /></span>
                  ) : usernameAvailable === false ? (
                    <span style={{ color: '#f87171' }}><XIcon /></span>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 style={{ margin: '0 0 var(--space-xs) 0', fontSize: '1.5rem' }}>What are you into?</h2>
            <p style={{ margin: '0 0 var(--space-lg) 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {selectedGenres.length} selected — pick at least 3
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {GENRES.map(genre => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    style={{
                      padding: 'var(--space-xs) var(--space-md)',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--gradient-accent)' : 'var(--surface)',
                      border: isSelected ? '1px solid transparent' : '1px solid var(--border)',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 style={{ margin: '0 0 var(--space-lg) 0', fontSize: '1.5rem' }}>Privacy matters</h2>
            
            <div
              onClick={() => setIsPrivate(false)}
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: !isPrivate ? 'var(--surface-elevated)' : 'var(--surface)',
                border: `1px solid ${!isPrivate ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: !isPrivate ? 'var(--shadow-glow)' : 'none',
                marginBottom: 'var(--space-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)'
              }}
            >
              <div style={{ color: !isPrivate ? 'var(--accent)' : 'var(--text-secondary)' }}>
                <UnlockIcon />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Public</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Anyone can see your posts and profile</p>
              </div>
            </div>
            
            <div
              onClick={() => setIsPrivate(true)}
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: isPrivate ? 'var(--surface-elevated)' : 'var(--surface)',
                border: `1px solid ${isPrivate ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: isPrivate ? 'var(--shadow-glow)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)'
              }}
            >
              <div style={{ color: isPrivate ? 'var(--accent)' : 'var(--text-secondary)' }}>
                <LockIcon />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Private</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Only approved followers can see your posts</p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fadeIn" style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 var(--space-lg) 0', fontSize: '1.5rem' }}>Add a profile photo</h2>
            
            <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--surface-elevated)',
                border: '2px dashed var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                color: 'var(--text-tertiary)'
              }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon />
                )}
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: 'var(--space-sm) var(--space-lg)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '1rem',
                marginBottom: 'var(--space-md)'
              }}
            >
              Choose Photo
            </button>
            <br />
            {!avatarPreview && (
              <button
                onClick={handleNext}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Skip for now
              </button>
            )}
            
            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: 'var(--space-md)' }}>{error}</p>}
          </div>
        )}
      </div>

      {/* Bottom Action Area */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button
          onClick={handleNext}
          disabled={!canContinue() || loading}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-full)',
            background: (!canContinue() || loading) ? 'var(--surface)' : 'var(--gradient-accent)',
            color: (!canContinue() || loading) ? 'var(--text-tertiary)' : '#fff',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: (!canContinue() || loading) ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Saving...' : step < 4 ? 'Continue' : 'Complete Profile'}
        </button>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

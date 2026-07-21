import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatCount } from '../lib/demoData';

export default function ProfilePage({ user, profile, onBack, onLogout }) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setUserPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [user]);

  const handleSaveBio = async () => {
    if (!user) return;
    setSavingBio(true);
    const { error } = await supabase
      .from('profiles')
      .update({ bio: editBio })
      .eq('id', user.id);
    
    if (!error && profile) {
      profile.bio = editBio;
    }
    setSavingBio(false);
    setEditing(false);
  };

  if (!user || !profile) return null;

  const displayAvatar = profile.avatar_url ? (
    <img 
      src={profile.avatar_url} 
      alt={profile.username} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  ) : (
    <div style={{
      width: '100%', 
      height: '100%', 
      background: 'var(--gradient-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#fff',
      textTransform: 'uppercase'
    }}>
      {profile.username ? profile.username.charAt(0) : '?'}
    </div>
  );

  return (
    <div className="animate-fadeIn" style={{
      maxWidth: '480px',
      margin: '0 auto',
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font)'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md)',
        borderBottom: '1px solid var(--border)'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile</div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: '14px', fontWeight: '600', padding: 0 }}>
          Sign Out
        </button>
      </div>

      {/* Avatar Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-xl) var(--space-md) var(--space-md)' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: 'var(--space-md)',
          border: '2px solid var(--surface-elevated)'
        }}>
          {displayAvatar}
        </div>
        
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
          {profile.display_name || profile.username}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          @{profile.username}
        </div>

        {/* Bio */}
        <div style={{ width: '100%', textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <textarea 
                value={editBio} 
                onChange={e => setEditBio(e.target.value)}
                style={{
                  width: '90%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  fontSize: '13px',
                  resize: 'none',
                  minHeight: '60px',
                  fontFamily: 'inherit'
                }}
                placeholder="Write something about yourself..."
                maxLength={100}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditing(false)} style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={handleSaveBio} disabled={savingBio} style={{
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>{savingBio ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {profile.bio ? (
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-tertiary)', 
                  maxWidth: '80%',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {profile.bio}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No bio yet.</div>
              )}
              <button onClick={() => { setEditing(true); setEditBio(profile.bio || ''); }} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '500',
                marginTop: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>✏️</span> Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Privacy Badge */}
        <div style={{
          background: 'var(--surface-elevated)',
          padding: '4px 12px',
          borderRadius: '100px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: 'var(--space-lg)'
        }}>
          {profile.is_private ? 'Private Account 🔒' : 'Public Account 🌍'}
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          background: 'var(--glass)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md) 0',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{userPosts.length}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Posts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCount(profile.follower_count || 0)}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Followers</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCount(profile.following_count || 0)}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Following</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '0 var(--space-md)' }}></div>

      {/* Posts Grid */}
      <div style={{ padding: 'var(--space-md)', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-xl)' }}>Loading posts...</div>
        ) : userPosts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-sm)'
          }}>
            {userPosts.map(post => (
              <div key={post.id} style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--surface-elevated)'
              }}>
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--gradient-dark)' }}></div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    marginRight: '8px'
                  }}>
                    {post.caption || 'No caption'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#fff' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {formatCount(post.likes_count || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 'var(--space-2xl) 0',
            color: 'var(--text-tertiary)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px' }}>No posts yet</div>
            <div style={{ fontSize: '13px' }}>Upload your first track!</div>
          </div>
        )}
      </div>
    </div>
  );
}

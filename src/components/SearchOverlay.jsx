import React, { useState } from 'react';

export default function SearchOverlay({ visible, posts = [], onClose, onSelectPost }) {
  const [query, setQuery] = useState('');

  if (!visible) return null;

  const filteredPosts = posts.filter(post => {
    const q = query.toLowerCase();
    return (
      post.caption.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.user.display_name.toLowerCase().includes(q) ||
      post.user.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fadeIn" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,5,5,0.97)', zIndex: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginTop: 60, margin: '0 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'var(--surface-elevated)', borderRadius: 16, border: '1px solid var(--border)', padding: '12px 16px', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search songs, artists..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{ flex: 1, fontSize: 16, color: 'var(--text-primary)', background: 'transparent', border: 'none', outline: 'none' }}
        />
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Cancel
        </button>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
        {filteredPosts.map(post => (
          <div 
            key={post.id} 
            onClick={() => { onSelectPost(post); onClose(); }}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 12, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="18" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="16" r="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{post.caption}</h4>
                {post.is_demo && (
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--accent)', backgroundColor: 'rgba(139,92,246,0.2)', padding: '2px 6px', borderRadius: 4 }}>SAMPLE</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>{post.user.display_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

export default function CreateModal({ visible, onClose, onKaraoke, onUpload }) {
  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div 
        className="animate-scaleIn"
        style={{ 
          width: '85%', maxWidth: 380, borderRadius: 24, 
          backgroundColor: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(40px)', 
          border: '1px solid rgba(255,255,255,0.08)', padding: 32,
          boxSizing: 'border-box'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 4px 0' }}>Create</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 24px 0' }}>What would you like to do?</p>
        
        <div 
          onClick={() => { onKaraoke?.(); onClose(); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(255,255,255,0.06)', gap: 12, marginBottom: 12, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Sing Along</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Karaoke with the current song</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          onClick={() => { onUpload?.(); onClose(); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(255,255,255,0.06)', gap: 12, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Upload Music</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Share your own track</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

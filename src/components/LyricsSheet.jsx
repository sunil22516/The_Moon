import React from 'react';

export default function LyricsSheet({ visible, lyrics = [], currentTime, onClose }) {
  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} onClick={onClose}>
      <div 
        className="animate-slideUp"
        style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          maxWidth: 480, margin: '0 auto', height: '55vh', 
          borderRadius: '24px 24px 0 0', backgroundColor: 'rgba(20,20,20,0.95)', 
          backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '8px auto 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Lyrics</h2>
          <div onClick={onClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {lyrics.map((line, idx) => {
            const isCurrent = currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].time);
            const isPast = !isCurrent && currentTime > line.time;
            
            let color = 'var(--text-tertiary)';
            let fontWeight = 400;
            let fontSize = 15;
            
            if (isCurrent) {
              color = 'var(--text-primary)';
              fontWeight = 700;
              fontSize = 17;
            } else if (isPast) {
              color = 'rgba(255,255,255,0.25)';
            }
            
            return (
              <p key={idx} style={{ color, fontWeight, fontSize, marginBottom: 16, transition: 'all 0.3s ease', margin: '0 0 16px 0' }}>
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

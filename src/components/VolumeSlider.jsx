import React, { useRef } from 'react';

const VolumeSlider = ({ volume = 1, onVolumeChange }) => {
  const barRef = useRef(null);

  const handleVolumeChange = (e) => {
    if (!barRef.current || !onVolumeChange) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    onVolumeChange(newVolume);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      </svg>
      
      <div
        ref={barRef}
        onClick={handleVolumeChange}
        style={{
          flex: 1,
          height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '2px',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
            borderRadius: '2px',
            width: `${volume * 100}%`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${volume * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            background: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(139,92,246,0.6)'
          }}
        />
      </div>

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    </div>
  );
};

export default VolumeSlider;

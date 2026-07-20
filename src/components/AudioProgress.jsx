import React, { useRef } from 'react';
import { formatTime } from '../lib/demoData';

const AudioProgress = ({ currentTime = 0, duration = 0, onSeek }) => {
  const barRef = useRef(null);

  const handleSeek = (e) => {
    if (!barRef.current || !onSeek || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percentage * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        ref={barRef}
        onClick={handleSeek}
        style={{
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
            width: `${progressPercent}%`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${progressPercent}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            background: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(139,92,246,0.6)'
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{formatTime(currentTime)}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioProgress;

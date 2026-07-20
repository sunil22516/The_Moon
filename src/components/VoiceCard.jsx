import React from 'react';
import AnimatedCover from './AnimatedCover';
import DemoBadge from './DemoBadge';
import AudioProgress from './AudioProgress';
import VolumeSlider from './VolumeSlider';
import { formatTime } from '../lib/demoData';

export default function VoiceCard({ 
  post, isActive, isPlaying, currentTime, duration, volume, isSeeking, 
  onTap, onVolumeChange, onLyricsOpen, onLike, onComment, onShare 
}) {
  return (
    <div 
      style={{ 
        width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', 
        position: 'relative', paddingBottom: 'calc(var(--nav-height) + 16px)', 
        userSelect: 'none' 
      }}
      onClick={onTap}
    >
      <div 
        style={{ 
          width: '88%', height: '52vh', borderRadius: 24, overflow: 'hidden', 
          position: 'relative', backgroundColor: 'var(--surface)' 
        }}
      >
        <AnimatedCover src={post.cover_url} isActive={isActive} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'var(--gradient-dark)' }} />
        <DemoBadge visible={post.is_demo} />
        
        {isActive && !isPlaying && !isSeeking && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 72, height: 72, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </div>
        )}

        {isSeeking && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)' }}>{formatTime(currentTime)}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>Swipe to seek</span>
          </div>
        )}
      </div>

      <div style={{ width: '100%', padding: '16px 24px 0', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.caption}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          @{post.user.username} · {post.category}
        </p>
      </div>

      <div style={{ width: '100%', marginTop: 16, padding: '0 24px', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        <AudioProgress currentTime={currentTime} duration={duration} />
      </div>

      <div style={{ width: '100%', marginTop: 8, padding: '0 24px', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        <VolumeSlider volume={volume} onVolumeChange={onVolumeChange} />
      </div>

      <div onClick={(e) => { e.stopPropagation(); onLyricsOpen(); }} style={{ cursor: 'pointer', marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, padding: '8px 16px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 999 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6" cy="18" r="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="16" r="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Lyrics</span>
      </div>
    </div>
  );
}

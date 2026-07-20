import React from 'react';
import { formatCount } from '../lib/demoData';

const SocialSidebar = ({ post, liked, onLike, onComment, onShare, onMenu }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Like Button */}
      <div 
        onClick={onLike}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <svg 
          width="28" height="28" viewBox="0 0 24 24" 
          fill={liked ? 'var(--red)' : 'none'} 
          stroke={liked ? 'var(--red)' : 'currentColor'} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={liked ? 'animate-heart-pop' : ''}
          style={{ color: 'var(--text-primary)' }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{formatCount(post?.like_count || 0)}</span>
      </div>

      {/* Comment Button */}
      <div 
        onClick={onComment}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <svg 
          width="28" height="28" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-primary)' }}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{formatCount(post?.comment_count || 0)}</span>
      </div>

      {/* Share Button */}
      <div 
        onClick={onShare}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <svg 
          width="28" height="28" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-primary)' }}
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{formatCount(post?.share_count || 0)}</span>
      </div>

      {/* Menu Button */}
      <div 
        onClick={onMenu}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <svg 
          width="28" height="28" viewBox="0 0 24 24" 
          fill="currentColor"
          style={{ color: 'var(--text-primary)' }}
        >
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </div>
    </div>
  );
};

export default SocialSidebar;

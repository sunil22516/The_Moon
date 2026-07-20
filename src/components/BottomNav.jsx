import React from 'react';

const BottomNav = ({ activeTab = 'home', onTabChange, onCreatePress }) => {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <div style={{ margin: '0 auto', maxWidth: '480px', padding: '0 32px 16px', paddingBottom: 'calc(16px + var(--safe-bottom, 0px))' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '10px 24px',
          borderRadius: '999px',
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Home Tab */}
          <div 
            onClick={() => onTabChange && onTabChange('home')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          >
            <svg 
              width="22" height="22" viewBox="0 0 24 24" 
              fill="none" 
              stroke={activeTab === 'home' ? 'var(--accent)' : 'var(--text-tertiary)'} 
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: '10px', color: activeTab === 'home' ? 'var(--accent)' : 'var(--text-tertiary)' }}>Home</span>
            {activeTab === 'home' && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', marginTop: '2px' }} />
            )}
          </div>

          {/* Create Button */}
          <div 
            onClick={onCreatePress}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              marginTop: '-12px',
              boxShadow: 'var(--shadow-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>

          {/* Discover Tab */}
          <div 
            onClick={() => onTabChange && onTabChange('discover')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          >
            <svg 
              width="22" height="22" viewBox="0 0 24 24" 
              fill="none" 
              stroke={activeTab === 'discover' ? 'var(--accent)' : 'var(--text-tertiary)'} 
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span style={{ fontSize: '10px', color: activeTab === 'discover' ? 'var(--accent)' : 'var(--text-tertiary)' }}>Discover</span>
            {activeTab === 'discover' && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', marginTop: '2px' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

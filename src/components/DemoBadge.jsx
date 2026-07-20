import React from 'react';

const DemoBadge = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'rgba(139,92,246,0.15)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '6px',
        padding: '4px 8px',
      }}
    >
      <span
        style={{
          fontSize: '9px',
          letterSpacing: '1.5px',
          color: 'var(--accent)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}
      >
        SAMPLE TRACK
      </span>
    </div>
  );
};

export default DemoBadge;

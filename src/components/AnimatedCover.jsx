import React from 'react';

const AnimatedCover = ({ src, isActive }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '24px'
      }}
    >
      <img
        src={src}
        alt="Cover"
        className={isActive ? 'animate-breathe' : ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '24px'
        }}
      />
    </div>
  );
};

export default AnimatedCover;

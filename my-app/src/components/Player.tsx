// Player.tsx
import React from 'react';

const Player = ({ position }) => {
  const playerStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: 'blue',
    position: 'absolute',
    left: position.x,
    top: position.y,
  };

  return <div style={playerStyle}></div>;
};

export default Player;

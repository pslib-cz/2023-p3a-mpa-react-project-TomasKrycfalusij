import React, { useState, useEffect } from 'react';

interface MissileProps {
  id: number;
  position: { x: number; y: number };
}

const Missile: React.FC<MissileProps> = ({ id, position }) => {

  return <div style={{ position: 'absolute', left: position.x, top: position.y, width: 5, height: 5, backgroundColor: 'yellow' }} />;
};

export default Missile;

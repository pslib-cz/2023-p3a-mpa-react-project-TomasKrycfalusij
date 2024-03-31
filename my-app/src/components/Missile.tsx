import React, { useState, useEffect } from 'react';
import MissileStyle from "./MissileStyle.module.css";

interface MissileProps {
  id: number;
  type: number;
  position: { x: number; y: number };
  rotation: number;
}

const Missile: React.FC<MissileProps> = ({ id, type, position, rotation }) => {
  const missilePositionerClassName = MissileStyle[`missile${type}Positioner`];
  const missileAnimationClassName = MissileStyle[`missile${type}Animation`];

  return (
    <div className={missilePositionerClassName} style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
      <div className={MissileStyle.missileContainer}>
        <div className={`${MissileStyle.missile} ${missileAnimationClassName}`} />
      </div>
    </div>
  );
};

export default Missile;

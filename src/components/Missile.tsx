import React from 'react';
import MissileStyle from "./MissileStyle.module.css";

interface MissileProps {
  type: number;
  position: { x: number; y: number };
  rotation: number;
}

const Missile: React.FC<MissileProps> = ({ type, position, rotation }) => {
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

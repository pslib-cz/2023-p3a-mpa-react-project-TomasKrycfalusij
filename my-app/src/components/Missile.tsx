import React, { useState, useEffect } from 'react';
import MissileStyle from "./MissileStyle.module.css";

interface MissileProps {
  id: number;
  position: { x: number; y: number };
  rotation: number;
}

const Missile: React.FC<MissileProps> = ({ id, position, rotation }) => {

  return (
    <div className={MissileStyle.missilePositioner}
    style={{
      
      left: position.x,
      top: position.y,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`
    }}>
      <div className={MissileStyle.missileContaienr}>
        <div className={`${MissileStyle.missile} ${MissileStyle.missileAnimation}`}/>
      </div>
    </div>
  );
};

export default Missile;

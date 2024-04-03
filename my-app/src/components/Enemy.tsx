import React, { useEffect, useRef } from 'react';
import enemyStyle from './EnemyStyle.module.css';
import { MissileType } from '../types/MissileTypes';
import { spawnMissile } from '../Game';

interface EnemyProps {
  id: string;
  position: { x: number; y: number };
  rotation: number;
  maxHealth: number;
  health: number;
  setMissiles: React.Dispatch<React.SetStateAction<MissileType[]>>;
  missileFrequency: number;
  texture: string;
  uuidv4: () => string;
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  position,
  rotation,
  maxHealth,
  health,
  setMissiles,
  missileFrequency,
  texture,
  uuidv4
}) => {
  const latestPosition = useRef(position);
  const latestRotation = useRef(rotation);

  useEffect(() => {
    latestPosition.current = position;
    latestRotation.current = rotation;
  }, [position, rotation]);

  const spawnEnemyMissile = () => {
    const rotationRadians = (latestRotation.current * Math.PI) / 180;
    
    const correctedRotationRadians = rotationRadians - (Math.PI / 2);
    
    const offsetX = Math.cos(correctedRotationRadians) * 50 / 2;
    const offsetY = Math.sin(correctedRotationRadians) * 50 / 2;
    
    const spawnX = latestPosition.current.x + offsetX;
    const spawnY = latestPosition.current.y + offsetY;
    
    const directionX = Math.cos(correctedRotationRadians);
    const directionY = Math.sin(correctedRotationRadians);
    
    spawnMissile(
      directionX,
      directionY,
      { x: spawnX, y: spawnY },
      latestRotation.current,
      1,
      true,
      setMissiles,
      uuidv4
    );
  };
  

  // Use a useEffect to trigger the spawnEnemyMissile function at a specific frequency
  useEffect(() => {
    const enemyMissileInterval = setInterval(spawnEnemyMissile, missileFrequency); // Adjust the interval as needed
    return () => clearInterval(enemyMissileInterval);
  }, []);

  return (
    <div key={id} className={enemyStyle.enemyPositioner} style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
      <div className={enemyStyle.enemyContainer}>
        <div className={enemyStyle.enemy} style={{backgroundImage: `url("${texture}")`}}></div>
        <div className={enemyStyle.enemyHealthbar} style={{width: `${health / maxHealth * 100}%`}}></div>
      </div>
    </div>
  );
};

export default Enemy;

import React, { useEffect, useRef, useState } from 'react';
import enemyStyle from './EnemyStyle.module.css';
import { MissileType } from '../types/MissileTypes';
import { spawnMissile } from '../pages/Game';
import { EnemyType, enemiesSelector } from '../types/EnemyTypes';

interface EnemyProps {
  id: string;
  scale: number;
  position: { x: number; y: number };
  type: number;
  rotation: number;
  maxHealth: number;
  health: number;
  setMissiles: React.Dispatch<React.SetStateAction<MissileType[]>>;
  missileFrequency: number;
  texture: string;
  gamePaused: boolean;
  uuidv4: () => string;
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  scale,
  position,
  type,
  rotation,
  maxHealth,
  health,
  setMissiles,
  missileFrequency,
  texture,
  gamePaused,
  uuidv4
}) => {
  const [chosenEnemy, setChosenEnemy] = useState<EnemyType | undefined>(enemiesSelector.find(enemy => enemy.type === type));
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
  
    if (chosenEnemy?.type === 4) {
      for (let i = -1; i < 2; i++) {
        const adjustedRotation = latestRotation.current + (i * 15);
        // Calculate direction components based on the adjusted rotation
        const newRotationRadians = (adjustedRotation * Math.PI) / 180;
        const newCorrectedRotationRadians = newRotationRadians - (Math.PI / 2);
        const newDirectionX = Math.cos(newCorrectedRotationRadians);
        const newDirectionY = Math.sin(newCorrectedRotationRadians);
  
        spawnMissile(
          newDirectionX,
          newDirectionY, // Corrected here
          { x: spawnX, y: spawnY },
          adjustedRotation,
          Number(chosenEnemy?.missileType),
          true,
          setMissiles,
          gamePaused,
          scale,
          uuidv4
        );
      }
    }
    else {
      spawnMissile(
        directionX,
        directionY,
        { x: spawnX, y: spawnY },
        latestRotation.current,
        Number(chosenEnemy?.missileType),
        true,
        setMissiles,
        gamePaused,
        scale,
        uuidv4
      );
    }
  };
  

  // Use a useEffect to trigger the spawnEnemyMissile function at a specific frequency
  useEffect(() => {
    if (!gamePaused && type !== 2) {
      const enemyMissileInterval = setInterval(spawnEnemyMissile, Number(chosenEnemy?.missileFrequency)); // Adjust the interval as needed
      return () => clearInterval(enemyMissileInterval);
    }
  }, [gamePaused]);

  return (
    <div key={id} className={enemyStyle.enemyPositioner} style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) rotate(${rotation}deg)`, width: Number(chosenEnemy?.width) * scale, height: Number(chosenEnemy?.height) * scale }}>
      <div className={enemyStyle.enemyContainer}>
        <div className={enemyStyle.enemy} style={{backgroundImage: `url("${texture}")`}}></div>
        <div className={enemyStyle.enemyHealthbar} style={{width: `${health / maxHealth * 100}%`}}></div>
      </div>
    </div>
  );
};

export default Enemy;

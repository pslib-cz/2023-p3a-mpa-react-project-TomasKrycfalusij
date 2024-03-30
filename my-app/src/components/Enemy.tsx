import React from 'react';
import enemyStyle from './EnemyStyle.module.css';

interface EnemyProps {
  id: string;
  position: { x: number; y: number };
  rotation: number;
  maxHealth: number;
  health: number;
}

const Enemy: React.FC<EnemyProps> = ({ id, position, rotation, maxHealth, health }) => {
  return (
    <div key={id} className={enemyStyle.enemyPositioner} style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
      <div className={enemyStyle.enemyContainer}>
        <div className={enemyStyle.enemy}></div>
        <div className={enemyStyle.enemyHealthbar} style={{width: `${health / maxHealth * 100}%`}}></div>
      </div>
    </div>
  );
};

export default Enemy;

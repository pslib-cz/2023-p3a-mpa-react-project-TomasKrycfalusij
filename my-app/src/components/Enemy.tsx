import React from 'react';
import enemyStyle from './EnemyStyle.module.css';

interface EnemyProps {
  id: string;
  position: { x: number; y: number };
  rotation: number;
}

const Enemy: React.FC<EnemyProps> = ({ id, position, rotation }) => {
  return (
    <div key={id} className={enemyStyle.enemy} style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
    </div>
  );
};

export default Enemy;

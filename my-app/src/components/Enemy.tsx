// Enemy.tsx
import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';

const Enemy: React.FC = () => {
  const enemyRef = useRef<Matter.Body>();

  // Create Matter.js body for enemy
  useEffect(() => {
    const engine = Matter.Engine.create(); // Create a local instance of the engine
    const enemyBody = Matter.Bodies.circle(200, 200, 30);
    enemyRef.current = enemyBody;
    Matter.World.add(engine.world, enemyBody);

    return () => {
      Matter.World.remove(engine.world, enemyBody);
      Matter.Engine.clear(engine); // Don't forget to clear the engine when unmounting
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: enemyRef.current ? enemyRef.current.position.x - 30 : 0,
        top: enemyRef.current ? enemyRef.current.position.y - 30 : 0,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'red', // Set the color of the enemy to red
      }}
    />
  );
};

export default Enemy;

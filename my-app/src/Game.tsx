import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import gameStyle from './GameStyle.module.css';
import Missile from './components/Missile';
import { v4 as uuidv4 } from 'uuid';

interface Coordinates {
  x: number;
  y: number;
}

interface MissileType {
    id: number;
    position: Coordinates;
    velocityX: number;
    velocityY: number;
    remove: boolean;
  }
  

const Game: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState<Coordinates>({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState<Coordinates>({ x: 0, y: 0 });
    const [playerRotation, setPlayerRotation] = useState<number>(0);
    const [missiles, setMissiles] = useState<MissileType[]>([]);
    const [missileSpeed, setMissileSpeed] = useState<number>(3);
    const [velocity, setVelocity] = useState<Coordinates>({ x: 0, y: 0 });
    const [acceleration, setAcceleration] = useState<Coordinates>({ x: 0, y: 0 });
    const [maxSpeed, setMaxSpeed] = useState<number>(2);
    const [accelerationRate, setAccelerationRate] = useState<number>(0.02);
    const [friction, setFriction] = useState<number>(0.02);
    const [playerWidth, setPlayerWidth] = useState<number>(60);
    const [playerHeight, setPlayerHeight] = useState<number>(60);
    const [bgX, setBgX] = useState<number>(0);
    const [bgY, setBgY] = useState<number>(0);
    const updateRate: number = 1000 / 200;


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: -accelerationRate }));
          break;
        case 'ArrowDown':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: accelerationRate }));
          break;
        case 'ArrowLeft':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: -accelerationRate }));
          break;
        case 'ArrowRight':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: accelerationRate }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: 0 }));
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: 0 }));
          break;
        default:
          break;
      }
    };


    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [accelerationRate]);

  // ----- SPAWNING MISSILES ----- //

  useEffect(() => {
    const updatePosition = () => {
        const updatedVelocity = {
          x: Math.min(maxSpeed, Math.max(-maxSpeed, velocity.x + acceleration.x)),
          y: Math.min(maxSpeed, Math.max(-maxSpeed, velocity.y + acceleration.y)),
        };
      
        setVelocity(updatedVelocity);
      
        const updatedPlayerPosition = {
          x: Math.min(window.innerWidth - playerWidth, Math.max(0, playerPosition.x + updatedVelocity.x)),
          y: Math.min(window.innerHeight - playerHeight, Math.max(0, playerPosition.y + updatedVelocity.y)),
        };
      
        const hitsBorder =
          updatedPlayerPosition.x === 0 ||
          updatedPlayerPosition.x === window.innerWidth - playerWidth ||
          updatedPlayerPosition.y === 0 ||
          updatedPlayerPosition.y === window.innerHeight - playerHeight;
      
        if (hitsBorder) {
          setAcceleration({ x: 0, y: 0 });
          setVelocity({ x: 0, y: 0 });
        } else {
          setPlayerPosition(updatedPlayerPosition);
        }
      };
      

    const applyFriction = () => {
      if (acceleration.x === 0) {
        setVelocity((prevVelocity) => ({
          x: Math.abs(prevVelocity.x) < 0.1 ? 0 : prevVelocity.x * (1 - friction),
          y: prevVelocity.y,
        }));
      }

      if (acceleration.y === 0) {
        setVelocity((prevVelocity) => ({
          x: prevVelocity.x,
          y: Math.abs(prevVelocity.y) < 0.1 ? 0 : prevVelocity.y * (1 - friction),
        }));
      }
    };

    const updateMissilePositions = () => {
        setMissiles((prevMissiles) =>
          prevMissiles.map((missile) => {
            const withinBoundaries =
              missile.position.x >= 0 &&
              missile.position.x <= window.innerWidth &&
              missile.position.y >= 0 &&
              missile.position.y <= window.innerHeight;
  
            const newPosition = {
              x: missile.position.x + missile.velocityX,
              y: missile.position.y + missile.velocityY,
            };
  
            return {
              ...missile,
              position: newPosition,
              remove: !withinBoundaries,
            };
          }).filter((missile) => !missile.remove)
        );
      };
    
      const mouseClick = (e: MouseEvent) => {
        const dx = e.clientX - (playerPosition.x + playerWidth / 2);
        const dy = e.clientY - (playerPosition.y + playerHeight / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
      
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
      
        const spawnX = playerPosition.x + playerWidth / 2 + normalizedDx * (playerWidth / 2);
        const spawnY = playerPosition.y + playerHeight / 2 + normalizedDy * (playerHeight / 2);
      
        const newMissile: MissileType = {
          id: missiles.length + 1,
          position: { x: spawnX, y: spawnY },
          velocityX: normalizedDx * missileSpeed,
          velocityY: normalizedDy * missileSpeed,
          remove: false,
        };
      
        setMissiles((prevMissiles) => [...prevMissiles, newMissile]);
      };
      

    const updateLoop = setInterval(() => {
      updatePosition();
      applyFriction();
      updateMissilePositions();
    }, updateRate);

    document.addEventListener('click', mouseClick);

    return () => {
      clearInterval(updateLoop);
      document.removeEventListener('click', mouseClick);
    };
  }, [acceleration, friction, maxSpeed, playerPosition, velocity, playerWidth, playerHeight]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const playerCenterX = playerPosition.x + playerWidth / 2;
    const playerCenterY = playerPosition.y + playerHeight / 2;
    const dx = mousePosition.x - playerCenterX;
    const dy = mousePosition.y - playerCenterY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    setPlayerRotation(angle);
  }, [mousePosition, playerPosition, playerWidth, playerHeight]);

  useEffect(() => {
    const newBgX = -playerPosition.x * 0.2;
    const newBgY = -playerPosition.y * 0.2;
    setBgX(newBgX);
    setBgY(newBgY);
  }, [playerPosition]);

  return (
    <div className={gameStyle.gameBackground} style={{ backgroundPosition: `${bgX}px ${bgY}px` }}>
      <Player position={playerPosition} width={playerWidth} height={playerWidth} rotation={playerRotation} />
      {missiles.map((missile) => (
        <Missile key={uuidv4()} id={missile.id} position={missile.position}/>
      ))}
    </div>
  );
};

export default Game;

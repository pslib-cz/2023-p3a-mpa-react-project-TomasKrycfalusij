import React, { useState, useEffect, useContext } from 'react';
import Player from './components/Player';
import gameStyle from './GameStyle.module.css';
import Missile from './components/Missile';
import { v4 as uuidv4 } from 'uuid';
import { Context } from './components/ContextProvider'; // Assuming your context file is named Context.js or Context.tsx
import { ActionType } from './components/Reducer'; // Assuming you exported ActionType enum from your reducer file
import Enemy from './components/Enemy';

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
    rotation: number;
    collisions: number;
    key: string;
  }

interface EnemyType {
  id: string;
  type: number;
  position: Coordinates;
  velocityX: number;
  velocityY: number;
  rotation: number;
  maxHealth: number;
  health: number;
}

const Game: React.FC = () => {
  const { playerStats, dispatch } = useContext(Context);
  // ----- PLAYER ----- //
  const [playerPosition, setPlayerPosition] = useState<Coordinates>({ x: 100, y: 100 });
  const [mousePosition, setMousePosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [playerRotation, setPlayerRotation] = useState<number>(0);
  const [velocity, setVelocity] = useState<Coordinates>({ x: 0, y: 0 });
  const [maxSpeed, setMaxSpeed] = useState<number>(2);
  const [accelerationRate, setAccelerationRate] = useState<number>(0.02);
  const [friction, setFriction] = useState<number>(0.02);
  const [playerWidth, setPlayerWidth] = useState<number>(60);
  const [playerHeight, setPlayerHeight] = useState<number>(60);
  const [acceleration, setAcceleration] = useState<Coordinates>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);


  // ----- MISSILES ----- //
  const [missiles, setMissiles] = useState<MissileType[]>([]);
  const [missileSpeed, setMissileSpeed] = useState<number>(3);
  
  // ----- BACKGROUND ----- //
  const [bgX, setBgX] = useState<number>(0);
  const [bgY, setBgY] = useState<number>(0);
  
  const updateRate: number = 1000 / 200;

  // ----- ENEMIES ----- //
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [enemySpeed, setEnemySpeed] = useState<number>(0.5);
  const enemySpawnInterval = 3000;
  const [enemiesKilled, setEnemiesKilled] = useState(new Map());

  // ----- OTHER ----- //
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;


  // ----- HANDLING KEYBOARD ACTIONS ----- //
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        setIsMoving(true);
      }
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
      if (e.key.startsWith('Arrow')) {
        setIsMoving(false);
      }
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
  // ----- HANDLING KEYBOARD ACTIONS ----- //



  // ----- A L L   T H E   B I G   L O G I C ----- //
  useEffect(() => {
    // ----- CHANGING PLAYER POSITION ----- //
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
    // ----- CHANGING PLAYER POSITION ----- //



    // ----- PLAYER SLOW DOWN MOVEMENT ----- //
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
    // ----- PLAYER SLOW DOWN MOVEMENT ----- //



    // ----- MISSILE POSITION UPDATE ----- //
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
    // ----- MISSILE POSITION UPDATE ----- //
    


    // ----- SPAWNING MISSILES ----- //
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
          rotation: playerRotation,
          collisions: 1,
          key: uuidv4()
      };
  
      setMissiles((prevMissiles) => [...prevMissiles, newMissile]);
    };
    // ----- SPAWNING MISSILES ----- //



// ----- MOVING ENEMIES ----- //
const moveEnemies = () => {
  setEnemies((prevEnemies) =>
    prevEnemies.map((enemy) => {
      const playerCenterX = playerPosition.x + playerWidth / 2;
      const playerCenterY = playerPosition.y + playerHeight / 2;
      const dx = playerCenterX - enemy.position.x;
      const dy = playerCenterY - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let velocityX, velocityY;

      if (enemy.type === 1) {
        if (distance > screenWidth * 0.3) {
          velocityX = (dx / distance) * enemySpeed;
          velocityY = (dy / distance) * enemySpeed;
        } else if (distance > screenWidth * 0.2) {
          const slowdownFactor = ((distance - screenWidth * 0.2) / (screenWidth * 0.1)) + 0.3;
          velocityX = (dx / distance) * enemySpeed * slowdownFactor;
          velocityY = (dy / distance) * enemySpeed * slowdownFactor;
        } else {
          const radius = screenWidth * 0.1;
          const angle = Math.atan2(dy, dx);
          const circularVelocity = enemySpeed * 0.5;
          velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
          velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
        }
      } else {
        velocityX = 0;
        velocityY = 0;
      }

      const rotation = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;

      return {
        ...enemy,
        position: {
          x: enemy.position.x + velocityX,
          y: enemy.position.y + velocityY,
        },
        velocityX,
        velocityY,
        rotation,
      };
    })
  );
};
// ----- MOVING ENEMIES ----- //




// ----- CHECKING COLLISIONS ----- //
const checkMissileEnemyCollisions = () => {
  setEnemies((prevEnemies) =>
    prevEnemies.map((enemy) => {
      let updatedEnemy = { ...enemy };
      let collisionDetected = false;
      missiles.forEach((missile, index) => {
        if (!collisionDetected && missile.collisions > 0) {
          const dx = enemy.position.x - missile.position.x;
          const dy = enemy.position.y - missile.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const collision = distance < 25;
          if (collision) {
            collisionDetected = true;
            const updatedMissile = { ...missile, collisions: missile.collisions - 1 };
            setMissiles((prevMissiles) => {
              const updatedMissiles = [...prevMissiles];
              updatedMissiles[index] = updatedMissile;
              return updatedMissiles.filter((_, idx) => idx !== index);
            });
            if (updatedEnemy.health > 0) {
              updatedEnemy.health -= 1;

              if (updatedEnemy.health <= 0 && !enemiesKilled.get(updatedEnemy.id)) {
                setEnemiesKilled((prevMap) => new Map(prevMap.set(updatedEnemy.id, true)));
                dispatch({ type: ActionType.UPDATE_MONEY, payload: 10 });
              }
            }
          }
        }
      });
      return updatedEnemy;
    }).filter((enemy) => enemy.health > 0)
  );
};
// ----- CHECKING COLLISIONS ----- //


    

    const updateLoop = setInterval(() => {
      updatePosition();
      applyFriction();
      updateMissilePositions();
      moveEnemies();
      checkMissileEnemyCollisions();
    }, updateRate);

    document.addEventListener('click', mouseClick);

    return () => {
      clearInterval(updateLoop);
      document.removeEventListener('click', mouseClick);
    };
  }, [acceleration, friction, maxSpeed, playerPosition, velocity, playerWidth, playerHeight]);
  // -----   A L L   T H E   B I G   L O G I C   ----- //


  // ----- ROTATING PLAYER ----- //
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
  // ----- ROTATING PLAYER ----- //


  
  // ----- BACKGROUND ----- //
  useEffect(() => {
    const newBgX = -playerPosition.x * 0.2;
    const newBgY = -playerPosition.y * 0.2;
    setBgX(newBgX);
    setBgY(newBgY);
  }, [playerPosition]);
  // ----- BACKGROUND ----- //



  // ----- SPAWNING ENEMIES ----- //
  useEffect(() => {
    const spawnEnemy = () => {
      const randomX = Math.random() < 0.5 ? -50 : window.innerWidth + 50;
      const randomY = Math.random() * window.innerHeight;

      const newEnemy: EnemyType = {
        id: uuidv4(),
        type: 1,
        position: { x: randomX, y: randomY },
        velocityX: 0,
        velocityY: 0,
        rotation: 0,
        maxHealth: 5,
        health: 5
      };

      setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
    };

    const enemySpawnTimer = setInterval(spawnEnemy, enemySpawnInterval);

    return () => clearInterval(enemySpawnTimer);
  }, [enemySpawnInterval]);
  // ----- SPAWNING ENEMIES ----- //


  return (
  <div className={gameStyle.gameBackground} style={{ backgroundPosition: `${bgX}px ${bgY}px` }}>
      <div className={gameStyle.stats}>
        <p className={gameStyle.statsValue}>Money: {playerStats.money}</p>
        <p className={gameStyle.statsValue}>Level: {playerStats.level}</p>
      </div>
      <button onClick={() => dispatch({ type: ActionType.UPDATE_MONEY, payload: 10 })}>Add Money</button>
      <Player position={playerPosition} width={playerWidth} height={playerWidth} rotation={playerRotation} moving={isMoving} />
      {missiles.map((missile) => (
          <Missile key={missile.key} id={missile.id} position={missile.position} rotation={missile.rotation}/>
      ))}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} id={enemy.id} position={enemy.position} rotation={enemy.rotation} maxHealth={enemy.maxHealth} health={enemy.health} />
      ))}
  </div>
  );
};

export default Game;

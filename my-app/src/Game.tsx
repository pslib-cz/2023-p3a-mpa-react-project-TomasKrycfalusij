import React, { useState, useEffect, useContext } from 'react';
import Player from './components/Player';
import gameStyle from './GameStyle.module.css';
import Missile from './components/Missile';
import { v4 as uuidv4 } from 'uuid';
import { Context } from './components/ContextProvider'; // Assuming your context file is named Context.js or Context.tsx
import { ActionType } from './types/ReducerTypes'; // Assuming you exported ActionType enum from your reducer file
import Enemy from './components/Enemy';

import { EnemyType, enemiesSelector } from './types/EnemyTypes';
import { Coordinates } from './types/BasicTypes';
import { MissileType, missilesSelector } from './types/MissileTypes';



export const spawnMissile = (
  normalizedDx: number,
  normalizedDy: number,
  objectPosition: Coordinates,
  objectRotation: number,
  missileType: number,
  fromEnemy: boolean,
  setMissiles: React.Dispatch<React.SetStateAction<MissileType[]>>,
  uuidv4: () => string
) => {
  const selectedMissile = missilesSelector.find(missile => missile.type === missileType) || missilesSelector[0];

  const newMissile: MissileType = {
    ...selectedMissile,
    id: 1,
    isEnemy: fromEnemy,
    position: { x: objectPosition.x, y: objectPosition.y },
    velocityX: normalizedDx * selectedMissile.speed,
    velocityY: normalizedDy * selectedMissile.speed,
    rotation: objectRotation,
    key: uuidv4()
  };

  setMissiles(prevMissiles => [...prevMissiles, newMissile]);
};





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
  // const [player, setPlayer] = useState<playrType[]>([{type: play}])

  // ----- MISSILES ----- //
  const [missiles, setMissiles] = useState<MissileType[]>([])
  
  // ----- BACKGROUND ----- //
  const [bgX, setBgX] = useState<number>(0);
  const [bgY, setBgY] = useState<number>(0);
  
  const updateRate: number = 1000 / 200;

  // ----- ENEMIES ----- //
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
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
    


    // ----- SPAWNING PLAYER MISSILES ----- //
    const mouseClick = (e: MouseEvent) => {
      const dx = e.clientX - (playerPosition.x + playerWidth / 2);
      const dy = e.clientY - (playerPosition.y + playerHeight / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
    
      spawnMissile(
        normalizedDx,
        normalizedDy,
        {x: playerPosition.x + playerWidth / 2, y: playerPosition.y + playerHeight / 2},
        playerRotation,
        2, // Example missile type, replace with desired value
        false,
        setMissiles,
        uuidv4
      );
    };

    // ----- SPAWNING PLAYER MISSILES ----- //



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
              velocityX = (dx / distance) * enemy.speed;
              velocityY = (dy / distance) * enemy.speed;
            } else if (distance > screenWidth * 0.2) {
              const slowdownFactor = ((distance - screenWidth * 0.2) / (screenWidth * 0.1)) + 0.3;
              velocityX = (dx / distance) * enemy.speed * slowdownFactor;
              velocityY = (dy / distance) * enemy.speed * slowdownFactor;
            } else {
              const radius = screenWidth * 0.1;
              const angle = Math.atan2(dy, dx);
              const circularVelocity = enemy.speed * 0.5;
              velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
              velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
            }
          }
          else if (enemy.type === 2) {
            velocityX = (dx / distance) * enemy.speed;
            velocityY = (dy / distance) * enemy.speed;
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
    const checkMissileCollisions = () => {
      setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        let updatedEnemy = { ...enemy };
        let collisionDetected = false;
        missiles.forEach((missile, index) => {
          if (!collisionDetected && missile.collisions > 0) {
            const dxEnemy = enemy.position.x - missile.position.x;
            const dyEnemy = enemy.position.y - missile.position.y;
            const distanceEnemy = Math.sqrt(dxEnemy * dxEnemy + dyEnemy * dyEnemy);
            const collisionEnemy = distanceEnemy < 25;

            if (collisionEnemy && !missile.isEnemy) {
              collisionDetected = true;
              const updatedMissile = { ...missile, collisions: missile.collisions - 1 };
              setMissiles((prevMissiles) => {
                const updatedMissiles = [...prevMissiles];
                updatedMissiles[index] = updatedMissile;
                return updatedMissiles.filter((_, idx) => idx !== index);
              });
              if (updatedEnemy.health > 0) {
                // Calculate damage based on missile's properties and enemy's speed
                updatedEnemy.health -= missile.damage;

                if (updatedEnemy.health <= 0 && !enemiesKilled.get(updatedEnemy.id)) {
                  setEnemiesKilled((prevMap) => new Map(prevMap.set(updatedEnemy.id, true)));
                  dispatch({ type: ActionType.UPDATE_MONEY, payload: enemy.reward });
                }
              }
            }
          }
        });
        return updatedEnemy;
      }).filter((enemy) => enemy.health > 0)
      );
      missiles.map((missile, index) => {
        const dxPlayer = playerPosition.x - missile.position.x + (playerWidth / 2);
        const dyPlayer = playerPosition.y - missile.position.y + (playerHeight / 2);
        const distancePlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
        const collisionPlayer = distancePlayer < (playerWidth / 2);

        if (collisionPlayer && missile.isEnemy) {
          dispatch({ type: ActionType.UPDATE_PLAYER_HEALTH, payload: missile.damage });
          const updatedMissile = { ...missile, collisions: missile.collisions - 1 };
          setMissiles((prevMissiles) => {
            const updatedMissiles = [...prevMissiles];
            updatedMissiles[index] = updatedMissile;
            return updatedMissiles.filter((_, idx) => idx !== index);
          });
        }
      })
    };
    // ----- CHECKING COLLISIONS ----- //

    

    const updateLoop = setInterval(() => {
      updatePosition();
      applyFriction();
      updateMissilePositions();
      moveEnemies();
      checkMissileCollisions();
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
        ...enemiesSelector[1],
        id: uuidv4(),
        position: { x: randomX, y: randomY }, // Update position with random values
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
        <p className={gameStyle.statsValue}>Health: {playerStats.health}</p>
      </div>
      <button onClick={() => dispatch({ type: ActionType.UPDATE_MONEY, payload: 10 })}>Add Money</button>
      {missiles.map((missile) => (
          <Missile key={missile.key} id={missile.id} type={missile.type} position={missile.position} rotation={missile.rotation}/>
      ))}
      <Player position={playerPosition} width={playerWidth} height={playerWidth} rotation={playerRotation} moving={isMoving} />
    {enemies.map((enemy) => (
      <Enemy
        key={enemy.id}
        id={enemy.id}
        position={enemy.position}
        rotation={enemy.rotation}
        maxHealth={enemy.maxHealth}
        health={enemy.health}
        setMissiles={setMissiles}
        missileFrequency={enemy.missileFrequency}
        texture={enemy.texture}
        uuidv4={uuidv4}
      />
    ))}
  </div>
  );
};

export default Game;
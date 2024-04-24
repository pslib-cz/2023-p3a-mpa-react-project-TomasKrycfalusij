import React, { useState, useEffect, useContext } from 'react';
import Player from '../components/Player';
import gameStyle from './GameStyle.module.css';
import Missile from '../components/Missile';
import { v4 as uuidv4 } from 'uuid';
import { Context } from '../components/ContextProvider';
import { ActionType } from '../types/ReducerTypes';
import Enemy from '../components/Enemy';
import { EnemyType, enemiesSelector } from '../types/EnemyTypes';
import { Coordinates } from '../types/BasicTypes';
import { MissileType, missilesSelector } from '../types/MissileTypes';
import { Joystick } from 'react-joystick-component';
import { allLevels } from '../types/Levels';
import { useWindowSize, useEventListener, useClickAnyWhere } from 'usehooks-ts';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';"c:/Users/nestr/OneDrive/Plocha/School/webs/2023-p3a-mpa-react-project-TomasKrycfalusij/my-app/node_modules/react-joystick-component/build/lib/Joystick"

export const spawnMissile = (
  normalizedDx: number,
  normalizedDy: number,
  objectPosition: Coordinates,
  objectRotation: number,
  missileType: number,
  fromEnemy: boolean,
  setMissiles: React.Dispatch<React.SetStateAction<MissileType[]>>,
  gamePaused: boolean,
  uuidv4: () => string
) => {
  if (!gamePaused) {
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
  }
};

const Game: React.FC = () => {
  const { playerStats, dispatch } = useContext(Context);
    // ----- OTHER ----- //

    const { width: screenWidth, height: screenHeight } = useWindowSize();

    // const [levelConfigCopy, setLevelConfigCopy] = useState(allLevels[playerStats.level - 1]);
    const [array, setArray] = useState(allLevels[playerStats.level - 1].enemies);

  // ----- PLAYER ----- //
  const [playerPosition, setPlayerPosition] = useState<Coordinates>({
    x: screenWidth / 2,
    y: screenHeight / 2,
  });
  const [mousePosition, setMousePosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [playerRotation, setPlayerRotation] = useState<number>(0);
  const [velocity, setVelocity] = useState<Coordinates>({ x: 0, y: 0 });
  const maxSpeed: number = 2
  // const [maxSpeed, setMaxSpeed] = useState<number>(2);
  const accelerationRate: number = 0.02
  // const [accelerationRate, setAccelerationRate] = useState<number>(0.02);
  const friction: number = 0.02
  // const [friction, setFriction] = useState<number>(0.02);
  const playerWidth: number = 60
  // const [playerWidth, setPlayerWidth] = useState<number>(60);
  const playerHeight: number = 60
  // const [playerHeight, setPlayerHeight] = useState<number>(60);
  const [acceleration, setAcceleration] = useState<Coordinates>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [movement, setMovement] = useState<string | null>(null);
  const [joystickRotationHeld, setJoystickRotationHeld] = useState<boolean>(false);
  // const [player, setPlayer] = useState<playrType[]>([{type: play}])
  // ----- MISSILES ----- //
  const [recharged, setRecharged] = useState<boolean>(true);
  const [lastShotTime, setLastShotTime] = useState<number>(0);
  const shootingInterval: number = 500;
  const [missileIntervalId, setMissileIntervalId] = useState<number | null>(null);
  const [missiles, setMissiles] = useState<MissileType[]>([])
  
  // ----- BACKGROUND ----- //
  const [bgX, setBgX] = useState<number>(0);
  const [bgY, setBgY] = useState<number>(0);
  
  const updateRate: number = 1000 / 200;

  // ----- ENEMIES ----- //
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const enemySpawnInterval = 3000;
  const [enemiesKilled, setEnemiesKilled] = useState(new Map());
  const [totalEnemiesSpawned, setTotalEnemiesSpawned] = useState<number>(0);

  const updateJoystickMove = (event: IJoystickUpdateEvent) => {
    if (event.type === "move") {
      if (event.direction === "FORWARD") {
        setMovement("FORWARD");
        console.log(event.direction)
      } else if (event.direction === "BACKWARD") {
        setMovement("BACKWARD");
        console.log(event.direction)
      } else if (event.direction === "LEFT") {
        setMovement("LEFT");
        console.log(event.direction)
      } else if (event.direction === "RIGHT") {
        setMovement("RIGHT");
        console.log(event.direction)
      }
    } else if (event.type === "stop") {
      setMovement(null);
    }
  };

  // Recharge the missile shooting after 2 seconds
useEffect(() => {
  if (!recharged) {
    const timeoutId = setTimeout(() => {
      setRecharged(true);
    }, 500);
    return () => clearTimeout(timeoutId);
  }
}, [recharged]);


const updateJoystickRotate = (event: IJoystickUpdateEvent) => {
  if (event.type === "move") {
    setJoystickRotationHeld(true);
    if (screenWidth < 960) {
      const angle = Math.atan2(-Number(event.y), Number(event.x));
      let rotation = angle * (180 / Math.PI) + 90;
      setPlayerRotation(rotation);

    }
  } else if (event.type === "stop") {
    setJoystickRotationHeld(false);
  }
}

const spawnMissile2 = () => {
  console.log("Shooting missile");
  const currentTime = Date.now();
  if (currentTime - lastShotTime >= shootingInterval) {
    spawnMissile(
      Math.sin(playerRotation * (Math.PI / 180)), // Calculate normalized direction vector x component
      -Math.cos(playerRotation * (Math.PI / 180)), // Calculate normalized direction vector y component
      { x: playerPosition.x + playerWidth / 2, y: playerPosition.y + playerHeight / 2 },
      playerRotation, // Pass player's rotation angle
      2, // Example missile type, replace with desired value
      false,
      setMissiles,
      gamePaused,
      uuidv4
    );
    setLastShotTime(currentTime);
  }
}

if (recharged && joystickRotationHeld) {
  spawnMissile2();
}
  
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

  switch (movement) {
    case 'FORWARD':
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: -accelerationRate }));
      break;
    case 'BACKWARD':
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: accelerationRate }));
      break;
    case 'LEFT':
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: -accelerationRate }));
      break;
    case 'RIGHT':
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: accelerationRate }));
      break;
    case null:
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, y: 0 }));
      setAcceleration((prevAcceleration) => ({ ...prevAcceleration, x: 0 }));
      break;
    default:
      break;
  }

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
  }, [accelerationRate, movement]);
  // ----- HANDLING KEYBOARD ACTIONS ----- //

  


  // ----- SPAWNING PLAYER MISSILES ----- //
  const mouseClick = (e: MouseEvent) => {
    if (screenWidth >= 960 && !joystickRotationHeld) {
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
        gamePaused,
        uuidv4
      );
    }
  };
  // ----- SPAWNING PLAYER MISSILES ----- //

  useClickAnyWhere(mouseClick);

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
        x: Math.min(screenWidth - playerWidth, Math.max(0, playerPosition.x + updatedVelocity.x)),
        y: Math.min(screenHeight - playerHeight, Math.max(0, playerPosition.y + updatedVelocity.y)),
      };
    
      const hitsBorder =
        updatedPlayerPosition.x === 0 ||
        updatedPlayerPosition.x === screenWidth - playerWidth ||
        updatedPlayerPosition.y === 0 ||
        updatedPlayerPosition.y === screenHeight - playerHeight;
    
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
            missile.position.x <= screenWidth &&
            missile.position.y >= 0 &&
            missile.position.y <= screenHeight;

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
              // const radius = screenWidth * 0.1;
              const angle = Math.atan2(dy, dx);
              const circularVelocity = enemy.speed * 0.5;
              velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
              velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
            }
          } else if (enemy.type === 2) {
            velocityX = (dx / distance) * enemy.speed;
            velocityY = (dy / distance) * enemy.speed;
          } else if (enemy.type === 3) {
            if (distance > screenWidth * 0.3) {
              velocityX = (dx / distance) * enemy.speed;
              velocityY = (dy / distance) * enemy.speed;
            } else if (distance > screenWidth * 0.2) {
              const slowdownFactor = ((distance - screenWidth * 0.2) / (screenWidth * 0.1)) + 0.3;
              velocityX = (dx / distance) * enemy.speed * slowdownFactor;
              velocityY = (dy / distance) * enemy.speed * slowdownFactor;
            } else {
              // const radius = screenWidth * 0.1;
              const angle = Math.atan2(dy, dx);
              const circularVelocity = enemy.speed * 0.5;
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
  const checkMissileCollisions = () => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        let updatedEnemy = { ...enemy };
        let collisionDetected = false;
        let hitPlayer = false;
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
                updatedEnemy.health -= missile.damage;
              }
            }
          }
        });

        const playerCenterX = playerPosition.x + playerWidth / 2;
        const playerCenterY = playerPosition.y + playerHeight / 2;
        const dxPlayer = playerCenterX - enemy.position.x;
        const dyPlayer = playerCenterY - enemy.position.y;
        const distancePlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
        const collisionPlayer = distancePlayer < (playerWidth / 2);

        if (collisionPlayer && enemy.type === 2) {
          hitPlayer = true;
          updatedEnemy.health = 0;
        }

        if (hitPlayer && !enemiesKilled.get(updatedEnemy.id)) {
          setEnemiesKilled((prevMap) => new Map(prevMap.set(updatedEnemy.id, true)));
          dispatch({ type: ActionType.UPDATE_PLAYER_HEALTH, payload: -1 }); // here is the error
        }

        if (!hitPlayer && updatedEnemy.health <= 0 && !enemiesKilled.get(updatedEnemy.id)) {
          setEnemiesKilled((prevMap) => new Map(prevMap.set(updatedEnemy.id, true)));
          dispatch({ type: ActionType.UPDATE_MONEY, payload: enemy.reward });
        }

        return updatedEnemy;
      }).filter((enemy) => enemy.health > 0)
    );

    missiles.map((missile, index) => {
      const dxPlayer = playerPosition.x - missile.position.x + (playerWidth / 2);
      const dyPlayer = playerPosition.y - missile.position.y + (playerHeight / 2);
      const distancePlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
      const collisionPlayer = distancePlayer < 25;

      if (collisionPlayer && missile.isEnemy) {
        dispatch({ type: ActionType.UPDATE_PLAYER_HEALTH, payload: -missile.damage });
        const updatedMissile = { ...missile, collisions: missile.collisions - 1 };
        setMissiles((prevMissiles) => {
          const updatedMissiles = [...prevMissiles];
          updatedMissiles[index] = updatedMissile;
          return updatedMissiles.filter((_, idx) => idx !== index);
        });
      }
    });
  };
  // ----- CHECKING COLLISIONS ----- //


    

    const updateLoop = setInterval(() => {
      if (!gamePaused) {
        updatePosition();
        applyFriction();
        updateMissilePositions();
        moveEnemies();
        checkMissileCollisions();
      }
    }, updateRate);

    return () => {
      clearInterval(updateLoop)
    };
  }, [gamePaused, acceleration, friction, maxSpeed, playerPosition, velocity, playerWidth, playerHeight, screenHeight]);
  // -----   A L L   T H E   B I G   L O G I C   ----- //


  // ----- ROTATING PLAYER ----- //
  useEffect(() => {
    if (!gamePaused && screenWidth >= 960) {
      const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };
  
      document.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [gamePaused]);

  useEffect(() => {
    if (!gamePaused && screenWidth >= 960) {
      const playerCenterX = playerPosition.x + playerWidth / 2;
      const playerCenterY = playerPosition.y + playerHeight / 2;
      const dx = mousePosition.x - playerCenterX;
      const dy = mousePosition.y - playerCenterY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      setPlayerRotation(angle);
    }
  }, [gamePaused, mousePosition, playerPosition, playerWidth, playerHeight]);
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
    if (!gamePaused) {
      const levelConfig = allLevels[playerStats.level - 1];
      const sumOfEnemiesInLevel = levelConfig.enemies.reduce((sum, enemy) => sum + enemy, 0);
      const maxEnemiesToSpawn = Math.ceil(sumOfEnemiesInLevel / 2);

      const spawnEnemy = () => {
        if (enemies.length < maxEnemiesToSpawn && totalEnemiesSpawned < sumOfEnemiesInLevel) {
          const randomX = Math.random() < 0.5 ? -50 : screenWidth + 50;
          const randomY = Math.random() * screenHeight;

          const nonZeroIndexes = array.reduce((acc, num, index) => {
            if (num !== 0) acc.push(index);
            return acc;
          }, [] as number[]);
    
          if (nonZeroIndexes.length === 0) {
            console.log("finished");
            return
          } else {
            const randomIndex = nonZeroIndexes[Math.floor(Math.random() * nonZeroIndexes.length)];
            const newArray = [...array];

            const newEnemy: EnemyType = {
              ...enemiesSelector[randomIndex],
              id: uuidv4(),
              position: { x: randomX, y: randomY },
            };
            setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
            setTotalEnemiesSpawned((prevTotalEnemiesSpawned) => prevTotalEnemiesSpawned + 1);

            if (newArray[randomIndex] > 0) {
              newArray[randomIndex]--;
            }
            setArray([...newArray]);
          }
        }
      };
      
      const enemySpawnTimer = setInterval(spawnEnemy, enemySpawnInterval);
  
      return () => clearInterval(enemySpawnTimer);
    }
  }, [gamePaused, enemies.length, enemySpawnInterval, screenHeight, screenWidth]);
  // ----- SPAWNING ENEMIES ----- //



  // ----- LEVEL COMPLETION ----- //

  useEffect(() => {
        if (enemiesKilled.size === allLevels[playerStats.level - 1].enemies.reduce((sum, enemy) => sum + enemy, 0)) {
      console.log("Level completed")

    }
  }, [enemiesKilled, playerStats.level]);
  // ----- LEVEL COMPLETION ----- //



  // ----- PAUSING THE GAME ----- //
  const handlePauseClick = () => {
    setGamePaused(true);
  };

  const handleResumeClick = () => {
    setGamePaused(false);
  };

  // ----- PAUSING THE GAME ----- //


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
          type={enemy.type}
          position={enemy.position}
          rotation={enemy.rotation}
          maxHealth={enemy.maxHealth}
          health={enemy.health}
          setMissiles={setMissiles}
          missileFrequency={enemy.missileFrequency}
          texture={enemy.texture}
          gamePaused={gamePaused}
          uuidv4={uuidv4}
        />
      ))}
            {!gamePaused && (
        <button onClick={handlePauseClick}>Pause</button>
      )}

      {/* Button to resume the game */}
      {gamePaused && (
        <button onClick={handleResumeClick}>Resume</button>
      )}
      <div className={`${gameStyle.joystickContainer} ${gameStyle.joystickRocketMovement}`}>
        <Joystick move={updateJoystickMove} stop={updateJoystickMove} size={100} baseColor="red" stickColor="blue" />
      </div>
      <div className={`${gameStyle.joystickContainer} ${gameStyle.joystickRocketRotation}`}>
        <Joystick move={updateJoystickRotate} stop={updateJoystickRotate} size={100} baseColor="red" stickColor="blue" />
      </div>
  </div>
  );
};

export default Game;

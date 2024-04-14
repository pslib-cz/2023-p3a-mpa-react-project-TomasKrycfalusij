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

    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

    useEffect(() => {
      const updateScreenValues = () => {
        const newScreenHeight = window.innerWidth > 960 ? window.innerHeight : window.innerHeight - 200;
        setScreenHeight(newScreenHeight);
        setScreenWidth(window.innerWidth);
        console.log("change")
      };
    
      updateScreenValues(); // Call once to initialize the state
    
      window.addEventListener('resize', updateScreenValues); // Listen for window resize events
    
      return () => {
        window.removeEventListener('resize', updateScreenValues); // Clean up event listener on unmount
      };
    }, []); 

    const [levelConfigCopy, setLevelConfigCopy] = useState(allLevels[playerStats.level - 1]);

  // ----- PLAYER ----- //
  const [playerPosition, setPlayerPosition] = useState<Coordinates>({
    x: screenWidth / 2,
    y: screenHeight / 2,
  });
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
  const [gamePaused, setGamePaused] = useState(false);
  const [movement, setMovement] = useState<string | null>(null);
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
  const [totalEnemiesSpawned, setTotalEnemiesSpawned] = useState<number>(0);

  type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

  interface IJoystickUpdateEvent {
    type: "move" | "stop" | "start";
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
    distance: number; // Percentile 0-100% of joystick 
  }

  const updateJoystickMove = () => {
    return (event: IJoystickUpdateEvent) => {
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
        gamePaused,
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
      if (!gamePaused) {
        updatePosition();
        applyFriction();
        updateMissilePositions();
        moveEnemies();
        checkMissileCollisions();
      }
    }, updateRate);

    document.addEventListener('click', mouseClick);

    return () => {
      clearInterval(updateLoop);
      document.removeEventListener('click', mouseClick);
    };
  }, [gamePaused, acceleration, friction, maxSpeed, playerPosition, velocity, playerWidth, playerHeight, screenHeight]);
  // -----   A L L   T H E   B I G   L O G I C   ----- //


  // ----- ROTATING PLAYER ----- //
  useEffect(() => {
    if (!gamePaused) {
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
    if (!gamePaused) {
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


  const [array, setArray] = useState([1, 2, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nonZeroIndexes = array.reduce((acc, num, index) => {
        if (num !== 0) acc.push(index);
        return acc;
      }, []);

      if (nonZeroIndexes.length === 0) {
        console.log("finished");
        clearInterval(interval);
      } else {
        const randomIndex = nonZeroIndexes[Math.floor(Math.random() * nonZeroIndexes.length)];
        const newArray = [...array];
        if (newArray[randomIndex] > 0) {
          newArray[randomIndex]--;
          console.log(`Index ${randomIndex} decremented, new value: ${newArray[randomIndex]}`);
        }
        setArray(newArray);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [array]);

  // ----- SPAWNING ENEMIES ----- //
  useEffect(() => {
    
    if (!gamePaused) {
      const levelConfig = allLevels[playerStats.level - 1];
      const sumOfEnemiesInLevel = levelConfig.enemies.reduce((sum, enemy) => sum + enemy, 0);
      const maxEnemiesToSpawn = Math.ceil(sumOfEnemiesInLevel / 2);
      
      for (let i: number = 0; i < levelConfigCopy.enemies.length; i++) {
        while (levelConfigCopy.enemies[i] > 0) {
          levelConfigCopy.enemies[i]--;
        }
      }


      const spawnEnemy = () => {
        if (enemies.length < maxEnemiesToSpawn && totalEnemiesSpawned < sumOfEnemiesInLevel) {
          const randomX = Math.random() < 0.5 ? -50 : screenWidth + 50;
          const randomY = Math.random() * screenHeight;
    
          const newEnemy: EnemyType = {
            ...enemiesSelector[0], // enemy 0 is the 0th index in the enemiesSelector array, 
            id: uuidv4(),
            position: { x: randomX, y: randomY },
          };
    
          setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
          setTotalEnemiesSpawned((prevTotalEnemiesSpawned) => prevTotalEnemiesSpawned + 1);
        
        }
      };
      
      const enemySpawnTimer = setInterval(spawnEnemy, 500);
  
      return () => clearInterval(enemySpawnTimer);
    }
  }, [gamePaused, enemies.length, enemySpawnInterval, screenHeight, screenWidth]);
  // ----- SPAWNING ENEMIES ----- //



  // ----- LEVEL COMPLETION ----- //

  useEffect(() => {
    const sumOfEnemiesInLevel = levelConfigCopy.enemies.reduce((sum, enemy) => sum + enemy, 0);
    if (sumOfEnemiesInLevel <= 0) {
      console.log("Level completed")
    }
    /*
        if (enemiesKilled.size === allLevels[playerStats.level - 1].enemies.reduce((sum, enemy) => sum + enemy, 0)) {
      console.log("Level completed")

    }
    */
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
      <div className={gameStyle.joystickContainer}>
        <Joystick move={updateJoystickMove()} stop={updateJoystickMove()} size={100} baseColor="red" stickColor="blue"></Joystick>
      </div>
  </div>
  );
};

export default Game;

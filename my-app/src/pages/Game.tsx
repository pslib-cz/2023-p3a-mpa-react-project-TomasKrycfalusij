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
import { useWindowSize, useClickAnyWhere } from 'usehooks-ts';
import LevelCompleted from '../components/LevelCompleted';
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
  scale: number,
  uuidv4: () => string
) => {
  if (!gamePaused) {
    const selectedMissile = missilesSelector.find(missile => missile.type === missileType) || missilesSelector[0];
    const newMissile: MissileType = {
      ...selectedMissile,
      id: 1,
      scale: scale,
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
  const [mobile, setMobile] = useState(false);
  const [autoshoot, setAutoshoot] = useState(false);
  const [showFinishedLevelMenu, setShowFinishedLevelMenu] = useState(false);
  
  useEffect(() => { 
    playerStats.health = 3 * Number(playerStats.upgrades.find(upgrade => upgrade.name === "Stronger plates")?.level);
    localStorage.setItem("playerStats", JSON.stringify(playerStats));
  }, [])
  // ----- OTHER ----- //

  const { width: screenWidthReal, height: screenHeightReal } = useWindowSize();
  const [scale, setScale] = useState<number>(1);

  const [screenWidth, setScreenWidth] = useState<number>(screenWidthReal)
  const [screenHeight, setScreenHeight] = useState<number>(screenHeightReal);

  useEffect(() => {
    if (screenWidthReal <= 960) {
      setScreenHeight(screenHeightReal - 200);
      setMobile(true);
      setScale(0.8);
    }
    else {
      setScreenHeight(screenHeightReal);
      setMobile(false);
      setScale(1);
    }
  }, [screenWidthReal, screenHeightReal])

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
  const playerWidth: number = 60 * scale;
  // const [playerWidth, setPlayerWidth] = useState<number>(60);
  const playerHeight: number = 60 * scale;
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
  const shootingInterval: number = 1000;
  // const [missileIntervalId, setMissileIntervalId] = useState<number | null>(null);
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
      } else if (event.direction === "BACKWARD") {
        setMovement("BACKWARD");
      } else if (event.direction === "LEFT") {
        setMovement("LEFT");
      } else if (event.direction === "RIGHT") {
        setMovement("RIGHT");
      }
    } else if (event.type === "stop") {
      setMovement(null);
    }
  };

  const [shootNow, setShootNow] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: any;
      timeoutId = setInterval(() => {
        if (mobile || autoshoot) {
          setRecharged(true)
          setShootNow(prev => !prev);
        }
      }, shootingInterval);
    return () => {
      if (timeoutId && (mobile || autoshoot)) {
        clearTimeout(timeoutId);
      }
    };
  }, [mobile, autoshoot]);

  useEffect(() => {
    let timeoutRechargeId: any;
    if (recharged) {
      spawnMissileFunc();
      setRecharged(false);
      timeoutRechargeId = setInterval(() => {
        setRecharged(true);
        console.log("recharged")
      }, shootingInterval);
    }
    return () => {
      if (timeoutRechargeId) {
        clearTimeout(timeoutRechargeId);
      }
    };
  }, [shootNow])


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

  const spawnMissileFunc = () => {
      spawnMissile(
        Math.sin(playerRotation * (Math.PI / 180)),
        -Math.cos(playerRotation * (Math.PI / 180)),
        { x: playerPosition.x + playerWidth / 2, y: playerPosition.y + playerHeight / 2 },
        playerRotation,
        2,
        false,
        setMissiles,
        gamePaused,
        scale,
        uuidv4
      );
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
    if (screenWidth >= 960 && !joystickRotationHeld && recharged) {
      setShootNow(prev => !prev);
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
          let newPosition;
          let remove = false;

          if (missile.type === 4) {
            const playerCenterX = playerPosition.x + playerWidth / 2;
            const playerCenterY = playerPosition.y + playerHeight / 2;

            const dx = playerCenterX - missile.position.x;
            const dy = playerCenterY - missile.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const directionX = dx / distance;
            const directionY = dy / distance;

            const angleToPlayer = Math.atan2(dy, dx);
            
            // Update the missile's rotation to face the player
            let missileRotation = angleToPlayer * (180 / Math.PI) + 90;

            const slowdownRate = 0.9993;
            missile.speed *= slowdownRate;

            const minSpeed = 0.6;
            if (missile.speed < minSpeed) {
              remove = true;
            }
            newPosition = {
              x: missile.position.x + directionX * missile.speed,
              y: missile.position.y + directionY * missile.speed,
            };

            if (
              newPosition.x < 0 ||
              newPosition.x > screenWidth ||
              newPosition.y < 0 ||
              newPosition.y > screenHeight
            ) {
              remove = true;
            }
            
            return {
              ...missile,
              position: newPosition,
              rotation: missileRotation,
              remove: remove,
            };
          } else {
            newPosition = {
              x: missile.position.x + missile.velocityX,
              y: missile.position.y + missile.velocityY,
            };
            if (
              newPosition.x < 0 ||
              newPosition.x > screenWidth ||
              newPosition.y < 0 ||
              newPosition.y > screenHeight
            ) {
              remove = true;
            }
          }

          return {
            ...missile,
            position: newPosition,
            remove: remove,
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
              const hitsBorder =
              enemy.position.x < 0 + enemy.width / 2 ||
              enemy.position.x > screenWidth - enemy.width / 2 ||
              enemy.position.y < 0 + enemy.height / 2 ||
              enemy.position.y > screenHeight - enemy.height / 2;
              if (!hitsBorder) {
                const angle = Math.atan2(dy, dx);
                const circularVelocity = enemy.speed * 0.5;
                velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
                velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
              } else {
                velocityX = 0;
                velocityY = 0;
              }
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
              const hitsBorder =
              enemy.position.x < 0 + enemy.width / 2 ||
              enemy.position.x > screenWidth - enemy.width / 2 ||
              enemy.position.y < 0 + enemy.height / 2 ||
              enemy.position.y > screenHeight - enemy.height / 2;
              if (!hitsBorder) {
                const angle = Math.atan2(dy, dx);
                const circularVelocity = enemy.speed * 0.5;
                velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
                velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
              } else {
                velocityX = 0;
                velocityY = 0;
              }
            }
          } else if (enemy.type === 4 || enemy.type === 5) {
            if (distance > screenWidth * 0.3) {
              velocityX = (dx / distance) * enemy.speed;
              velocityY = (dy / distance) * enemy.speed;
            } else if (distance > screenWidth * 0.2) {
              const slowdownFactor = ((distance - screenWidth * 0.2) / (screenWidth * 0.1)) + 0.3;
              velocityX = (dx / distance) * enemy.speed * slowdownFactor;
              velocityY = (dy / distance) * enemy.speed * slowdownFactor;
            } else {
              const hitsBorder =
              enemy.position.x < 0 + enemy.width / 2 ||
              enemy.position.x > screenWidth - enemy.width / 2 ||
              enemy.position.y < 0 + enemy.height / 2 ||
              enemy.position.y > screenHeight - enemy.height / 2;
              if (!hitsBorder) {
                const angle = Math.atan2(dy, dx);
                const circularVelocity = enemy.speed * 0.5;
                velocityX = circularVelocity * Math.cos(angle - Math.PI / 2);
                velocityY = circularVelocity * Math.sin(angle - Math.PI / 2);
              } else {
                velocityX = 0;
                velocityY = 0;
              }
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
          dispatch({ type: ActionType.UPDATE_PLAYER_HEALTH, payload: -1 });
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
      setGamePaused(true)
      setShowFinishedLevelMenu(true)
      if (playerStats.level >= playerStats.gameLevelReached) {
        dispatch({ type: ActionType.UPDATE_GAME_LEVEL_REACHED, payload: playerStats.level + 1 });
      }
    }
  }, [enemiesKilled, playerStats.level]);
  // ----- LEVEL COMPLETION ----- //


  // ----- PAUSING THE GAME ----- //
  const handlePauseClick = () => {
    setGamePaused(prev => !prev);
  };

  // ----- PAUSING THE GAME ----- //


  return (
  <div className={gameStyle.gameBackground} style={{ backgroundPosition: `${bgX}px ${bgY}px` }}>
      <div className={gameStyle.stats}>
        <p className={gameStyle.statsValue}>Money: {playerStats.money}</p>
        <p className={gameStyle.statsValue}>Level: {playerStats.level}</p>
        <p className={gameStyle.statsValue}>Health: {playerStats.health}</p>
      </div>
      {missiles.map((missile) => (
          <Missile key={missile.key} type={missile.type} position={missile.position} rotation={missile.rotation}/>
      ))}
      <Player position={playerPosition} width={playerWidth} height={playerWidth} rotation={playerRotation} moving={isMoving} />
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          id={enemy.id}
          scale={scale}
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
      <button disabled={showFinishedLevelMenu} onClick={handlePauseClick}>{gamePaused? "Resume" : "Pause"}</button>
      <button onClick={() => setAutoshoot(prev => !prev)}>Autoshoot: {autoshoot? "On" : "Off"}</button>
      <div className={`${gameStyle.joystickContainer} ${gameStyle.joystickRocketMovement}`}>
        <Joystick move={updateJoystickMove} stop={updateJoystickMove} size={100} baseColor="red" stickColor="blue" />
      </div>
      <div className={`${gameStyle.joystickContainer} ${gameStyle.joystickRocketRotation}`}>
        <Joystick move={updateJoystickRotate} stop={updateJoystickRotate} size={100} baseColor="red" stickColor="blue" />
      </div>
      {
        showFinishedLevelMenu ?
        <LevelCompleted />
        :
        null
      }
  </div>
  );
};

export default Game;

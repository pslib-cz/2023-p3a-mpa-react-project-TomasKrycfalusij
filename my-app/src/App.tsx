import React, { useState, useEffect } from 'react';
import Player from './components/Player';

const App = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
  const [maxSpeed, setMaxSpeed] = useState(10);
  const [accelerationRate, setAccelerationRate] = useState(0.3);
  const [friction, setFriction] = useState(0.05);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

    const handleKeyUp = (e) => {
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

  useEffect(() => {
    const updatePosition = () => {
      const updatedVelocity = {
        x: Math.min(maxSpeed, Math.max(-maxSpeed, velocity.x + acceleration.x)),
        y: Math.min(maxSpeed, Math.max(-maxSpeed, velocity.y + acceleration.y)),
      };

      setVelocity(updatedVelocity);

      const updatedPlayerPosition = {
        x: playerPosition.x + updatedVelocity.x,
        y: playerPosition.y + updatedVelocity.y,
      };

      setPlayerPosition(updatedPlayerPosition);
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

    const updateLoop = setInterval(() => {
      updatePosition();
      applyFriction();
    }, 1000 / 60); // 60 fps

    return () => {
      clearInterval(updateLoop);
    };
  }, [acceleration, friction, maxSpeed, playerPosition, velocity]);

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      tabIndex={0}
      onKeyDown={() => {}}
      onKeyUp={() => {}}
    >
      <Player position={playerPosition} />
    </div>
  );
};

export default App;

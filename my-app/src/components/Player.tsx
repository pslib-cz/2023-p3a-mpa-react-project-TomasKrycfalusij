import React from 'react';
import PlayerStyle from "./PlayerStyle.module.css";

interface PlayerProps {
  position: { x: number; y: number };
  width: number;
  height: number;
  rotation: number;
  moving: boolean;
}

const Player: React.FC<PlayerProps> = ({ position, width, height, rotation, moving }) => {

  const playerPositioner = {
    width: `${width}px`,
    height: `${height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${rotation}deg)`
  };

  return (
    <div style={playerPositioner} className={PlayerStyle.playerPositioner}>
      <div className={PlayerStyle.playerContainer}>
        <div className={`${PlayerStyle.boosterFire} ${moving ? PlayerStyle.boosterFireBoost : PlayerStyle.boosterFireDefault}`}></div>
        <div className={PlayerStyle.boosters}></div>
        <div className={PlayerStyle.player}></div>
      </div>
    </div>
  );
};

export default Player;

import React from 'react';
import PlayerStyle from "./PlayerStyle.module.css";

const Player = ({ position, width, height, rotation }) => {
  // Adjust rotation to match default orientation

  const playerPositioner = {
    width: `${width}px`,
    height: `${height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${rotation}deg)`, // Apply adjusted rotation
  };

  return (
    <div style={playerPositioner} className={PlayerStyle.playerPositioner}>
      <div className={PlayerStyle.playerContainer}>
        <div className={PlayerStyle.boosterFire}></div>
        <div className={PlayerStyle.boosters}></div>
        <div className={PlayerStyle.player}></div>
      </div>
    </div>
  );
};

export default Player;

import React from 'react';
import PlayerStyle from "./PlayerStyle.module.css"

const Player = ({ position, width, height, boosters }) => {
  const playerPositioner = {
    width: `${width}px`,
    height: `${height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
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
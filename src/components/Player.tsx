import React from 'react';
import PlayerStyle from "./PlayerStyle.module.css";
import { useContext } from 'react';
import { Context } from './ContextProvider';

interface PlayerProps {
  position: { x: number; y: number };
  width: number;
  height: number;
  rotation: number;
  moving: boolean;
}

const Player: React.FC<PlayerProps> = ({ position, width, height, rotation, moving }) => {
  const { playerStats } = useContext(Context);

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
        {
          (playerStats.upgrades.find((upgrade) => upgrade.name === 'Basic boosters')?.owned || playerStats.upgrades.find((upgrade) => upgrade.name === 'Hyper boosters')?.owned) &&
            <div className={`${PlayerStyle.boosterFire} ${moving ? PlayerStyle.boosterFireBoost : PlayerStyle.boosterFireDefault}`}></div>
        }
        {
          (playerStats.upgrades.find((upgrade) => upgrade.name === 'Basic boosters')?.owned || playerStats.upgrades.find((upgrade) => upgrade.name === 'Hyper boosters')?.owned) &&
            <div className={PlayerStyle.boosters}></div>
        }
        <div className={PlayerStyle.player}></div>
      </div>
    </div>
  );
};

export default Player;

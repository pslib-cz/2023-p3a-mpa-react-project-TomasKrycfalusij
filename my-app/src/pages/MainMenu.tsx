import React from 'react';
import { Link } from 'react-router-dom';
import mainMenuStyle from './MainMenu.module.css';

const MainMenu = () => {
  const numberOfEnemies = 6;
  const arrayOfEnemies = Array.from({ length: numberOfEnemies }, (_, index) => index);
  const leftEnemies = arrayOfEnemies.slice(0, numberOfEnemies / 2);
  const rightEnemies = arrayOfEnemies.slice(numberOfEnemies / 2);

  return (
    <div className={mainMenuStyle.container}>
      <div className={mainMenuStyle.buttonsContainer}>
        <h1 className={mainMenuStyle.header}>Protect the sun!</h1>
        <h2 className={mainMenuStyle.sectionName}>Main Menu</h2>
        <Link className={mainMenuStyle.menuLink} to="/game">Start Game</Link>
      </div>
      <div className={mainMenuStyle.playerIcon}></div>
      <div className={mainMenuStyle.leftEnemies}>
        {leftEnemies.map((enemy, index) => (
          <div key={index} style={{ top: `${index * 33.33 + 16.5}%`, left: "20%" }} className={mainMenuStyle.enemyIcon}></div>
        ))}
      </div>
      <div className={mainMenuStyle.rightEnemies}>
        {rightEnemies.map((enemy, index) => (
          <div key={index} style={{ top: `${index * 33.33 + 16.5}%`, left: "80%" }} className={mainMenuStyle.enemyIcon}></div>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;

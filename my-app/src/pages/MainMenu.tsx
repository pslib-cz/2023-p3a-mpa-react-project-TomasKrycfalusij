import { Link } from 'react-router-dom';
import mainMenuStyle from './MainMenu.module.css';

const MainMenu = () => {
  // const numberOfEnemies = 6;
  // const arrayOfEnemies = Array.from({ length: numberOfEnemies }, (_, index) => index);

  return (
    <div className={mainMenuStyle.container}>
      <div className={mainMenuStyle.buttonsContainer}>
        <h1 className={mainMenuStyle.header}>Protect the sun!</h1>
        <h2 className={mainMenuStyle.sectionName}>Main Menu</h2>
        <Link className={mainMenuStyle.menuLink} to="/levels">Levels</Link>
      </div>
      <div className={mainMenuStyle.playerIcon}></div>
    </div>
  );
};

export default MainMenu;

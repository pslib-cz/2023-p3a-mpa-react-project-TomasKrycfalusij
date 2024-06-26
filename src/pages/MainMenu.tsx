import { Link } from 'react-router-dom';
import mainMenuStyle from './MainMenu.module.css';
import { initialState } from '../components/Reducer';

const MainMenu = () => {
  // const numberOfEnemies = 6;
  // const arrayOfEnemies = Array.from({ length: numberOfEnemies }, (_, index) => index);

  const deleteAllData = () => {
    localStorage.setItem('playerStats', JSON.stringify(initialState));
    window.location.reload();
  }
  return (
    <div className={mainMenuStyle.container}>
      <div className={mainMenuStyle.buttonsContainer}>
        <h2 className={mainMenuStyle.header}>Protect the sun!</h2>
        <h1 className={mainMenuStyle.sectionName}>Main Menu</h1>
        <p className={mainMenuStyle.bonusInfo}>We recommend connecting your laptop to power supply and enable graphics acceleration on your browser.</p>
        <div className="linksContainer">
          <Link className={`alink`} to="/levels">Levels</Link>
          <Link className={`alink`} to="/shop">Go to Shop</Link>
        </div>
        <button onClick={() => deleteAllData()} className="btn">Reset game</button>
      </div>
      <div className={mainMenuStyle.playerIcon}></div>
    </div>
  );
};

export default MainMenu;

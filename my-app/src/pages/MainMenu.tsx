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
        <h1 className={mainMenuStyle.header}>Protect the sun!</h1>
        <h2 className={mainMenuStyle.sectionName}>Main Menu</h2>
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

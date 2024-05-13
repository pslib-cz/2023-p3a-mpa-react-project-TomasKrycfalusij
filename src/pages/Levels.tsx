import { useContext } from 'react'
import { allLevels } from '../types/Levels'
import levelsStyle from './Levels.module.css'
import { Context } from '../components/ContextProvider';
import { Link } from 'react-router-dom';
import { ActionType } from '../types/ReducerTypes';
import unlocked from '../assets/Icons/unlocked.svg'
import locked from '../assets/Icons/locked.svg'

const Levels = () => {
  const { playerStats, dispatch } = useContext(Context);

  return (
    <div className={levelsStyle.pageContainer}>
      <h1>LEVELS</h1>
      <div className={levelsStyle.levelsList}>
        {allLevels.map((level, index) => (
          <Link
            key={index}
            to={playerStats.gameLevelReached >= level.level ? "/game" : "#"} // Specify the link destination based on the condition
            onClick={() => {
              if (playerStats.gameLevelReached >= level.level) {
                dispatch({ type: ActionType.UPDATE_LEVEL, payload: level.level });
              }
            }}
            className={`${levelsStyle.singleLevel} ${
              playerStats.gameLevelReached >= level.level
                ? levelsStyle.reached
                : levelsStyle.notReached
            }`}
          >
          {
            playerStats.gameLevelReached >= level.level ?
            <img className={levelsStyle.lockImage} src={unlocked} alt="unlocked" />
            : <img className={levelsStyle.lockImage} src={locked} alt="locked" />
          }
            <p>Level {level.level}</p>
          </Link>
        ))}
      </div>
      {
        playerStats.gameLevelReached >= allLevels.length && <p>FINISHED GAME. CONGRATULATIONS!</p>
      }
      <div className="linksContainer">
        <Link className="alink" to="/shop">Go to Shop</Link>
        <Link className="alink" to="/">Main menu</Link>
      </div>
    </div>
  )
}

export default Levels

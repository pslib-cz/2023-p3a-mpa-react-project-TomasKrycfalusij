import { useContext } from 'react'
import { allLevels } from '../types/Levels'
import levelsStyle from './Levels.module.css'
import { Context } from '../components/ContextProvider';
import { Link } from 'react-router-dom';
import { ActionType } from '../types/ReducerTypes';

const Levels = () => {
  const { playerStats, dispatch } = useContext(Context);

  return (
    <div>
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
            <h2>Level {level.level}</h2>
          </Link>
        ))}
      </div>
      <Link to="/shop">Go to Shop</Link>
    </div>
  )
}

export default Levels

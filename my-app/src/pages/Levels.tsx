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
            to={playerStats.level >= level.level ? "/game" : "#"} // Specify the link destination based on the condition
            onClick={() => {
              if (playerStats.level >= level.level) {
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
    </div>
  )
}

export default Levels

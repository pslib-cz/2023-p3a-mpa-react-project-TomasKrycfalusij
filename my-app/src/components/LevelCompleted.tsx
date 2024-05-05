import styles from './LevelCompleted.module.css'
import { Link } from 'react-router-dom'

const LevelCompleted = () => {
  return (
  <div className={styles.levelCompletedContainer}>
    <p className={styles.levelCompletedText}>Level finished!</p>
    <Link className="alink" to="/levels">Levels</Link>
  </div>
  )
}

export default LevelCompleted

import React from 'react'
import styles from './LevelCompletedStyle.module.css'
import { Link } from 'react-router-dom'

const LevelCompleted = () => {
  return (
    <div className={styles.mainContainer}>
      <p>Level finished!</p>
      <Link to="/levels">Levels</Link>
    </div>
  )
}

export default LevelCompleted

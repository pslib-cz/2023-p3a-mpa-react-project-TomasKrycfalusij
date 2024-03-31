import { Coordinates } from './BasicTypes';

export interface EnemyType {
  id: string;
  type: number;
  position: Coordinates;
  velocityX: number;
  velocityY: number;
  rotation: number;
  maxHealth: number;
  health: number;
  speed: number;
  reward: number;
  missileType: number;
  missileFrequency: number;
  name: string;
  description: string;
}

export const enemiesSelector: EnemyType[] = [
  {
    id: "enemy1", // Unique ID for the enemy
    type: 1,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    maxHealth: 5,
    health: 5,
    speed: 5,
    reward: 10,
    missileType: 1,
    missileFrequency: 5,
    name: "Střelec",
    description: "Základní střelec. Jakmile se dostane dostatečně blízko, začne kolem hráče rootovat a pokusí se ho zničit ze všech stran."
  }
];
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
  texture: string;
}

export const enemiesSelector: EnemyType[] = [
  {
    id: "enemy1",
    type: 1,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    maxHealth: 3,
    health: 3,
    speed: 0.5,
    reward: 10,
    missileType: 1,
    missileFrequency: 3500,
    name: "Střelec",
    description: "Základní střelec. Jakmile se dostane dostatečně blízko, začne kolem hráče rootovat a pokusí se ho zničit ze všech stran.",
    texture: "/src/assets/enemies/Nairan - Torpedo Ship - Base.png"
  },
  {
    id: "enemy2",
    type: 2,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    maxHealth: 1,
    health: 1,
    speed: 2,
    reward: 10,
    missileType: 1,
    missileFrequency: 3500,
    name: "Střelec",
    description: "Základní střelec. Jakmile se dostane dostatečně blízko, začne kolem hráče rootovat a pokusí se ho zničit ze všech stran.",
    texture: "/src/assets/enemies/Nairan - Scout - Base.png"
  },
  {
    id: "enemy3",
    type: 3,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    maxHealth: 1,
    health: 1,
    speed: 2,
    reward: 10,
    missileType: 1,
    missileFrequency: 3500,
    name: "Střelec",
    description: "Základní střelec. Jakmile se dostane dostatečně blízko, začne kolem hráče rootovat a pokusí se ho zničit ze všech stran.",
    texture: "/src/assets/enemies/Nairan - Scout - Base.png"
  }
];
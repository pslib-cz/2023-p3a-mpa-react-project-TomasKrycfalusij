import { Coordinates } from './BasicTypes';

export interface EnemyType {
  id: string;
  type: number;
  position: Coordinates;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
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
    width: 50,
    height: 50,
    rotation: 0,
    maxHealth: 3,
    health: 3,
    speed: 0.5,
    reward: 10,
    missileType: 1,
    missileFrequency: 2000,
    name: "Střelec",
    description: "Basic shooter. Doesn't do much, but you still need to be aware.",
    texture: "./2023-p3a-mpa-react-project-TomasKrycfalusij/public/enemies/nairan-torpedoship-base.png"
  },
  {
    id: "enemy2",
    type: 2,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    width: 50,
    height: 50,
    rotation: 0,
    maxHealth: 1,
    health: 1,
    speed: 2,
    reward: 5,
    missileType: 1,
    missileFrequency: 0,
    name: "Střelec",
    description: "Bomber. He is very annoying and fast. He'll get to you and then explode.",
    texture: "./2023-p3a-mpa-react-project-TomasKrycfalusij/public/enemies/nairan-scout-base.png"
  },
  {
    id: "enemy3",
    type: 3,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    width: 50,
    height: 50,
    rotation: 0,
    maxHealth: 5,
    health: 5,
    speed: 0.5,
    reward: 20,
    missileType: 2,
    missileFrequency: 1000,
    name: "Střelec",
    description: "Advanced shooter. His accuracy and reload time makes it hard for you to avoid.",
    texture: "./2023-p3a-mpa-react-project-TomasKrycfalusij/public/enemies/nairan-frigate-base.png"
  },
  {
    id: "enemy4",
    type: 4,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    width: 70,
    height: 70,
    rotation: 0,
    maxHealth: 10,
    health: 10,
    speed: 0.3,
    reward: 30,
    missileType: 2,
    missileFrequency: 3000,
    name: "Střelec",
    description: "Surrounder. This enemy shoots 3 missiles at once.",
    texture: "./2023-p3a-mpa-react-project-TomasKrycfalusij/public/enemies/nairan-battlecruiser-base.png"
  },
  {
    id: "enemy5",
    type: 5,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    width: 90,
    height: 90,
    rotation: 0,
    maxHealth: 25,
    health: 25,
    speed: 0.2,
    reward: 40,
    missileType: 4,
    missileFrequency: 4000,
    name: "Střelec",
    description: "The most powerful enemy. he is slow but his topedo missiles never miss.",
    texture: "./2023-p3a-mpa-react-project-TomasKrycfalusij/public/enemies/nairan-dreadnought-base.png"
  }
];
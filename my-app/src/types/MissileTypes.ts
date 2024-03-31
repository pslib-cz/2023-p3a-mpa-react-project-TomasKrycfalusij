import { Coordinates } from './BasicTypes';

export interface MissileType {
  id: number;
  type: number;
  speed: number;
  isEnemy: boolean;
  position: Coordinates;
  velocityX: number;
  velocityY: number;
  remove: boolean;
  rotation: number;
  collisions: number;
  damage: number;
  key: string;
}

export const missilesSelector: MissileType[] = [
  {
    id: 0,
    type: 1,
    speed: 3,
    isEnemy: false,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    remove: false,
    rotation: 0,
    collisions: 1,
    damage: 1,
    key: '',
  },
  {
    id: 1,
    type: 2,
    speed: 5,
    isEnemy: false,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    remove: false,
    rotation: 0,
    collisions: 1,
    damage: 3,
    key: '',
  }
];

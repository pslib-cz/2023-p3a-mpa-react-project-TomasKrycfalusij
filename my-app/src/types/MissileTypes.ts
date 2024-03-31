import { Coordinates } from './BasicTypes';

export interface MissileType {
    id: number;
    position: Coordinates;
    velocityX: number;
    velocityY: number;
    remove: boolean;
    rotation: number;
    collisions: number;
    damage: number;
    key: string;
}

export const missilesSelector: MissileType[] = [{
    id: 0,
    position: { x: 0, y: 0 },
    velocityX: 0,
    velocityY: 0,
    remove: false,
    rotation: 0,
    collisions: 1,
    damage: 3,
    key: ''
}];
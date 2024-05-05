export interface LevelType {
    level: number;
    enemies: number[];
}

export const allLevels: LevelType[] = [
    {
        level: 1,
        enemies: [1]
    },
    {
        level: 2,
        enemies: [1, 1]
    },
    {
        level: 3,
        enemies: [1, 1, 1]
    },
    {
        level: 4,
        enemies: [0, 0, 2]
    },
    {
        level: 5,
        enemies: [2, 5, 3, 5]
    },
    {
        level: 6,
        enemies: [0, 0, 0, 2]
    },
    {
        level: 7,
        enemies: [1, 1, 1, 1, 1]
    },
    {
        level: 8,
        enemies: [1, 1, 1, 1, 1]
    },
    {
        level: 9,
        enemies: [12]
    },
    {
        level: 10,
        enemies: [13]
    }
]


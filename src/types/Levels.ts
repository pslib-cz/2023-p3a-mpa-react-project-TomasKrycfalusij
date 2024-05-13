export interface LevelType {
    level: number;
    enemies: number[];
}

export const allLevels: LevelType[] = [
    {
        level: 1,
        enemies: [3]
    },
    {
        level: 2,
        enemies: [4, 2]
    },
    {
        level: 3,
        enemies: [2, 5, 2]
    },
    {
        level: 4,
        enemies: [4, 6, 4]
    },
    {
        level: 5,
        enemies: [2, 5, 3, 2]
    },
    {
        level: 6,
        enemies: [2, 3, 3, 3, 1]
    },
    {
        level: 7,
        enemies: [0, 8, 4, 3, 3]
    },
]


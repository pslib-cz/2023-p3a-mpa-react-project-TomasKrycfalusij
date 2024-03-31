// Define the Upgrade interface
export interface Upgrade {
    name: string;
    cost: number;
    type: string;
    owned: boolean;
}

// Define the State interface to include player stats and upgrades
export interface State {
    money: number;
    level: number;
    upgrades: Upgrade[];
}

// Define the action types
export enum ActionType {
    UPDATE_MONEY = 'UPDATE_MONEY',
    UPDATE_LEVEL = 'UPDATE_LEVEL',
    UPDATE_UPGRADE = 'UPDATE_UPGRADE', // New action type for updating upgrades
}

// Define the action interfaces
export interface UpdateMoneyAction {
    type: ActionType.UPDATE_MONEY;
    payload: number;
}

export interface UpdateLevelAction {
    type: ActionType.UPDATE_LEVEL;
    payload: number;
}

export interface UpdateUpgradeAction {
    type: ActionType.UPDATE_UPGRADE;
    payload: {
        upgradeName: string;
        owned: boolean;
    };
}

// Union type for all actions
export type Action =
    | UpdateMoneyAction
    | UpdateLevelAction
    | UpdateUpgradeAction; // Include the new action type

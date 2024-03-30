import { Reducer } from 'react';

// Define the Upgrade interface
interface Upgrade {
    name: string;
    cost: number;
    type: string;
    owned: boolean;
}

// Define the State interface to include player stats and upgrades
interface State {
    money: number;
    level: number;
    upgrades: Upgrade[];
}

// Define the initial state
export const initialState: State = {
    money: 0,
    level: 1,
    upgrades: [],
};
// Define the action types
export enum ActionType {
    UPDATE_MONEY = 'UPDATE_MONEY',
    UPDATE_LEVEL = 'UPDATE_LEVEL',
    UPDATE_UPGRADE = 'UPDATE_UPGRADE', // New action type for updating upgrades
}

// Define the action interfaces
interface UpdateMoneyAction {
    type: ActionType.UPDATE_MONEY;
    payload: number;
}

interface UpdateLevelAction {
    type: ActionType.UPDATE_LEVEL;
    payload: number;
}

interface UpdateUpgradeAction {
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

// Define the reducer function
const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.UPDATE_MONEY:
            return {
                ...state,
                money: state.money + action.payload,
            };
        case ActionType.UPDATE_LEVEL:
            return {
                ...state,
                level: action.payload,
            };
        case ActionType.UPDATE_UPGRADE: // Handle update upgrade action
            return {
                ...state,
                upgrades: state.upgrades.map((upgrade) => {
                    if (upgrade.name === action.payload.upgradeName) {
                        return {
                            ...upgrade,
                            owned: action.payload.owned,
                        };
                    }
                    return upgrade;
                }),
            };
        default:
            return state;
    }
};

export default reducer;

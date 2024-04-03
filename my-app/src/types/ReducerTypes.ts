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
    health: number;
    upgrades: Upgrade[];
  }
  
  // Define the action types
  export enum ActionType {
    UPDATE_MONEY = 'UPDATE_MONEY',
    UPDATE_LEVEL = 'UPDATE_LEVEL',
    UPDATE_PLAYER_HEALTH = 'UPDATE_PLAYER_HEALTH', // New action type for updating player health
    UPDATE_UPGRADE = 'UPDATE_UPGRADE',
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
  
  export interface UpdatePlayerHealthAction {
    type: ActionType.UPDATE_PLAYER_HEALTH;
    payload: number;
  }
  
  export type Action =
    | UpdateMoneyAction
    | UpdateLevelAction
    | UpdatePlayerHealthAction
    | UpdateUpgradeAction;
  
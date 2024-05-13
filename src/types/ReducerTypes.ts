import { Dispatch } from "react";

// Define the Upgrade interface
export interface Upgrade {
  name: string;
  cost: number;
  type: string;
  owned: boolean;
  level?: number;
}

// Define the PlayerInfo interface
export interface PlayerInfo {
  playerStats: State;
  dispatch: Dispatch<Action>;
}
  
// Define the State interface
export interface State {
  money: number;
  health: number;
  level: number;
  gameLevelReached: number;
  upgrades: Upgrade[];
}
  
// Define the ActionType enum
export enum ActionType {
  UPDATE_MONEY = 'UPDATE_MONEY',
  UPDATE_LEVEL = 'UPDATE_LEVEL',
  UPDATE_PLAYER_HEALTH = 'UPDATE_PLAYER_HEALTH',
  UPDATE_UPGRADE = 'UPDATE_UPGRADE',
  UPDATE_GAME_LEVEL_REACHED = 'UPDATE_GAME_LEVEL_REACHED',
  UPDATE_UPGRADE_LEVEL = 'UPDATE_UPGRADE_LEVEL'
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
  
export interface UpdateGameLevelReached {
  type: ActionType.UPDATE_GAME_LEVEL_REACHED;
  payload: number;
}

export interface UpdateUpgradeLevelAction {
  type: ActionType.UPDATE_UPGRADE_LEVEL;
  payload: {
    upgradeName: string;
    level: number;
  };
}

// Define the Action union type
export type Action =
  | UpdateMoneyAction
  | UpdateLevelAction
  | UpdatePlayerHealthAction
  | UpdateUpgradeAction
  | UpdateGameLevelReached
  | UpdateUpgradeLevelAction;

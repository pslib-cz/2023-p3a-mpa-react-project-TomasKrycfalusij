import { Reducer } from 'react';
import { State, Action, ActionType } from '../types/ReducerTypes';
import { Upgrade } from '../types/ReducerTypes';


const initialUpgrades: Upgrade[] = [
  {
    name: "Basic boosters",
    cost: 30,
    type: "movement",
    owned: false
  },
  {
    name: "Hyper boosters",
    cost: 100,
    type: "movement",
    owned: false
  },
  {
    name: "Better missiles",
    cost: 30,
    type: "missile",
    owned: false
  },
  {
    name: "Even better missiles",
    cost: 100,
    type: "missile",
    owned: false
  },
  {
    name: "Triple missiles",
    cost: 100,
    type: "missile",
    owned: false
  },
  {
    name: "Stronger plates",
    cost: 20,
    type: "health",
    owned: false,
    level: 1
  },
  {
    name: "Regenerative plates",
    cost: 100,
    type: "health",
    owned: false,
  }
];

// Define the initial state
export const initialState: State = {
  money: 0,
  health: 3,
  level: 1,
  gameLevelReached: 1,
  upgrades: initialUpgrades,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.UPDATE_MONEY:
      return {
        ...state,
        money: state.money + action.payload,
      };
    case ActionType.UPDATE_PLAYER_HEALTH:
      return {
        ...state,
        health: state.health + action.payload,
      };
    case ActionType.UPDATE_UPGRADE:
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
    case ActionType.UPDATE_UPGRADE_LEVEL:
      return {
        ...state,
        upgrades: state.upgrades.map((upgrade) => {
          if (upgrade.name === action.payload.upgradeName) {
            return {
              ...upgrade,
              level: action.payload.level,
            };
          }
          return upgrade;
        }),
      };
    case ActionType.UPDATE_LEVEL:
      return {
        ...state,
        health: state.health = 3 * Number(state.upgrades.find(upgrade => upgrade.name === "Stronger plates")?.level),
        level: action.payload,
      };
    case ActionType.UPDATE_GAME_LEVEL_REACHED:
      return {
        ...state,
        gameLevelReached: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;

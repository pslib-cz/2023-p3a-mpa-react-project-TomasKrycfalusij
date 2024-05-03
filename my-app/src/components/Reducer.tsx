import { Reducer, useEffect } from 'react';
import { State, Action, ActionType } from '../types/ReducerTypes';
import { Upgrade } from '../types/ReducerTypes';


const initialUpgrades: Upgrade[] = [
  {
    name: "Basic boosters",
    cost: 20,
    type: "movement",
    owned: false
  },
  {
    name: "Hyper boosters",
    cost: 40,
    type: "movement",
    owned: false
  },
  {
    name: "Better missiles",
    cost: 20,
    type: "missile",
    owned: false
  },
  {
    name: "Triple missiles",
    cost: 50,
    type: "missile",
    owned: false
  },
  {
    name: "Explosive missiles",
    cost: 60,
    type: "missile",
    owned: false
  },
  {
    name: "Stronger plates",
    cost: 20,
    type: "health",
    owned: false
  },
  {
    name: "Titanium plates",
    cost: 40,
    type: "health",
    owned: false
  },
  {
    name: "Regenerative plates",
    cost: 20,
    type: "health",
    owned: false,
    level: 1
  }
];

// Define the initial state
export const initialState: State = {
  money: 0,
  health: 10,
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
    case ActionType.UPDATE_LEVEL:
        return {
          ...state,
          health: 10,
          level: action.payload,
        };
    case ActionType.UPDATE_GAME_LEVEL_REACHED:
      return {
        ...state,
        health: 10,
        gameLevelReached: action.payload,
      }
  }
};

export default reducer;
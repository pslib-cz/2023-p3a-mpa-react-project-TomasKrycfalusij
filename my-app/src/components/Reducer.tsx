import { Reducer } from 'react';
import { State, Action, ActionType } from '../types/ReducerTypes';

// Define the initial state
export const initialState: State = {
  money: 0,
  level: 1,
  health: 10,
  upgrades: [],
};

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
    case ActionType.UPDATE_PLAYER_HEALTH:
      return {
        ...state,
        health: state.health - action.payload,
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

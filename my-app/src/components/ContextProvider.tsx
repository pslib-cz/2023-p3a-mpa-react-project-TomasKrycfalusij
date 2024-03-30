import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';
import reducer, { initialState } from './Reducer';

import { Action } from './Reducer'; // Import the 'Action' type from the appropriate package

interface Upgrade {
    name: string;
    cost: number;
    type: string;
    owned: boolean;
}

interface PlayerInfo {
    playerStats: {
        money: number;
        level: number;
        upgrades: Upgrade[];
    };
    dispatch: Dispatch<Action>;
}

export const Context = createContext<PlayerInfo>({
    playerStats: initialState,
    dispatch: () => null,
});

export const ContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={{ playerStats: state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;

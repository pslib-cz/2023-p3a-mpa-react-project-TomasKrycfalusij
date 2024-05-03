import React, { createContext, PropsWithChildren, useEffect, useReducer } from 'react';
import reducer, { initialState } from './Reducer';
import { ActionType, PlayerInfo } from '../types/ReducerTypes'; // Import the 'Action' type from the appropriate package


export const Context = createContext<PlayerInfo>({
    playerStats: JSON.parse(String(localStorage.getItem('playerStats'))) || initialState,
    dispatch: () => null,
});

export const ContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, JSON.parse(String(localStorage.getItem('playerStats'))) || initialState);

    useEffect(() => {
        const storedState = localStorage.getItem('playerStats');
        if (!storedState) {
            localStorage.setItem('playerStats', JSON.stringify(state));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('playerStats', JSON.stringify(state));
    }, [state.upgrades, state.gameLevelReached]);

    return (
        <Context.Provider value={{ playerStats: state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;

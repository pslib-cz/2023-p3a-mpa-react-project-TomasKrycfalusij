import React, { createContext, PropsWithChildren, useReducer } from 'react';
import reducer, { initialState } from './Reducer';
import { PlayerInfo } from '../types/ReducerTypes'; // Import the 'Action' type from the appropriate package


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

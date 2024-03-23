import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';

export interface AppContextState {
    playerData: PlayerData | null;
    savePlayerData: (data: PlayerData) => void;
}

interface PlayerData {
    name: string;
    score: number;
    level: number;
}

export const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem('playerData');
        if (savedData) {
            setPlayerData(JSON.parse(savedData));
        }
    }, []);

    const savePlayerData = (data: PlayerData) => {
        setPlayerData(data);
        localStorage.setItem('playerData', JSON.stringify(data));
    };

    const contextValue: AppContextState = {
        playerData,
        savePlayerData,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

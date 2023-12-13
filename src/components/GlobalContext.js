// GlobalContext.js
import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [globalVariable, setGlobalVariable] = useState("zh-tw");

    const updateGlobalVariable = (newValue) => {
        setGlobalVariable(newValue);
    };

    return (
        <GlobalContext.Provider value={{ globalVariable, updateGlobalVariable }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalProvider, GlobalContext };
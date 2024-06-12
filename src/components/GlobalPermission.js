// 這邊是一個權限全域變數的檔案，我接收權限等級會是在loginpage.js裡面，我login以後我會得到一個permmision我把它存在這個全域變數裡面以便使用

import React, { createContext, useState } from 'react';

const GlobalPermissionContext = createContext();

const GlobalPermissionProvider = ({ children }) => {
  const [globalPermission, setGlobalPermission] = useState(); // Default permission level

  const updateGlobalPermission = (newValue) => {
    setGlobalPermission(newValue);
  };

  return (
    <GlobalPermissionContext.Provider value={{ globalPermission, updateGlobalPermission }}>
      {children}
    </GlobalPermissionContext.Provider>
  );
};

export { GlobalPermissionContext, GlobalPermissionProvider };

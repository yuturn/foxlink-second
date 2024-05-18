// import React, { createContext, useState } from 'react';

// export const GlobalPermissionContext = createContext();

// export const GlobalPermissionProvider = ({ children }) => {
//     const [defaultPermission, setDefaultPermission] = useState(4); // Default permission level

//     const [globalPermission, setGlobalPermission] = useState(defaultPermission);

//     const updateGlobalPermission = (newValue) => {
//         setGlobalPermission(newValue);
//     };

//     return (
//         <GlobalPermissionContext.Provider value={{ globalPermission, updateGlobalPermission, defaultPermission, setDefaultPermission }}>
//             {children}
//         </GlobalPermissionContext.Provider>
//     );
// };
// GlobalPermissionContext.js

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

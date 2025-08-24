import React, { createContext, useState } from 'react';

export const AppContent = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const backendUrl = 'http://localhost:5000'; // apne backend URL ke hisab se

  return (
    <AppContent.Provider
      value={{ userData, setUserData, isLoggedIn, setIsLoggedIn, backendUrl }}
    >
      {children}
    </AppContent.Provider>
  );
};

import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; 

export const AppContent = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // 👈 cookie sent automatically
        setUserData(res.data);
        setIsLoggedIn(true);
      } catch (err) {
        console.log(err.message)
        console.error("fetchUser error:", err.response?.data || err.message);
        setUserData(null);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppContent.Provider
      value={{
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AppContent.Provider>
  );
};

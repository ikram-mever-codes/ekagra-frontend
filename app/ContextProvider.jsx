"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { refresh } from "./authApi";
import Loading from "./loading";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data and handle loading/error state
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await refresh();

        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />;

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

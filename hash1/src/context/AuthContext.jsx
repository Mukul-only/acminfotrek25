import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(false); // Changed to false for non-blocking

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          // Fetch registrations asynchronously without blocking render
          fetchUserRegistrations(storedToken);
        }
      } catch (error) {
        console.error("Failed to initialize auth state", error);
        logout();
      }
    };

    initializeAuth();
  }, []);

  const fetchUserRegistrations = async (authToken) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/event/my-registrations`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!response.ok) throw new Error("Could not fetch registrations");
      const eventIds = await response.json();
      setRegisteredEvents(new Set(eventIds));
    } catch (error) {
      console.error("Failed to fetch user registrations:", error);
      setRegisteredEvents(new Set());
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    fetchUserRegistrations(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRegisteredEvents(new Set());
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const addRegisteredEvent = (eventId) => {
    setRegisteredEvents((prevSet) => new Set(prevSet).add(eventId));
  };

  const removeRegisteredEvent = (eventId) => {
    setRegisteredEvents((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
    registeredEvents,
    addRegisteredEvent,
    removeRegisteredEvent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

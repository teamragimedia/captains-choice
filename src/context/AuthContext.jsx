import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    if (token && customerId) {
      setUser({
        loggedIn: true,
        customerId,
      });
    }
  }, []);

  const login = (token, customerId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("customerId", customerId);

    setUser({
      loggedIn: true,
      customerId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customerId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

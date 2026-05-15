import React, { createContext, useContext, useState } from 'react';
import { NEGOCIO } from '../utils/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('hilara_admin_auth') === 'true';
  });

  const login = (user, pass) => {
    if (user === NEGOCIO.admin_user && pass === NEGOCIO.admin_pass) {
      setIsAdmin(true);
      localStorage.setItem('hilara_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('hilara_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

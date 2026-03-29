import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    await registerUser(payload);
    const userData = await loginUser({ email: payload.email, password: payload.password });
    localStorage.setItem('token', userData.token);
    setUser(userData.user);
    return userData.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem('marinfo_user');
      if (u) setUser(JSON.parse(u));
    } catch (e) {
      localStorage.removeItem('marinfo_token');
      localStorage.removeItem('marinfo_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (data) => {
    localStorage.setItem('marinfo_token', data.token);
    localStorage.setItem('marinfo_user', JSON.stringify(data));
    setUser(data);
  };

  const login    = async (email, motDePasse)        => { const { data } = await authAPI.login({ email, motDePasse });      persist(data); return data; };
  const register = async (payload)                  => { const { data } = await authAPI.register(payload);                  persist(data); return data; };
  const loginAdmin = async (email, motDePasse)      => { const { data } = await authAPI.loginAdmin({ email, motDePasse }); persist(data); return data; };

  const logout = () => {
    localStorage.removeItem('marinfo_token');
    localStorage.removeItem('marinfo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAdmin, logout, loading,
      isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN', isClient: user?.role === 'CLIENT' }}>
      {children}
    </AuthContext.Provider>
  );
}

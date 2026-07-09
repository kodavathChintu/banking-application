import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

const normalizeRole = (role?: string) => {
  if (!role) return undefined;
  if (role === 'BANK_MANAGER') return 'MANAGER';
  return role;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isManager: boolean;
  isCustomer: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        const normalizedUser = {
          ...parsedUser,
          role: normalizeRole(parsedUser.role) as User['role'],
        };

        setToken(storedToken);
        setUser(normalizedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    const normalizedUser = {
      ...newUser,
      role: normalizeRole(newUser.role) as User['role'],
    };

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setToken(newToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isManager: user?.role === 'MANAGER',
        isCustomer: user?.role === 'CUSTOMER',
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

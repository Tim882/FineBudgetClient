import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth.service';
import { User, AuthResponse, LoginData, RegisterData, ForgotPasswordData, ResetPasswordData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        if (authService.isTokenExpired(currentUser.accessToken)) {
          try {
            // Попытка обновить токен
            const authData = await authService.refreshToken(currentUser.refreshToken);
            setUser(authData.user);
          } catch (error) {
            await authService.logout();
          }
        } else {
          setUser(currentUser.user);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    const authData = await authService.login(data);
    setUser(authData.user);
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    await authService.forgotPassword(data);
  };

  const resetPassword = async (data: ResetPasswordData) => {
    await authService.resetPassword(data);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
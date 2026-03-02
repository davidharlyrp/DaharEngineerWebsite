import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pb, authStore } from '@/lib/pocketbase/client';
import type { AuthContextType } from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  created: string;
  updated: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already authenticated
        if (authStore.isValid) {
          const authUser = authStore.model as unknown as User;
          setUser(authUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const unsubscribe = authStore.onChange((_token, model) => {
      if (model) {
        setUser(model as unknown as User);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Email/Password login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record as unknown as User);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Google OAuth login
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
      });
      setUser(authData.record as unknown as User);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      
      await pb.collection('users').create(data);
      
      // Auto login after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      pb.authStore.clear();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

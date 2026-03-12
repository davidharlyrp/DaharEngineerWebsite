import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pb, authStore } from '@/lib/pocketbase/client';
import type { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already authenticated and refresh the model
        if (pb.authStore.isValid) {
          try {
            const authData = await pb.collection('users').authRefresh();
            setUser(authData.record as unknown as User);
          } catch (refreshError: any) {
            // If refresh fails with 401, the token is invalid
            if (refreshError.status === 401) {
              pb.authStore.clear();
              setUser(null);
            } else {
              // Fallback to local model for other errors if store is still valid
              if (pb.authStore.isValid) {
                setUser(pb.authStore.model as unknown as User);
              }
            }
            throw refreshError;
          }
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

      // Update user details for Google Login (emailVisibility and newsletter to true)
      if (authData.record) {
        await pb.collection('users').update(authData.record.id, {
          emailVisibility: true,
          newsletter: true,
        });

        // Refresh local user model
        const updatedRecord = await pb.collection('users').getOne(authData.record.id);
        setUser(updatedRecord as unknown as User);
      } else {
        setUser(authData.record as unknown as User);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (email: string, password: string, name: string, institution?: string, newsletter?: boolean, phone_number?: string) => {
    try {
      setIsLoading(true);
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
        institution: institution || '',
        newsletter: !!newsletter,
        phone_number: phone_number || '',
        emailVisibility: true,
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

  // Confirm password reset
  const confirmPasswordReset = useCallback(async (token: string, password: string) => {
    try {
      await pb.collection('users').confirmPasswordReset(token, password, password);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  }, []);

  // Change password for logged in user
  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      await pb.collection('users').update(user.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: newPassword,
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      if (pb.authStore.isValid && pb.authStore.model) {
        const record = await pb.collection('users').getOne(pb.authStore.model.id);
        setUser(record as unknown as User);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  const requestVerification = useCallback(async (email: string) => {
    try {
      await pb.collection('users').requestVerification(email);
      return { success: true };
    } catch (error) {
      console.error('Request verification error:', error);
      return { success: false };
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
    confirmPasswordReset,
    changePassword,
    refreshUser,
    requestVerification,
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

export * from './store';
export * from './revit';
export * from './resources';
export * from './software';
export * from './dashboard';
export * from './blog';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  total_coins?: number;
  verified: boolean;
  institution?: string;
  newsletter?: boolean;
  phone_number?: string;
  display_name?: string;
  username?: string;
  created: string;
  updated: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  slug: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image?: string;
  slug: string;
  isOnline: boolean;
}

// Portfolio types
export interface Portfolio {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  client?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, institution?: string, newsletter?: boolean, phone_number?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  requestVerification: (email: string) => Promise<{ success: boolean }>;
}

// Menu state types
export interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

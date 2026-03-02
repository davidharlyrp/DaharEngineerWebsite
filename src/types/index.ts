export * from './store';
export * from './revit';
export * from './resources';
export * from './software';
export * from './dashboard';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  total_coins?: number;
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
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Menu state types
export interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

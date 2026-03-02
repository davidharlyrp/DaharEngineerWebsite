// Software types
export interface Software {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: SoftwareCategory;
  icon?: string;
  thumbnail?: string;
  screenshots?: string[];
  websiteUrl: string;
  isNew: boolean;
  isFeatured: boolean;
  version?: string;
  features: string[];
  pricing?: SoftwarePricing;
  rating: number;
  userCount: number;
  created: string;
  updated: string;
}

export type SoftwareCategory = 
  | 'structural-analysis' 
  | 'geotechnical' 
  | 'calculation' 
  | 'optimization' 
  | 'estimation' 
  | 'database';

export interface SoftwarePricing {
  type: 'free' | 'freemium' | 'paid';
  price?: number;
  currency?: string;
  billingPeriod?: 'monthly' | 'yearly' | 'lifetime';
}

export interface SoftwareCategoryInfo {
  id: SoftwareCategory;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// Product types for store
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  subcategory?: string;
  thumbnail: string;
  images?: string[];
  files?: ProductFile[];
  features: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  slug: string;
  created: string;
  updated: string;
}

export type ProductCategory = 
  | 'revit-family' 
  | 'excel-template' 
  | 'calculation-sheet' 
  | 'drawing-template' 
  | 'e-book' 
  | 'course-material';

export interface ProductFile {
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface ProductCategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  created: string;
  updated: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Purchase history
export interface PurchaseHistory {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  price: number;
  purchaseDate: string;
  downloadUrl?: string;
  downloadCount: number;
  maxDownloads: number;
}

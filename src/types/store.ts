// Product types for store
export interface Product {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  short_description: string;
  long_description: string;
  main_price: number;
  discount_price?: number;
  category: ProductCategory;
  sub_category?: string;
  thumbnail: string;
  pictures: string[];
  file: string;
  file_name?: string;
  file_size?: number;
  file_format?: string;
  version?: string;
  language?: string;
  features: string[]; // This will be parsed from JSON
  is_active: boolean;
  view_count: number;
  download_count: number;
  created_by: string;
  created_by_name: string;
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

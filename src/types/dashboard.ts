// Dashboard types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  company?: string;
  profession?: string;
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  created: string;
  updated: string;
}

// Course Booking types
export interface CourseBooking {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  courseType: 'online' | 'private';
  instructor: string;
  status: BookingStatus;
  schedule?: {
    date: string;
    time: string;
    duration: string;
  };
  price: number;
  paymentStatus: DashboardPaymentStatus;
  notes?: string;
  created: string;
  updated: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type DashboardPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Requested File types
export interface RequestedFile {
  id: string;
  userId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: RequestStatus;
  requestedAt: string;
  deliveredAt?: string;
  expiresAt?: string;
  downloadCount: number;
  maxDownloads: number;
  messageFromAdmin?: string;
}

export type RequestStatus = 'pending' | 'processing' | 'delivered' | 'expired';

// Product History types
export interface ProductHistory {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productThumbnail?: string;
  category: string;
  price: number;
  purchaseDate: string;
  orderId: string;
  downloadUrl?: string;
  downloadCount: number;
  maxDownloads: number;
  isExpired: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalPurchases: number;
  pendingFiles: number;
  availableFiles: number;
  totalSpent: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  created: string;
}

export type NotificationType = 
  | 'booking_confirmed' 
  | 'booking_cancelled' 
  | 'file_delivered' 
  | 'purchase_complete' 
  | 'system';

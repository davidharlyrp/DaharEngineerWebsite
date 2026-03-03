// Dashboard types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone_number?: string;
  institution?: string;
  display_name?: string;
  username?: string;
  newsletter?: boolean;
  total_coins?: number;
  created: string;
  updated: string;
}

// Course Booking types
export interface CourseBooking {
  id: string;
  user_id: string;
  booking_group_id?: string;
  course_id?: string;
  course_title: string;
  course_type?: string;
  mentor_name?: string;
  mentor_email?: string;
  topic?: string;
  duration?: string;
  session_date?: string;
  session_time?: string;
  session_number?: number;
  total_sessions?: number;
  price_per_session?: number;
  subtotal?: number;
  tax_amount?: number;
  total_amount: number;
  payment_status: BookingPaymentStatus;
  booking_status: BookingStatus;
  external_id?: string;
  invoice_id?: string;
  payment_method?: string;
  payment_date?: string;
  created: string;
  updated: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'finished';
export type BookingPaymentStatus = 'pending' | 'paid' | 'expired' | 'failed';

// Requested File types (matches requested_files and requested_file_items collections)
export interface RequestedFileItem {
  id: string;
  requested_file_id: string;
  original_filename: string;
  stored_filename?: string;
  file: string;
  file_size: number;
  file_type: string;
  created: string;
  updated: string;
}

export interface RequestedFile {
  id: string;
  recipient_id: string[];
  subject: string;
  description: string;
  upload_date?: string;
  sender_id?: string;
  created: string;
  updated: string;
  expand?: {
    'requested_file_items(requested_file_id)'?: RequestedFileItem[];
  };
}

export type RequestStatus = 'pending' | 'processing' | 'delivered' | 'expired';

// Product History types (matches payment_history collection)
export interface ProductHistory {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_category: string;
  amount: number;
  final_amount: number;
  payment_status: BookingPaymentStatus;
  payment_method?: string;
  payment_date?: string;
  file_name?: string;
  file_size?: number;
  downloaded: boolean;
  download_date?: string;
  created: string;
  updated: string;
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

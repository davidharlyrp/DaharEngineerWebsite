// Course types
export interface Course {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  tag?: string;
  serviceType: 'Course' | 'Consultation';
  isActive: boolean;
  created: string;
  updated: string;
  // UI derived fields
  mentors?: Mentor[];
}

export interface Mentor {
  id: string;
  collectionId: string;
  name: string;
  specialization: string;
  email: string;
  image?: string;
  isActive: boolean;
  tags: string[]; // IDs of courses
  dayAvail?: string[];
  startTimeActive?: string;
  endTimeActive?: string;
  created: string;
  updated: string;
  // UI derived fields
  availability?: AvailabilitySlot[];
  experience?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Booking {
  id?: string;
  user_id: string;
  booking_group_id?: string;
  session_date: string;
  session_time: string;
  course_id: string;
  course_title: string;
  course_type: string;
  full_name: string;
  email: string;
  whatsapp: string;
  mentor_name: string;
  mentor_id: string;
  mentor_email: string;
  topic?: string;
  duration: string;
  session_number?: number;
  total_sessions?: number;
  price_per_session: number;
  discount_applied?: boolean;
  discount_percentage?: number;
  discount_amount?: number;
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  external_id?: string;
  payment_status: 'pending' | 'paid' | 'expired' | 'failed';
  booking_status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'finished';
  invoice_id?: string;
  payment_method?: string;
  payment_date?: string;
  created?: string;
  updated?: string;
}

export interface AvailabilitySlot {
  day: string;
  times: string[];
}

export interface BookingRequest {
  id?: string;
  courseId: string;
  courseName: string;
  mentorId: string;
  mentorName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  notes?: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  created?: string;
  updated?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';


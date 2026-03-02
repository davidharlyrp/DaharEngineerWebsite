// Course types
export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: CourseCategory;
  icon?: string;
  thumbnail?: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  price: number;
  currency: string;
  mentors: Mentor[];
  syllabus?: string[];
  prerequisites?: string[];
  whatYouWillLearn?: string[];
  isActive: boolean;
  created: string;
  updated: string;
}

export type CourseCategory = 
  | 'geotechnical' 
  | 'structural' 
  | 'transportation' 
  | 'project-management' 
  | 'sketchup' 
  | 'tekla' 
  | 'revit';

export interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  expertise: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  availability: AvailabilitySlot[];
  hourlyRate: number;
  currency: string;
  isAvailable: boolean;
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

export interface CourseCategoryInfo {
  id: CourseCategory;
  name: string;
  description: string;
  icon: string;
  courseCount: number;
}

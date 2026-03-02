import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  GraduationCap,
  Search,
  Clock,
  Star,
  User,
  Calendar,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  X,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import type { Course, Mentor, Booking } from '@/types/courses';
import { courseService } from '@/services/pb/courses';

// Mock courses data

// Hero Section
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={ref} className="relative h-screen">
      <motion.div
        style={{ opacity, y }}
        className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-noise" />

        <div className="relative z-10 text-center flex flex-col items-center justify-center px-6 w-full mx-auto h-screen">

          {/* Video background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source src="/Hero.webm" type="video/webm" />
            </video>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-army-500/30 
                       bg-army-500/10 mb-8"
          >
            <GraduationCap className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              PRIVATE COURSES
            </span>
          </motion.div>

          <TextReveal
            text="One-on-One"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Learning Experience"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto"
          >
            Learn directly from industry experts with personalized private sessions
            tailored to your learning goals and schedule.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course, index, onSelect }: { course: Course; index: number; onSelect: (course: Course) => void }) {
  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div
        onClick={() => onSelect(course)}
        className="group h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                   hover:border-army-500/30 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-army-700/20 overflow-hidden flex items-center justify-center
                            group-hover:bg-army-700 transition-colors">
              <img
                src={course.image ? courseService.getFileUrl(course, course.image) : '/placeholder-course.jpg'}
                alt={course.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-army-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {course.mentors?.length || 0} mentor{(course.mentors?.length || 0) > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Starting from</span>
              <p className="text-lg font-bold text-army-400">
                Rp {course.price.toLocaleString('id-ID')}
                <span className="text-sm font-normal text-muted-foreground"></span>
              </p>
            </div>
            <span className="text-army-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              View Mentors
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// Mentor List Item Component (Simplified for Panel)
function MentorListItem({
  mentor,
  isSelected,
  onSelect
}: {
  mentor: Mentor;
  isSelected: boolean;
  onSelect: (mentor: Mentor) => void
}) {
  return (
    <div
      onClick={() => onSelect(mentor)}
      className={`p-4 border transition-all cursor-pointer ${isSelected
        ? 'bg-army-700/10 border-army-500/50'
        : 'bg-background border-border/30 hover:border-army-500/20'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-army-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{mentor.name}</h4>
          <p className="text-xs text-muted-foreground">{mentor.specialization}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium">{mentor.rating ?? 5}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">({mentor.reviewCount ?? 0} rev)</span>
        </div>
      </div>
    </div>
  );
}

// Booking Modal Component
// Booking Success Modal
function BookingSuccessModal({
  isOpen,
  onClose,
  booking
}: {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}) {
  if (!isOpen || !booking) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-background border border-border w-full max-w-md shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 flex items-center justify-center mx-auto mb-6 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Booking Success!</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Your payment has been confirmed. Detailed session information has been sent to your email.
          </p>

          <div className="bg-muted/30 p-4 space-y-3 text-left mb-8 border border-border/50 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">{booking.course_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mentor</span>
              <span className="font-medium">{booking.mentor_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date(booking.session_date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-army-400">{booking.session_time}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/50">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-bold">Rp {booking.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-army-600 hover:bg-army-700 text-white py-6 rounded-none"
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BookingModal({
  course,
  mentor,
  isOpen,
  onClose
}: {
  course: Course;
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    whatsapp: '',
    preferredDate: '',
    preferredTime: '',
    duration: '1',
    notes: ''
  });

  // Generate time slots based on mentor availability
  const availableTimes = (() => {
    if (!mentor.startTimeActive || !mentor.endTimeActive) {
      return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    }

    const start = parseInt(mentor.startTimeActive.split(':')[0]);
    const end = parseInt(mentor.endTimeActive.split(':')[0]);
    const slots = [];
    for (let i = start; i < end; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  })();

  // Validate if selected date matches mentor's available days
  const isDateAvailable = (dateString: string) => {
    if (!mentor.dayAvail || mentor.dayAvail.length === 0) return true;
    const date = new Date(dateString);
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    return mentor.dayAvail.includes(dayName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=/private-courses`;
        return;
      }

      if (!isDateAvailable(formData.preferredDate)) {
        setError(`Mentor is not available on this day. Available days: ${mentor.dayAvail?.join(', ')}`);
        setIsLoading(false);
        return;
      }

      const durationValue = course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1;
      const subtotal = course.price * durationValue;
      const taxRate = 0.12;
      const taxAmount = Math.round(subtotal * taxRate);
      const totalAmount = subtotal + taxAmount;

      const bookingData = {
        userId: user?.id,
        userEmail: formData.email,
        userName: formData.full_name,
        amount: totalAmount,
        courseId: course.id,
        courseTitle: course.title,
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        sessionDate: new Date(formData.preferredDate).toISOString(),
        sessionTime: formData.preferredTime,
        whatsapp: formData.whatsapp,
        topic: formData.notes,
        duration: durationValue.toString(),
        taxAmount: taxAmount,
        subtotal: subtotal,
        courseType: course.serviceType === 'Consultation' ? 'Consultation' : 'Course'
      };

      const response = await axios.post('https://api.daharengineer.com/api/booking/create', bookingData);

      if (response.data.invoiceUrl) {
        window.location.href = response.data.invoiceUrl;
      } else {
        throw new Error('Failed to get payment link');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-secondary/50 border border-border/50 w-full max-w-lg max-h-[90vh] overflow-auto m-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-xl font-bold">Book Session</h2>
            <p className="text-sm text-muted-foreground">
              {course.title} with {mentor.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Mentor Info */}
            <div className="bg-background p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-army-700/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-army-400" />
                </div>
                <div>
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Rp {course.price.toLocaleString('id-ID')} / session
                </span>
              </div>
            </div>

            {/* Personal Data */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input
                required
                placeholder="e.g. 08123456789"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className={`pl-10 bg-background cursor-pointer ${formData.preferredDate && !isDateAvailable(formData.preferredDate) ? 'border-red-500' : ''}`}
                  />
                </div>
                {mentor.dayAvail && (
                  <p className="text-[10px] text-muted-foreground">
                    Mentor days: {mentor.dayAvail.join(', ')}
                  </p>
                )}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <select
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-md"
                >
                  <option value="">Select time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration - Only for Consultation */}
            {course.serviceType === 'Consultation' && (
              <div className="space-y-2">
                <Label>Session Duration</Label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-md"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Tell us about your learning goals or any specific topics you want to cover..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-background resize-none"
                rows={3}
              />
            </div>

            {/* Summary & Total */}
            <div className="bg-army-700/10 p-4 border border-army-500/30 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal {course.serviceType === 'Consultation' ? `(${formData.duration}h)` : ''}
                </span>
                <span>Rp {(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1)).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (12%)</span>
                <span>Rp {Math.round(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1) * 0.12).toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-army-500/20 flex items-center justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-army-400">
                  Rp {Math.round(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1) * 1.12).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-army-700 hover:bg-army-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Mentor Panel (Overlay)
function MentorPanel({
  course,
  isOpen,
  onClose,
  onBook
}: {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (mentor: Mentor) => void;
}) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  if (!course) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${isOpen ? 'visible' : 'invisible'
        }`}
    >
      <div
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-secondary shadow-2xl border-l border-border/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/30 flex items-center justify-between bg-background">
          <div>
            <Badge className="mb-2 bg-army-700">{course.tag || 'Civil Engineering'}</Badge>
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-xs text-muted-foreground">Available Mentors</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mentor List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select an expert mentor for your private session. Each session is personalized to your needs.
          </p>

          {course.mentors && course.mentors.length > 0 ? (
            course.mentors.map((mentor) => (
              <MentorListItem
                key={mentor.id}
                mentor={mentor}
                isSelected={selectedMentor?.id === mentor.id}
                onSelect={setSelectedMentor}
              />
            ))
          ) : (
            <div className="text-center py-10 opacity-50">
              <User className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">No mentors available yet</p>
            </div>
          )}
        </div>

        {/* footer */}
        {selectedMentor && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 bg-background border-t border-border/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-muted-foreground">Selected Mentor</span>
                <p className="font-semibold">{selectedMentor.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Rate</span>
                <p className="font-bold text-army-400">
                  Rp {course.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-army-700 hover:bg-army-600"
              onClick={() => onBook(selectedMentor)}
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Courses List Section
function CoursesListSection({
  courses,
  onSelectCourse
}: {
  courses: Course[];
  onSelectCourse: (course: Course) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || course.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const tags = Array.from(new Set(courses.map(c => c.tag).filter(Boolean))) as string[];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <SectionReveal>
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Button
                  variant={selectedTag === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('all')}
                  className={selectedTag === 'all' ? 'bg-army-700' : ''}
                >
                  All
                </Button>
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? 'bg-army-700' : ''}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Results Count */}
          <SectionReveal delay={0.1}>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            </p>
          </SectionReveal>

          {/* Courses Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onSelect={onSelectCourse}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No courses found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: '7', label: 'Course Categories' },
    { value: '10+', label: 'Expert Mentors' },
    { value: '200+', label: 'Students Trained' },
    { value: '4.8', label: 'Average Rating' }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            {stats.map((stat, index) => (
              <SectionReveal key={stat.label} delay={0.1 * (index + 1)}>
                <div className="p-8 lg:p-12 bg-background text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-army-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PrivateCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMentorPanelOpen, setIsMentorPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activeCourses, activeMentors] = await Promise.all([
          courseService.getActiveCourses(),
          courseService.getActiveMentors()
        ]);

        // Map mentors to their courses
        const coursesWithMentors = activeCourses.map(course => ({
          ...course,
          mentors: activeMentors.filter(m => m.tags?.includes(course.id))
        }));

        setCourses(coursesWithMentors);
      } catch (error) {
        console.error('Error in PrivateCourses fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const bookingId = searchParams.get('bookingId');

    if (status === 'success' && bookingId) {
      const fetchBooking = async () => {
        try {
          // Add a small delay for webhook processing if needed, 
          // though getOne should be fast enough for confirmation.
          const booking = await courseService.getBookingById(bookingId);
          setConfirmedBooking(booking);
          setShowSuccessModal(true);

          // Clear URL params safely
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('status');
          newParams.delete('bookingId');
          setSearchParams(newParams, { replace: true });
        } catch (err) {
          console.error('Error fetching booking details:', err);
        }
      };
      fetchBooking();
    }
  }, [searchParams, setSearchParams]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsMentorPanelOpen(true);
  };

  const handleBook = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-army-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <HeroSection />

      {/* Success Notification Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={confirmedBooking}
      />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <CoursesListSection courses={courses} onSelectCourse={handleSelectCourse} />
        <StatsSection />
      </div>

      {/* Mentor Selection Panel */}
      <MentorPanel
        course={selectedCourse}
        isOpen={isMentorPanelOpen}
        onClose={() => setIsMentorPanelOpen(false)}
        onBook={handleBook}
      />

      {/* Booking Modal */}
      {selectedCourse && selectedMentor && (
        <BookingModal
          course={selectedCourse}
          mentor={selectedMentor}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedMentor(null);
          }}
        />
      )}
    </div>
  );
}

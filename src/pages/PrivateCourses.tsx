import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
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
  ChevronDown,
  ChevronLeft,
  Coins,
  Wallet
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import type { Course, Mentor, Booking, ClientReview } from '@/types/courses';
import { courseService } from '@/services/pb/courses';
import { bookingService } from '@/services/pb/booking';
import { coinService } from '@/services/pb/coin';

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
          <img src={mentor.image ? courseService.getFileUrl(mentor, mentor.image) : '/placeholder-course.jpg'} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{mentor.name}</h4>
          <p className="text-xs text-muted-foreground">{mentor.specialization}</p>
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

// Coin Packages Modal Component
function CoinPackagesModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const packages = [
    {
      id: 'small',
      name: 'Small Package',
      coins: 2,
      price: 180000,
      discount: 'Save 10%'
    },
    {
      id: 'large',
      name: 'Large Package',
      coins: 4,
      price: 300000,
      discount: 'Save 25%'
    }
  ];

  const handlePurchase = async (pkg: typeof packages[0]) => {
    if (!isAuthenticated) return;
    setIsLoading(pkg.id);
    try {
      const response = await coinService.createCoinPurchaseInvoice({
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
        packageType: pkg.name,
        coinQuantity: pkg.coins,
        amount: pkg.price
      });
      if (response.invoiceUrl) {
        window.location.href = response.invoiceUrl;
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-secondary/90 border border-border/50 w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-border/30 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold italic uppercase tracking-tight">Purchase Coins</h2>
            <p className="text-xs text-muted-foreground mt-1">Unlock sessions with engineering experts</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-army-500/10 border-l-2 border-army-400 p-4 mb-2">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-army-400 shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-bold text-foreground mb-1">What are Coins?</p>
                <p>1 Coin = 1 Private Course session. Coins cannot be used for 'Consultation' services.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-background/40 border border-border/50 p-5 group hover:border-army-500/30 transition-all flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-5 h-5 text-army-400 font-bold" />
                    <h3 className="font-bold text-lg">{pkg.coins} Coins</h3>
                  </div>
                  <Badge variant="outline" className="rounded-none border-army-500/30 text-army-400 text-[10px] uppercase">{pkg.discount}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold mb-3">Rp {pkg.price.toLocaleString('id-ID')}</div>
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    disabled={isLoading !== null}
                    className="rounded-none bg-army-600 hover:bg-army-700 h-9 font-bold px-6"
                  >
                    {isLoading === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'BUY'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
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
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'xendit' | 'coin'>('xendit');
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
        window.location.href = `/login?redirect=/courses/private-courses`;
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

      if (paymentMethod === 'coin') {
        const response = await bookingService.createCoinBooking(bookingData);
        if (response.success) {
          await refreshUser();
          window.location.href = `/courses/private-courses?status=success&bookingId=${response.bookingId}`;
        }
      } else {
        const response = await bookingService.createBookingInvoice(bookingData);
        if (response.invoiceUrl) {
          window.location.href = response.invoiceUrl;
        } else {
          throw new Error('Failed to get payment link');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create booking. Please try again.');
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
            <h2 className="text-xl font-bold italic tracking-tight uppercase">Book Session</h2>
            <p className="text-xs text-muted-foreground">
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
              <Alert variant="destructive" className="rounded-none bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Method Switcher (Only if standard course) */}
            {course.serviceType === 'Course' && (
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Select Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('xendit')}
                    className={`flex flex-col items-center justify-center p-4 border transition-all ${paymentMethod === 'xendit' ? 'bg-army-500/10 border-army-400' : 'bg-background border-border/50 hover:border-army-500/30'}`}
                  >
                    <Wallet className={`w-5 h-5 mb-2 ${paymentMethod === 'xendit' ? 'text-army-400' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">Direct Payment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('coin')}
                    className={`flex flex-col items-center justify-center p-4 border transition-all ${paymentMethod === 'coin' ? 'bg-army-500/10 border-army-400' : 'bg-background border-border/50 hover:border-army-500/30'}`}
                  >
                    <Coins className={`w-5 h-5 mb-2 ${paymentMethod === 'coin' ? 'text-army-400' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">Use 1 Coin</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Balance: {user?.total_coins || 0}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mentor Info (Small) */}
            <div className="bg-background/40 border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-army-700/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-army-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">{mentor.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{mentor.specialization}</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-background rounded-none h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background rounded-none h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">WhatsApp Number</Label>
                <Input
                  required
                  placeholder="0812XXXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="bg-background rounded-none h-10"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Preferred Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="pl-10 bg-background rounded-none h-10 cursor-pointer text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Preferred Time</Label>
                  <select
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full h-10 px-3 bg-background border border-border/50 rounded-none text-xs"
                  >
                    <option value="">Select time slot</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {course.serviceType === 'Consultation' && (
                <div className="space-y-2">
                  <Label className="text-xs">Session Duration</Label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full h-10 px-3 bg-background border border-border/50 rounded-none text-xs"
                  >
                    {[1, 2, 3, 4].map(h => <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs">Additional Notes</Label>
                <Textarea
                  placeholder="Learning goals or topics..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-background rounded-none resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>

            {/* Price Preview (Only for Direct Payment) */}
            {paymentMethod === 'xendit' ? (
              <div className="bg-secondary/80 p-5 border border-army-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Original Price</span>
                  <span className="text-xs font-bold">Rp {(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1)).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground">
                  <span>Tax (12%)</span>
                  <span>Rp {Math.round(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1) * 0.12).toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="font-bold text-sm">TOTAL AMOUNT</span>
                  <span className="text-xl font-bold text-army-400">
                    Rp {Math.round(course.price * (course.serviceType === 'Consultation' ? parseInt(formData.duration) : 1) * 1.12).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-army-500/10 p-5 border border-army-400/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-army-400" />
                  <div>
                    <p className="text-sm font-bold italic tracking-tight uppercase">Payment with Coin</p>
                    <p className="text-[10px] text-muted-foreground">1 session will be deducted</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">1 <span className="text-xs text-muted-foreground uppercase">Coin</span></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 rounded-none uppercase text-xs font-bold tracking-widest"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || (paymentMethod === 'coin' && (user?.total_coins || 0) < 1)}
                className="flex-1 rounded-none bg-army-600 hover:bg-army-700 font-bold uppercase tracking-widest text-xs h-12"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : paymentMethod === 'coin' ? 'BOOK WITH COIN' : 'PAY SECURELY'}
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
  onSelectCourse,
  user,
  isAuthenticated,
  onBuyCoins
}: {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  user: any;
  isAuthenticated: boolean;
  onBuyCoins: () => void;
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
    <section className="relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Coin Balance Banner */}
          <div className="bg-secondary/40 border border-border/50 rounded-lg p-6 mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-army-700/20 flex items-center justify-center rounded-md">
                  <Wallet className="w-5 h-5 text-army-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Your Balance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {isAuthenticated ? (user?.total_coins ?? 0) : 0}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">Coins</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-xs text-muted-foreground hidden lg:block max-w-[200px]">
                  Use coins to exchange private courses instantly.
                </p>
                <Button
                  onClick={onBuyCoins}
                  className="bg-army-600 hover:bg-army-700 text-white rounded-md h-10 px-6 flex items-center gap-2 text-xs font-bold transition-all"
                >
                  <Coins className="w-4 h-4" />
                  BUY COINS
                </Button>
              </div>
            </div>
          </div>

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

// Review Slider Section
function ReviewSlider({ reviews }: { reviews: ClientReview[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (reviews.length === 0) return null;

  return (
    <section className="relative bg-secondary/10 py-24 overflow-hidden border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionReveal>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="rounded-none border-army-500/30 text-army-400 px-4 py-1">
                  TESTIMONIALS
                </Badge>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  {reviews.length} Total Reviews
                </span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                What Our <span className="text-army-400">Students</span> Say
              </h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Real feedback from engineers who have accelerated their careers with our private sessions.
              </p>
            </div>
          </SectionReveal>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="embla__slide flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full bg-background border border-border/50 p-8 flex flex-col group hover:border-army-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted/30'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(review.sessionDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <blockquote className="flex-grow text-sm italic text-foreground/90 mb-8 leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </blockquote>

                  <div className="pt-6 border-t border-border/50">
                    <div className="font-bold text-sm text-foreground mb-1 group-hover:text-army-400 transition-colors">
                      {review.clientName}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest line-clamp-1">
                      {review.courseTitle}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="rounded-none border-border/50 hover:border-army-500/50 bg-background h-10 w-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="rounded-none border-border/50 hover:border-army-500/50 bg-background h-10 w-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function PrivateCourses() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMentorPanelOpen, setIsMentorPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activeCourses, activeMentors, sessionReviews] = await Promise.all([
          courseService.getActiveCourses(),
          courseService.getActiveMentors(),
          courseService.getSessionReviews()
        ]);

        // Calculate dynamic mentor ratings from reviews
        const mentorsWithRatings = activeMentors.map(mentor => {
          const mId = String(mentor.id).trim();
          const mentorReviews = sessionReviews.filter(r =>
            String(r.mentorId).trim() === mId
          );
          const reviewCount = mentorReviews.length;
          const rating = reviewCount > 0
            ? mentorReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 5;

          return {
            ...mentor,
            rating: Number(rating.toFixed(1)),
            reviewCount
          };
        });

        // Map mentors to their courses
        const coursesWithMentors = activeCourses.map(course => ({
          ...course,
          mentors: mentorsWithRatings.filter(m => m.tags?.includes(course.id))
        }));

        setCourses(coursesWithMentors);
        setReviews(sessionReviews);
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
          const booking = await bookingService.getBookingById(bookingId);
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

    if (status === 'coin_success') {
      refreshUser();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('status');
      newParams.delete('purchaseId');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshUser]);

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

      <div className="relative z-10 bg-background">
        <CoursesListSection
          courses={courses}
          onSelectCourse={handleSelectCourse}
          user={user}
          isAuthenticated={isAuthenticated}
          onBuyCoins={() => setIsCoinModalOpen(true)}
        />
        <ReviewSlider reviews={reviews} />
      </div>

      <CoinPackagesModal
        isOpen={isCoinModalOpen}
        onClose={() => setIsCoinModalOpen(false)}
      />

      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        booking={confirmedBooking}
      />

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

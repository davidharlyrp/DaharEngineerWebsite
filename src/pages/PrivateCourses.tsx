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
  AlertCircle
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { createInvoice } from '@/lib/xendit/client';
import type { Course, CourseCategory, Mentor } from '@/types/courses';

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Geotechnical Engineering',
    slug: 'geotechnical-engineering',
    description: 'Master soil mechanics, foundation design, and geotechnical analysis for various construction projects.',
    fullDescription: 'This comprehensive course covers all aspects of geotechnical engineering including soil classification, bearing capacity analysis, settlement calculations, slope stability, and foundation design. Perfect for engineers looking to specialize in geotechnical work.',
    category: 'geotechnical',
    duration: '20 hours',
    level: 'intermediate',
    price: 1500000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm1',
        name: 'Dr. Ahmad Rizki',
        title: 'Senior Geotechnical Engineer',
        bio: '15+ years experience in geotechnical engineering with expertise in deep foundation and soil improvement.',
        expertise: ['Soil Mechanics', 'Pile Design', 'Slope Stability', 'Ground Improvement'],
        experience: '15+ years',
        rating: 4.9,
        reviewCount: 127,
        availability: [
          { day: 'Monday', times: ['09:00', '14:00', '16:00'] },
          { day: 'Wednesday', times: ['10:00', '14:00'] },
          { day: 'Friday', times: ['09:00', '13:00', '15:00'] }
        ],
        hourlyRate: 350000,
        currency: 'IDR',
        isAvailable: true
      },
      {
        id: 'm2',
        name: 'Budi Santoso, ST.',
        title: 'Geotechnical Consultant',
        bio: 'Specialist in soil investigation and foundation design for high-rise buildings.',
        expertise: ['Soil Investigation', 'Shallow Foundation', 'Retaining Walls', 'Earthworks'],
        experience: '10 years',
        rating: 4.7,
        reviewCount: 89,
        availability: [
          { day: 'Tuesday', times: ['09:00', '11:00', '14:00'] },
          { day: 'Thursday', times: ['10:00', '13:00', '16:00'] }
        ],
        hourlyRate: 280000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Soil Classification and Properties',
      'Soil Compaction and Stabilization',
      'Bearing Capacity Analysis',
      'Settlement Calculations',
      'Deep Foundation Design',
      'Slope Stability Analysis',
      'Retaining Wall Design',
      'Ground Improvement Techniques'
    ],
    whatYouWillLearn: [
      'Analyze soil properties and classify soil types',
      'Design various types of foundations',
      'Calculate bearing capacity and settlement',
      'Perform slope stability analysis',
      'Select appropriate ground improvement methods'
    ],
    isActive: true,
    created: '2024-01-15',
    updated: '2024-11-20'
  },
  {
    id: '2',
    name: 'Structural Analysis & Design',
    slug: 'structural-analysis-design',
    description: 'Learn structural analysis methods and design principles for buildings and infrastructure.',
    fullDescription: 'Comprehensive training in structural engineering covering analysis methods, design codes, and practical applications. Includes hands-on exercises with industry-standard software.',
    category: 'structural',
    duration: '30 hours',
    level: 'advanced',
    price: 2000000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm3',
        name: 'David Prabudhi',
        title: 'Lead Structural Engineer',
        bio: 'Founder of Dahar Engineer with expertise in structural analysis and building design.',
        expertise: ['Structural Analysis', 'ETABS', 'SAP2000', 'Concrete Design', 'Steel Design'],
        experience: '12 years',
        rating: 5.0,
        reviewCount: 234,
        availability: [
          { day: 'Monday', times: ['10:00', '14:00'] },
          { day: 'Tuesday', times: ['09:00', '13:00'] },
          { day: 'Thursday', times: ['10:00', '14:00', '16:00'] }
        ],
        hourlyRate: 450000,
        currency: 'IDR',
        isAvailable: true
      },
      {
        id: 'm4',
        name: 'Sarah Wijaya, ST., MT.',
        title: 'Structural Design Specialist',
        bio: 'Expert in seismic design and high-rise building structural systems.',
        expertise: ['Seismic Design', 'High-Rise Structures', 'Performance-Based Design', 'ETABS'],
        experience: '8 years',
        rating: 4.8,
        reviewCount: 156,
        availability: [
          { day: 'Wednesday', times: ['09:00', '11:00', '14:00'] },
          { day: 'Friday', times: ['10:00', '13:00'] }
        ],
        hourlyRate: 380000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Structural Analysis Fundamentals',
      'Load Calculations (Dead, Live, Wind, Seismic)',
      'Concrete Structure Design',
      'Steel Structure Design',
      'Seismic Design Principles',
      'ETABS Modeling and Analysis',
      'Foundation Design Integration',
      'Structural Detailing'
    ],
    whatYouWillLearn: [
      'Perform structural analysis using various methods',
      'Design reinforced concrete and steel structures',
      'Apply seismic design principles',
      'Use ETABS for modeling and analysis',
      'Create structural drawings and details'
    ],
    isActive: true,
    created: '2024-02-01',
    updated: '2024-11-15'
  },
  {
    id: '3',
    name: 'Transportation Engineering',
    slug: 'transportation-engineering',
    description: 'Study highway design, traffic engineering, and transportation infrastructure planning.',
    fullDescription: 'Complete course on transportation engineering covering geometric design, pavement design, traffic analysis, and transportation planning. Essential for infrastructure engineers.',
    category: 'transportation',
    duration: '25 hours',
    level: 'intermediate',
    price: 1800000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm5',
        name: 'Ir. Hendra Kusuma',
        title: 'Transportation Engineer',
        bio: 'Expert in highway design and traffic engineering with extensive project experience.',
        expertise: ['Highway Design', 'Traffic Engineering', 'Pavement Design', 'Transport Planning'],
        experience: '18 years',
        rating: 4.8,
        reviewCount: 98,
        availability: [
          { day: 'Monday', times: ['13:00', '15:00'] },
          { day: 'Wednesday', times: ['09:00', '14:00'] },
          { day: 'Friday', times: ['10:00', '13:00'] }
        ],
        hourlyRate: 320000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Highway Geometric Design',
      'Horizontal and Vertical Alignment',
      'Intersection Design',
      'Pavement Design and Materials',
      'Traffic Engineering Fundamentals',
      'Transportation Planning',
      'Road Safety Engineering'
    ],
    whatYouWillLearn: [
      'Design highway geometry and alignments',
      'Calculate pavement thickness requirements',
      'Analyze traffic flow and capacity',
      'Plan transportation infrastructure',
      'Apply road safety principles'
    ],
    isActive: true,
    created: '2024-03-10',
    updated: '2024-10-20'
  },
  {
    id: '4',
    name: 'Project Management',
    slug: 'project-management',
    description: 'Learn construction project management from planning to execution and control.',
    fullDescription: 'Comprehensive project management course tailored for construction professionals. Covers planning, scheduling, cost control, quality management, and risk management.',
    category: 'project-management',
    duration: '20 hours',
    level: 'all-levels',
    price: 1600000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm6',
        name: 'Diana Putri, MBA',
        title: 'Project Management Professional',
        bio: 'Certified PMP with extensive experience managing large-scale construction projects.',
        expertise: ['Project Planning', 'Scheduling', 'Cost Control', 'Risk Management', 'Agile'],
        experience: '14 years',
        rating: 4.9,
        reviewCount: 145,
        availability: [
          { day: 'Tuesday', times: ['09:00', '11:00', '14:00'] },
          { day: 'Thursday', times: ['10:00', '13:00', '15:00'] },
          { day: 'Saturday', times: ['09:00', '11:00'] }
        ],
        hourlyRate: 400000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Project Management Fundamentals',
      'Project Planning and Scheduling',
      'Cost Estimation and Budgeting',
      'Resource Management',
      'Quality Management',
      'Risk Management',
      'Contract Management',
      'Project Monitoring and Control'
    ],
    whatYouWillLearn: [
      'Create comprehensive project plans',
      'Develop and manage project schedules',
      'Control project costs and budget',
      'Manage project risks effectively',
      'Lead project teams successfully'
    ],
    isActive: true,
    created: '2024-04-05',
    updated: '2024-09-15'
  },
  {
    id: '5',
    name: 'SketchUp for Engineers',
    slug: 'sketchup-for-engineers',
    description: 'Master SketchUp for 3D modeling, visualization, and presentation of engineering designs.',
    fullDescription: 'Learn to use SketchUp effectively for engineering visualization. From basic modeling to advanced rendering and presentation techniques.',
    category: 'sketchup',
    duration: '15 hours',
    level: 'beginner',
    price: 1200000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm7',
        name: 'Rudi Hartono',
        title: '3D Visualization Specialist',
        bio: 'Expert in SketchUp and 3D visualization for architectural and engineering projects.',
        expertise: ['SketchUp', '3D Modeling', 'Rendering', 'Visualization', 'V-Ray'],
        experience: '10 years',
        rating: 4.8,
        reviewCount: 112,
        availability: [
          { day: 'Monday', times: ['14:00', '16:00'] },
          { day: 'Wednesday', times: ['10:00', '13:00'] },
          { day: 'Friday', times: ['09:00', '11:00', '14:00'] }
        ],
        hourlyRate: 250000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'SketchUp Interface and Tools',
      'Basic 3D Modeling',
      'Advanced Modeling Techniques',
      'Components and Dynamic Components',
      'Materials and Textures',
      'Lighting and Rendering',
      'Scene Creation and Animation',
      'Presentation Techniques'
    ],
    whatYouWillLearn: [
      'Create detailed 3D models',
      'Apply materials and textures',
      'Set up lighting for rendering',
      'Create professional presentations',
      'Export models for various uses'
    ],
    isActive: true,
    created: '2024-05-20',
    updated: '2024-08-25'
  },
  {
    id: '6',
    name: 'Tekla Structures',
    slug: 'tekla-structures',
    description: 'Learn Tekla Structures for detailed steel and concrete structural modeling.',
    fullDescription: 'Comprehensive Tekla Structures training for structural engineers. Covers modeling, detailing, and documentation for steel and concrete structures.',
    category: 'tekla',
    duration: '25 hours',
    level: 'intermediate',
    price: 2200000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm8',
        name: 'Andi Wijaya',
        title: 'Tekla Specialist',
        bio: 'Certified Tekla trainer with extensive experience in steel and concrete detailing.',
        expertise: ['Tekla Structures', 'Steel Detailing', 'Concrete Detailing', 'BIM', 'Clash Detection'],
        experience: '12 years',
        rating: 4.9,
        reviewCount: 167,
        availability: [
          { day: 'Tuesday', times: ['09:00', '13:00', '15:00'] },
          { day: 'Thursday', times: ['10:00', '14:00'] },
          { day: 'Saturday', times: ['09:00', '11:00'] }
        ],
        hourlyRate: 420000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Tekla Interface and Setup',
      'Grid and Level Creation',
      'Steel Modeling',
      'Concrete Modeling',
      'Connection Design',
      'Drawing Creation',
      'Report and Schedule',
      'BIM Collaboration'
    ],
    whatYouWillLearn: [
      'Create accurate 3D structural models',
      'Generate fabrication drawings',
      'Create material schedules',
      'Perform clash detection',
      'Collaborate using BIM workflows'
    ],
    isActive: true,
    created: '2024-06-15',
    updated: '2024-07-30'
  },
  {
    id: '7',
    name: 'Revit Structure',
    slug: 'revit-structure',
    description: 'Master Revit for structural modeling, analysis integration, and documentation.',
    fullDescription: 'Complete Revit Structure course from basics to advanced. Learn to create parametric structural models, integrate with analysis software, and produce construction documents.',
    category: 'revit',
    duration: '30 hours',
    level: 'all-levels',
    price: 1900000,
    currency: 'IDR',
    mentors: [
      {
        id: 'm9',
        name: 'Maya Sari, ST.',
        title: 'BIM Specialist',
        bio: 'Revit certified professional with expertise in structural modeling and BIM implementation.',
        expertise: ['Revit Structure', 'BIM', 'Parametric Modeling', 'Family Creation', 'Dynamo'],
        experience: '9 years',
        rating: 4.9,
        reviewCount: 198,
        availability: [
          { day: 'Monday', times: ['09:00', '11:00', '14:00'] },
          { day: 'Wednesday', times: ['10:00', '13:00', '15:00'] },
          { day: 'Friday', times: ['09:00', '12:00'] }
        ],
        hourlyRate: 380000,
        currency: 'IDR',
        isAvailable: true
      },
      {
        id: 'm10',
        name: 'Fajar Pratama',
        title: 'Structural BIM Engineer',
        bio: 'Specialist in Revit Structure with focus on large-scale projects and automation.',
        expertise: ['Revit Structure', 'Dynamo', 'API', 'Automation', 'BIM Management'],
        experience: '7 years',
        rating: 4.7,
        reviewCount: 134,
        availability: [
          { day: 'Tuesday', times: ['10:00', '14:00'] },
          { day: 'Thursday', times: ['09:00', '11:00', '15:00'] }
        ],
        hourlyRate: 320000,
        currency: 'IDR',
        isAvailable: true
      }
    ],
    syllabus: [
      'Revit Interface and Navigation',
      'Levels, Grids, and Views',
      'Structural Columns and Beams',
      'Floors and Foundations',
      'Reinforcement Modeling',
      'Family Creation',
      'Dynamo for Automation',
      'Analysis Integration',
      'Documentation and Scheduling'
    ],
    whatYouWillLearn: [
      'Create parametric structural models',
      'Build custom Revit families',
      'Use Dynamo for automation',
      'Integrate with analysis software',
      'Generate construction documents'
    ],
    isActive: true,
    created: '2024-02-20',
    updated: '2024-11-10'
  }
];

const categoryNames: Record<CourseCategory, string> = {
  'geotechnical': 'Geotechnical',
  'structural': 'Structural',
  'transportation': 'Transportation',
  'project-management': 'Project Management',
  'sketchup': 'SketchUp',
  'tekla': 'Tekla',
  'revit': 'Revit'
};

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

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
            <div className="w-14 h-14 bg-army-700/20 flex items-center justify-center
                            group-hover:bg-army-700 transition-colors">
              <GraduationCap className="w-7 h-7 text-army-400 group-hover:text-white transition-colors" />
            </div>
            <Badge variant="outline" className="text-xs uppercase">
              {course.level}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-army-400 transition-colors">
            {course.name}
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
              {course.mentors.length} mentor{course.mentors.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Starting from</span>
              <p className="text-lg font-bold text-army-400">
                Rp {Math.min(...course.mentors.map(m => m.hourlyRate)).toLocaleString('id-ID')}
                <span className="text-sm font-normal text-muted-foreground">/hour</span>
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

// Mentor Card Component
function MentorCard({ mentor, onBook }: { mentor: Mentor; onBook: (mentor: Mentor) => void }) {
  return (
    <div className="bg-background border border-border/30 p-6 hover:border-army-500/30 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-army-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold">{mentor.name}</h4>
          <p className="text-sm text-muted-foreground">{mentor.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">{mentor.rating}</span>
            <span className="text-sm text-muted-foreground">({mentor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {mentor.bio}
      </p>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Expertise</p>
        <div className="flex flex-wrap gap-1">
          {mentor.expertise.slice(0, 4).map((exp, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-secondary">
              {exp}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div>
          <span className="text-xs text-muted-foreground">Rate</span>
          <p className="font-semibold text-army-400">
            Rp {mentor.hourlyRate.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-muted-foreground">/hour</span>
          </p>
        </div>
        <Button
          onClick={() => onBook(mentor)}
          className="bg-army-700 hover:bg-army-600"
        >
          Book Session
        </Button>
      </div>
    </div>
  );
}

// Booking Modal Component
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
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    duration: '2',
    notes: ''
  });

  const availableTimes = mentor.availability.flatMap(a => a.times);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=/private-courses`;
        return;
      }

      const totalAmount = mentor.hourlyRate * parseInt(formData.duration);

      // Create Xendit invoice
      const invoice = await createInvoice({
        external_id: `booking-${course.id}-${mentor.id}-${Date.now()}`,
        amount: totalAmount,
        payer_email: user?.email || '',
        description: `Private Course: ${course.name} with ${mentor.name}`,
        success_redirect_url: `${window.location.origin}/dashboard`,
        failure_redirect_url: `${window.location.origin}/private-courses`,
        customer: {
          given_names: user?.name || '',
          email: user?.email || '',
        }
      });

      // Open payment page
      window.open(invoice.invoice_url, '_blank');

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
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
              {course.name} with {mentor.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Booking Initiated!</h3>
              <p className="text-muted-foreground">
                Please complete your payment. You will be redirected to dashboard.
              </p>
            </div>
          ) : (
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
                    <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {mentor.rating}
                  </span>
                  <span className="text-muted-foreground">
                    Rp {mentor.hourlyRate.toLocaleString('id-ID')}/hour
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="pl-10 bg-background"
                  />
                </div>
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
                <p className="text-xs text-muted-foreground">
                  Available times based on mentor's schedule
                </p>
              </div>

              {/* Duration */}
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

              {/* Total */}
              <div className="bg-army-700/10 p-4 border border-army-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-army-400">
                    Rp {(mentor.hourlyRate * parseInt(formData.duration)).toLocaleString('id-ID')}
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
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Course Detail Section
function CourseDetailSection({
  course,
  onBack,
  onBook
}: {
  course: Course;
  onBack: () => void;
  onBook: (mentor: Mentor) => void;
}) {
  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <SectionReveal>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Courses
            </button>
          </SectionReveal>

          {/* Course Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <SectionReveal>
              <div>
                <Badge className="mb-4 bg-army-700">{categoryNames[course.category]}</Badge>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">{course.name}</h2>
                <p className="text-lg text-muted-foreground mb-6">{course.fullDescription}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-army-400" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-army-400" />
                    {course.level}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-army-400" />
                    {course.mentors.length} mentor{course.mentors.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <div className="bg-secondary/30 p-6">
                <h3 className="text-lg font-semibold mb-4">What You Will Learn</h3>
                <ul className="space-y-2">
                  {course.whatYouWillLearn?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-army-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          </div>

          {/* Syllabus */}
          <SectionReveal delay={0.2}>
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Course Syllabus</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.syllabus?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-secondary/30">
                    <span className="w-6 h-6 bg-army-700/20 flex items-center justify-center text-sm font-medium text-army-400 flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Mentors */}
          <SectionReveal delay={0.3}>
            <div>
              <h3 className="text-2xl font-bold mb-6">Available Mentors</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {course.mentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onBook={onBook}
                  />
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Courses List Section
function CoursesListSection({ onSelectCourse }: { onSelectCourse: (course: Course) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockCourses.map(c => c.category)));

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
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-army-700' : ''}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-army-700' : ''}
                  >
                    {categoryNames[cat]}
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

// Main Private Courses Page
export default function PrivateCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  const handleBook = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        {selectedCourse ? (
          <CourseDetailSection
            course={selectedCourse}
            onBack={handleBack}
            onBook={handleBook}
          />
        ) : (
          <>
            <CoursesListSection onSelectCourse={handleSelectCourse} />
            <StatsSection />
          </>
        )}
      </div>

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

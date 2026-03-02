import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  GraduationCap,
  Users,
  Clock,
  Award,
  PlayCircle,
  CheckCircle2,
  Star
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';

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
        className="fixed inset-0 flex items-center justify-center z-0"
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
              EDUCATION
            </span>
          </motion.div>

          <TextReveal
            text="Learn from"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="the Experts"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Course Types Section
function CourseTypesSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                Learning Options
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Choose Your Path
              </h2>
            </SectionReveal>
            <LineReveal delay={0.2} className="max-w-md" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Online Courses */}
            <SectionReveal delay={0.2}>
              <div className="h-full p-8 lg:p-12 bg-secondary/30 hover:bg-secondary/50 
                              transition-colors duration-300">
                <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center mb-6">
                  <PlayCircle className="w-8 h-8 text-army-400" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold mb-4">Online Courses</h3>
                <p className="text-muted-foreground mb-8">
                  Self-paced learning with lifetime access. Perfect for busy professionals 
                  who want to learn at their own schedule.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'On-demand video lessons',
                    'Downloadable resources',
                    'Certificate of completion',
                    'Lifetime access',
                    'Community support'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-army-400 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/courses/online"
                  className="group inline-flex items-center gap-2 text-army-400 
                             hover:text-army-300 font-medium transition-colors"
                >
                  Browse Online Courses
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </SectionReveal>

            {/* Private Courses */}
            <SectionReveal delay={0.3}>
              <div className="h-full p-8 lg:p-12 bg-secondary/30 hover:bg-secondary/50 
                              transition-colors duration-300">
                <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-army-400" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold mb-4">Private Courses</h3>
                <p className="text-muted-foreground mb-8">
                  Personalized one-on-one training tailored to your specific needs 
                  and learning goals.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'One-on-one mentoring',
                    'Custom curriculum',
                    'Hands-on practice',
                    'Flexible scheduling',
                    'Direct feedback'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-army-400 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/courses/private"
                  className="group inline-flex items-center gap-2 text-army-400 
                             hover:text-army-300 font-medium transition-colors"
                >
                  Book Private Session
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Courses Section
function FeaturedCoursesSection() {
  const courses = [
    {
      title: 'Revit Structural Beginner',
      description: 'Master the fundamentals of structural modeling in Revit.',
      duration: '20 hours',
      level: 'Beginner',
      students: 150,
      rating: 4.9,
      price: 'Rp 899.000',
      image: 'revit'
    },
    {
      title: 'ETABS Advanced Analysis',
      description: 'Advanced structural analysis and design using ETABS.',
      duration: '25 hours',
      level: 'Advanced',
      students: 89,
      rating: 4.8,
      price: 'Rp 1.299.000',
      image: 'etabs'
    },
    {
      title: 'Geotechnical Engineering',
      description: 'Soil mechanics and foundation design principles.',
      duration: '18 hours',
      level: 'Intermediate',
      students: 120,
      rating: 4.7,
      price: 'Rp 799.000',
      image: 'geotech'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Featured
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Popular Courses
                </h2>
              </SectionReveal>
            </div>
            <SectionReveal delay={0.2}>
              <Link
                to="/courses/online"
                className="group inline-flex items-center gap-2 text-army-400 
                           hover:text-army-300 font-medium transition-colors mt-4 lg:mt-0"
              >
                View All Courses
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </SectionReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <SectionReveal key={course.title} delay={0.1 * (index + 1)}>
                <div className="group h-full bg-background border border-border/30 
                                hover:border-army-500/30 transition-all duration-300">
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-army-800/20 to-army-900/20 
                                  flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-army-700/40" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {course.level}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-army-400 fill-army-400" />
                          {course.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({course.students})
                        </span>
                      </div>
                      <span className="font-semibold text-army-400">
                        {course.price}
                      </span>
                    </div>
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

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ahmad Rizki',
      role: 'Structural Engineer',
      content: 'The Revit course completely transformed how I approach structural modeling. Highly recommended!',
      course: 'Revit Structural Beginner'
    },
    {
      name: 'Sarah Wijaya',
      role: 'Civil Engineering Student',
      content: 'Clear explanations and practical examples. The private sessions helped me understand complex concepts.',
      course: 'Geotechnical Engineering'
    },
    {
      name: 'Budi Santoso',
      role: 'Project Manager',
      content: 'Great course content with lifetime access. I keep coming back to refresh my knowledge.',
      course: 'ETABS Advanced Analysis'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                Testimonials
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                What Our Students Say
              </h2>
            </SectionReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <SectionReveal key={testimonial.name} delay={0.1 * (index + 1)}>
                <div className="h-full p-6 lg:p-8 bg-secondary/30">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-army-400 fill-army-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-army-700/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-army-400">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-army-400">{testimonial.course}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-army-950">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="w-full px-6 lg:px-20 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Start Learning Today
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join hundreds of engineers who have enhanced their skills through our courses. 
              Your journey to engineering excellence starts here.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/courses/online"
                className="group flex items-center gap-2 px-8 py-4 bg-army-700 
                           hover:bg-army-600 text-white font-medium transition-all duration-300"
              >
                Browse Courses
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border border-army-700/50 hover:border-army-500 
                           font-medium transition-all duration-300"
              >
                Ask a Question
              </Link>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Courses Page
export default function Courses() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <CourseTypesSection />
        <FeaturedCoursesSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </div>
  );
}

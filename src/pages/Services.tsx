import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Calculator, 
  FileText, 
  HardHat,
  GraduationCap,
  Users,
  CheckCircle2
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
            <span className="text-sm text-army-400 font-medium tracking-wide">
              OUR SERVICES
            </span>
          </motion.div>

          <TextReveal
            text="Complete Engineering"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Solutions"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Building Design Service
function BuildingDesignSection() {
  const features = [
    'Structural analysis and design',
    'Reinforced concrete design',
    'Steel structure design',
    'Foundation design',
    'Seismic analysis',
    'Construction drawings',
    'Technical specifications',
    'Design review and optimization'
  ];

  return (
    <section id="building-design" className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <SectionReveal>
                <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Service 01
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Building Design
                </h2>
              </SectionReveal>
              <LineReveal delay={0.3} className="max-w-md mb-8" />
              
              <SectionReveal delay={0.4}>
                <p className="text-lg text-muted-foreground mb-8">
                  Comprehensive structural design services for residential, commercial, 
                  and industrial buildings. We ensure safety, efficiency, and compliance 
                  with all relevant codes and standards.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-army-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-army-700 
                             hover:bg-army-600 text-white font-medium transition-all duration-300"
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SectionReveal>
            </div>

            {/* Visual */}
            <SectionReveal delay={0.3}>
              <div className="aspect-[4/3] bg-gradient-to-br from-army-800/20 to-army-900/20 
                              flex items-center justify-center border border-border/30">
                <div className="text-center p-8">
                  <Building2 className="w-24 h-24 text-army-700/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">Structural Design Excellence</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Engineering Tools Section
function EngineeringToolsSection() {
  const tools = [
    { name: 'DEColumn', desc: 'Column P-M Interaction' },
    { name: 'TerraPile', desc: 'Pile Capacity' },
    { name: 'TerraShallow', desc: 'Foundation Analysis' },
    { name: 'CutPro', desc: 'Cutting Optimization' },
    { name: 'BrickCost', desc: 'Cost Estimation' },
    { name: 'TerraID', desc: 'Soil Database' },
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <SectionReveal className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-px bg-border/30">
                {tools.map((tool) => (
                  <div key={tool.name} 
                       className="p-6 bg-background hover:bg-secondary/50 transition-colors">
                    <Calculator className="w-6 h-6 text-army-400 mb-3" />
                    <h4 className="font-semibold mb-1">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <SectionReveal delay={0.1}>
                <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Service 02
                </span>
              </SectionReveal>
              <SectionReveal delay={0.3}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Engineering Tools
                </h2>
              </SectionReveal>
              <LineReveal delay={0.4} className="max-w-md mb-8" />
              
              <SectionReveal delay={0.5}>
                <p className="text-lg text-muted-foreground mb-8">
                  Access our suite of web-based engineering applications designed to 
                  streamline your calculations and analysis workflows.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <Link
                  to="/software"
                  className="group inline-flex items-center gap-2 text-army-400 
                             hover:text-army-300 font-medium transition-colors"
                >
                  Explore All Tools
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Courses Section
function CoursesSection() {
  const courseTypes = [
    {
      icon: GraduationCap,
      title: 'Online Courses',
      desc: 'Self-paced learning with lifetime access and certificates',
      features: ['On-demand videos', 'Downloadable resources', 'Certificate of completion']
    },
    {
      icon: Users,
      title: 'Private Courses',
      desc: 'Personalized training sessions tailored to your needs',
      features: ['One-on-one mentoring', 'Custom curriculum', 'Hands-on practice']
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                Service 03
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Courses & Training
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enhance your engineering skills with our comprehensive courses 
                designed for professionals and students.
              </p>
            </SectionReveal>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {courseTypes.map((course, index) => {
              const Icon = course.icon;
              return (
                <SectionReveal key={course.title} delay={0.1 * (index + 1)}>
                  <div className="h-full p-8 lg:p-12 bg-secondary/30 hover:bg-secondary/50 
                                  transition-colors duration-300">
                    <div className="w-14 h-14 bg-army-700/20 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-army-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{course.title}</h3>
                    <p className="text-muted-foreground mb-6">{course.desc}</p>
                    <ul className="space-y-2 mb-8">
                      {course.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-army-400 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 text-army-400 hover:text-army-300 
                                 font-medium transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Consultation Section
function ConsultationSection() {
  return (
    <section id="consultation" className="section-fullscreen relative flex items-center bg-army-950">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="w-full px-6 lg:px-20 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <SectionReveal>
                <div className="w-16 h-16 bg-army-700/30 flex items-center justify-center mb-6">
                  <HardHat className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Service 04
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Engineering<br />
                  <span className="text-army-400">Consultation</span>
                </h2>
              </SectionReveal>
              <LineReveal delay={0.3} className="max-w-md mb-8" color="bg-army-500/50" />
              
              <SectionReveal delay={0.4}>
                <p className="text-lg text-muted-foreground mb-8">
                  Get expert advice for your construction projects. Our consultation 
                  services cover structural review, technical problem-solving, and 
                  project guidance.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <div className="space-y-4 mb-8">
                  {[
                    'Structural design review',
                    'Technical problem solving',
                    'Construction supervision',
                    'Quality control',
                    'Project planning assistance'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-army-400" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-army-700 
                             hover:bg-army-600 text-white font-medium transition-all duration-300"
                >
                  Book Consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SectionReveal>
            </div>

            {/* CTA Card */}
            <SectionReveal delay={0.3}>
              <div className="p-8 lg:p-12 bg-army-900/50 border border-army-700/30">
                <h3 className="text-2xl font-semibold mb-4">Ready to discuss your project?</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule a consultation session with our engineering team. 
                  We offer both online and offline consultation options.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-army-400" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-army-400" />
                    <span>Online & offline options</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-army-400" />
                    <span>Detailed documentation</span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Services Page
export default function Services() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <BuildingDesignSection />
        <EngineeringToolsSection />
        <CoursesSection />
        <ConsultationSection />
      </div>
    </div>
  );
}

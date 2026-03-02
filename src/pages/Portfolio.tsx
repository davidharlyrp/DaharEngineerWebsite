import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FolderOpen,
  MapPin,
  Calendar,
  Building2,
  ExternalLink
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
            <FolderOpen className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              OUR WORK
            </span>
          </motion.div>

          <TextReveal
            text="Project"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Portfolio"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Projects Grid Section
function ProjectsSection() {
  const projects = [
    {
      title: 'Residential Complex Design',
      category: 'Building Design',
      location: 'Bandung, West Java',
      year: '2024',
      description: 'Complete structural design for a 5-story residential complex including foundation, columns, beams, and slabs.',
      image: 'residential'
    },
    {
      title: 'Commercial Building Analysis',
      category: 'Structural Analysis',
      location: 'Jakarta',
      year: '2024',
      description: 'ETABS modeling and seismic analysis for a 12-story commercial building.',
      image: 'commercial'
    },
    {
      title: 'Industrial Warehouse',
      category: 'Steel Design',
      location: 'Cikarang, West Java',
      year: '2023',
      description: 'Steel structure design for a large industrial warehouse with crane systems.',
      image: 'warehouse'
    },
    {
      title: 'Soil Investigation Project',
      category: 'Geotechnical',
      location: 'Surabaya, East Java',
      year: '2023',
      description: 'Comprehensive soil investigation and foundation recommendation for high-rise building.',
      image: 'geotech'
    },
    {
      title: 'Bridge Structural Review',
      category: 'Infrastructure',
      location: 'Semarang, Central Java',
      year: '2023',
      description: 'Structural review and load capacity assessment for existing bridge structure.',
      image: 'bridge'
    },
    {
      title: 'Educational Facility',
      category: 'Building Design',
      location: 'Yogyakarta',
      year: '2022',
      description: 'Structural design for a 3-story school building with special seismic considerations.',
      image: 'school'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                Selected Projects
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Our Recent Work
              </h2>
            </SectionReveal>
            <LineReveal delay={0.2} className="max-w-md" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <SectionReveal key={project.title} delay={0.1 * (index + 1)}>
                <div className="group h-full bg-secondary/30 hover:bg-secondary/50 
                                transition-colors duration-300">
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-army-800/20 to-army-900/20 
                                  flex items-center justify-center overflow-hidden">
                    <Building2 className="w-16 h-16 text-army-700/40 group-hover:scale-110 
                                          transition-transform duration-500" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-army-700/20 text-army-400">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.year}
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

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: 'Building Design', count: 25 },
    { name: 'Structural Analysis', count: 18 },
    { name: 'Geotechnical', count: 12 },
    { name: 'Steel Design', count: 8 },
    { name: 'Infrastructure', count: 6 },
    { name: 'Consultation', count: 15 }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Expertise
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Diverse Project<br />
                  <span className="text-muted-foreground">Experience</span>
                </h2>
              </SectionReveal>
              <LineReveal delay={0.2} className="max-w-md mb-8" />
              
              <SectionReveal delay={0.3}>
                <p className="text-lg text-muted-foreground mb-8">
                  From residential buildings to industrial facilities, we have 
                  delivered successful projects across various sectors and scales.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 text-army-400 
                             hover:text-army-300 font-medium transition-colors"
                >
                  Explore Our Services
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SectionReveal>
            </div>

            {/* Categories */}
            <div className="space-y-px bg-border/30">
              {categories.map((category, index) => (
                <SectionReveal key={category.name} delay={0.1 * (index + 1)}>
                  <div className="flex items-center justify-between p-6 bg-background 
                                  hover:bg-secondary/50 transition-colors duration-300">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {category.count} projects
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '30+', label: 'Happy Clients' },
              { value: '6', label: 'Years Experience' },
              { value: '100%', label: 'Client Satisfaction' }
            ].map((stat, index) => (
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

// CTA Section
function CTASection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-army-950">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="w-full px-6 lg:px-20 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Have a Project in Mind?
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Let us help you bring your vision to life. Contact us to discuss 
              your project requirements and get a customized solution.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-army-700 
                         hover:bg-army-600 text-white font-medium transition-all duration-300"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Portfolio Page
export default function Portfolio() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <ProjectsSection />
        <CategoriesSection />
        <StatsSection />
        <CTASection />
      </div>
    </div>
  );
}

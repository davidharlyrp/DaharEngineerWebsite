import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  ChevronDown,
  Code,
  Store
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';

// Hero Section dengan fixed effect
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={ref} className="relative h-screen">
      <motion.div
        style={{ opacity, scale, y }}
        className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none"
      >

        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise" />

        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />



        {/* Content */}
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

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-army-500/30 
                       bg-army-500/10 mb-8"
          >
            <span className="w-2 h-2 bg-army-500 animate-pulse" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              CIVIL ENGINEERING CONSULTANT
            </span>
          </motion.div>

          {/* Main title */}
          <div className="mb-6">
            <TextReveal
              text="DAHAR"
              tag="h1"
              className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter leading-none"
              delay={0.3}
            />
            <TextReveal
              text="ENGINEER"
              tag="h1"
              className="text-7xl sm:text-8xl lg:text-9xl font-light tracking-tighter leading-none 
                         text-muted-foreground"
              delay={0.5}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Complete construction solutions from planning, building design,
            courses, to software and resources for developing your engineering career.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/services"
              className="group flex items-center gap-2 px-8 py-4 bg-army-700 hover:bg-army-600 
                         text-white font-medium transition-all duration-300"
            >
              Explore Services
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-border/50 hover:border-army-500 
                         font-medium transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
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

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: Building2,
      title: 'Building Design',
      description: 'Structural analysis and design for residential, commercial, and industrial buildings.',
      link: '/services#building-design'
    },
    {
      icon: Code,
      title: 'Software',
      description: 'Web-based software for civil engineering calculations and analysis. Access it from anywhere, anytime.',
      link: '/software'
    },
    {
      icon: GraduationCap,
      title: 'Courses & Consultation',
      description: 'Private and online courses for civil engineering professionals and students.',
      link: '/courses'
    },
    {
      icon: Store,
      title: 'Digital Product',
      description: 'Various digital products for civil engineering, such as spreadsheets, templates, and more.',
      link: '/store'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        {/* Section header */}
        <div className="max-w-7xl mx-auto mb-16">
          <SectionReveal>
            <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
              What We Offer
            </span>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Our Services
            </h2>
          </SectionReveal>
          <LineReveal delay={0.2} className="max-w-md" />
        </div>

        {/* Services grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/30">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <SectionReveal key={service.title} delay={0.1 * (index + 1)}>
                  <Link
                    to={service.link}
                    className="group block p-8 lg:p-12 bg-background hover:bg-secondary/50 
                               transition-colors duration-500"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center
                                      group-hover:bg-army-700 transition-colors duration-500">
                        <Icon className="w-6 h-6 text-army-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl lg:text-2xl font-semibold mb-3 
                                       group-hover:text-army-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-medium
                                         group-hover:gap-3 transition-all">
                          Learn more
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Software Section
function SoftwareSection() {
  const software = [
    { name: 'DEColumn', desc: 'Column Interaction P-M Diagram', isNew: true },
    { name: 'TerraPile', desc: 'Pile Bearing Capacity Analysis', isNew: false },
    { name: 'TerraShallow', desc: 'Shallow Foundation Analysis', isNew: false },
    { name: 'CutPro', desc: 'Cutting List Optimization', isNew: true },
    { name: 'BrickCost', desc: 'Project Cost Estimation', isNew: false },
    { name: 'TerraID', desc: 'Indonesia Soil Database', isNew: false },
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Web Applications
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Engineering<br />
                  <span className="text-muted-foreground">Software</span>
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Powerful web-based tools designed for civil engineers.
                  Analyze, calculate, and optimize your projects with precision.
                </p>
              </SectionReveal>
              <SectionReveal delay={0.3}>
                <Link
                  to="/software"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-army-700 
                             hover:bg-army-600 text-white font-medium transition-all duration-300"
                >
                  Explore All Apps
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SectionReveal>
            </div>

            {/* Right - Software list */}
            <div className="space-y-px bg-border/30">
              {software.map((app, index) => (
                <SectionReveal key={app.name} delay={0.1 * (index + 1)}>
                  <Link
                    to={`/software/${app.name.toLowerCase()}`}
                    className="group flex items-center justify-between p-6 bg-background 
                               hover:bg-secondary/50 transition-colors duration-300"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold group-hover:text-army-400 transition-colors">
                          {app.name}
                        </h3>
                        {app.isNew && (
                          <span className="px-2 py-0.5 text-xs bg-army-700 text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{app.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground 
                                           group-hover:text-army-400 group-hover:translate-x-1 
                                           transition-all" />
                  </Link>
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
  const stats = [
    { value: '50+', label: 'Projects Completed' },
    { value: '1000+', label: 'Students Trained' },
    { value: '6', label: 'Software Tools' },
    { value: '3+', label: 'Years Experience' },
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px bg-border/30 order-2 lg:order-1">
              {stats.map((stat, index) => (
                <SectionReveal key={stat.label} delay={0.1 * (index + 1)}>
                  <div className="p-8 lg:p-12 bg-background">
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

            {/* Content */}
            <div className="order-1 lg:order-2">
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Our Impact
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Trusted by Engineers<br />
                  <span className="text-muted-foreground">Across Indonesia</span>
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <p className="text-lg text-muted-foreground mb-8">
                  From small residential projects to large commercial developments,
                  we have helped engineers and contractors deliver successful projects
                  with our expertise and innovative tools.
                </p>
              </SectionReveal>
              <SectionReveal delay={0.3}>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-army-400 hover:text-army-300 
                             font-medium transition-colors"
                >
                  View Our Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SectionReveal>
            </div>
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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ready to Start Your<br />
              <span className="text-army-400">Next Project?</span>
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Whether you need structural design, engineering consultation, or
              want to enhance your skills through our courses, we are here to help.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group flex items-center gap-2 px-8 py-4 bg-army-700 hover:bg-army-600 
                           text-white font-medium transition-all duration-300"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border border-army-700/50 hover:border-army-500 
                           font-medium transition-all duration-300"
              >
                Learn More About Us
              </Link>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="relative">
      {/* Hero with fixed effect */}
      <HeroSection />

      {/* Spacer for hero */}
      <div className="h-screen" />

      {/* Content sections */}
      <div className="relative z-10 bg-background">
        <ServicesSection />
        <SoftwareSection />
        <StatsSection />
        <CTASection />
      </div>
    </div>
  );
}

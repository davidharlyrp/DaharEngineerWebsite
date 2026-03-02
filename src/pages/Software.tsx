import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight,
  Calculator,
  Database,
  Layers,
  Box,
  Ruler,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';

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
            <Sparkles className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              WEB APPLICATIONS
            </span>
          </motion.div>

          <TextReveal
            text="Engineering"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Software Suite"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Software Card Component
function SoftwareCard({ 
  software, 
  index 
}: { 
  software: {
    name: string;
    description: string;
    category: string;
    icon: React.ElementType;
    isNew?: boolean;
    url: string;
  };
  index: number;
}) {
  const Icon = software.icon;
  
  return (
    <SectionReveal delay={0.1 * (index + 1)}>
      <a
        href={software.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full p-6 lg:p-8 bg-secondary/30 hover:bg-secondary/50 
                   border border-transparent hover:border-army-500/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center
                          group-hover:bg-army-700 transition-colors duration-300">
            <Icon className="w-6 h-6 text-army-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            {software.isNew && (
              <span className="px-2 py-1 text-xs bg-army-700 text-white">NEW</span>
            )}
            <ArrowUpRight className="w-5 h-5 text-muted-foreground 
                                      group-hover:text-army-400 group-hover:translate-x-0.5 
                                      group-hover:-translate-y-0.5 transition-all" />
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          {software.category}
        </span>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-army-400 transition-colors">
          {software.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {software.description}
        </p>
      </a>
    </SectionReveal>
  );
}

// All Software Section
function AllSoftwareSection() {
  const software = [
    {
      name: 'DEColumn',
      description: 'Web-based application for analyzing column interaction P-M diagrams with comprehensive visualization.',
      category: 'Structural Analysis',
      icon: Box,
      isNew: true,
      url: 'https://decolumn.daharengineer.com'
    },
    {
      name: 'TerraPile',
      description: 'Calculate pile bearing capacity with various methods including static and dynamic analysis.',
      category: 'Geotechnical',
      icon: Database,
      isNew: false,
      url: 'https://terrapile.daharengineer.com'
    },
    {
      name: 'TerraShallow',
      description: 'Analyze shallow foundation bearing capacity and settlement for different soil conditions.',
      category: 'Geotechnical',
      icon: Layers,
      isNew: false,
      url: 'https://terrashallow.daharengineer.com'
    },
    {
      name: 'CutPro',
      description: 'Optimize your cutting list for bars and sheets to minimize waste and reduce costs.',
      category: 'Optimization',
      icon: Ruler,
      isNew: true,
      url: 'https://cutpro.daharengineer.com'
    },
    {
      name: 'BrickCost',
      description: 'Estimate project costs with detailed material and labor calculations.',
      category: 'Estimation',
      icon: Calculator,
      isNew: false,
      url: 'https://brickcost.daharengineer.com'
    },
    {
      name: 'TerraID',
      description: 'Interactive platform for Indonesia soil database with comprehensive soil parameters.',
      category: 'Database',
      icon: Database,
      isNew: false,
      url: 'https://terraid.daharengineer.com'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                All Applications
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Our Software
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Powerful web-based tools designed to simplify complex engineering 
                calculations and streamline your workflow.
              </p>
            </SectionReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
            {software.map((item, index) => (
              <SoftwareCard key={item.name} software={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: 'Web-Based',
      desc: 'No installation required. Access from any device with a web browser.',
      icon: Layers
    },
    {
      title: 'Cloud Storage',
      desc: 'Save and access your projects from anywhere, anytime.',
      icon: Database
    },
    {
      title: 'Accurate Calculations',
      desc: 'Built on proven engineering formulas and standards.',
      icon: Calculator
    },
    {
      title: 'Export Options',
      desc: 'Download results in various formats including PDF and Excel.',
      icon: FileSpreadsheet
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionReveal>
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                Why Choose Our Tools
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Built for Engineers
              </h2>
            </SectionReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <SectionReveal key={feature.title} delay={0.1 * (index + 1)}>
                  <div className="text-center p-6">
                    <div className="w-14 h-14 bg-army-700/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-army-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
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

// CTA Section
function CTASection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-army-950">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="w-full px-6 lg:px-20 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Need a Custom Solution?
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              We develop custom engineering software tailored to your specific needs. 
              Contact us to discuss your requirements.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-army-700 
                         hover:bg-army-600 text-white font-medium transition-all duration-300"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Software Page
export default function Software() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <AllSoftwareSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
}

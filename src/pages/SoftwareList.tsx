import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Code2,
  ArrowRight,
  Layers,
  Box,
  ChevronDown,
  Layout,
  Cpu,
  MousePointer2,
  Loader2,
  Construction
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { softwareService } from '@/services/pb/software';
import { SEO } from '@/components/seo/SEO';
import type { Software, SoftwareCategory } from '@/types/software';

// Category definitions with icons
const categoryConfig: Record<SoftwareCategory, { icon: React.ElementType; label: string; color: string }> = {
  'Geotechnical': { icon: Layers, label: 'Geotechnical', color: 'text-amber-400' },
  'Structural': { icon: Box, label: 'Structural', color: 'text-blue-400' },
  'Project Management': { icon: Layout, label: 'Project Management', color: 'text-emerald-400' },
  'Productivity': { icon: Cpu, label: 'Productivity', color: 'text-purple-400' }
};

const categories: (SoftwareCategory | 'All')[] = ['All', 'Geotechnical', 'Structural', 'Project Management', 'Productivity'];

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
            <Code2 className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              SOFTWARE SUITE
            </span>
          </motion.div>

          <TextReveal
            text="Engineering"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Applications"
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
            A curated ecosystem of digital tools built to empower the modern engineer.
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

// Organic Software Item Component
function SoftwareItem({ software }: { software: Software }) {
  const config = categoryConfig[software.category] || { icon: Box, color: 'text-muted-foreground' };
  const Icon = config.icon;
  const logoUrl = software.logo ? softwareService.getFileUrl(software, software.logo) : null;

  const handleVisit = () => {
    if (software.link) {
      window.open(software.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <SectionReveal>
      <div
        onClick={handleVisit}
        className="group relative py-12 border-b border-border/50 hover:bg-secondary/5 transition-all duration-500 cursor-pointer"
      >
        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-16">
          <div className="flex flex-col sm:flex-row gap-8 flex-1">
            {/* Logo */}
            {logoUrl && (
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-background border border-border/50 rounded-lg overflow-hidden p-3 group-hover:border-army-500/50 transition-all duration-500">
                <img
                  src={logoUrl}
                  alt={`${software.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <span className={`text-xs uppercase tracking-[0.2em] font-medium ${config.color}`}>
                  {software.category}
                </span>
                <div className="h-px w-8 bg-border group-hover:w-12 transition-all duration-500" />
                {software.isMaintain && (
                  <span className="text-[10px] bg-army-500/10 text-army-400 px-2 py-0.5 border border-army-500/20">
                    DEVELOPING
                  </span>
                )}
              </div>

              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight group-hover:italic group-hover:translate-x-2 transition-all duration-500">
                {software.name}
              </h3>

              <p className="text-muted-foreground text-lg max-w-2xl group-hover:text-foreground transition-colors">
                {software.description}
              </p>
            </div>
          </div>

          {/* Action & Meta */}
          <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-6 min-w-[200px]">
            <div className="flex items-center gap-6 text-sm text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{software.version || '1.0.0'}</span>
              </div>
              {software.isMaintain && (
                <div className="flex items-center gap-2 animate-pulse text-amber-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>MAINTENANCE</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="group/btn h-auto p-0 hover:bg-transparent text-army-400 hover:text-army-300 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleVisit(); }}
            >
              <span className="text-lg font-medium pr-2">Launch App</span>
              <div className="w-10 h-10 rounded-full border border-army-500/30 flex items-center justify-center group-hover/btn:bg-army-500 group-hover/btn:text-white transition-all">
                <MousePointer2 className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>

        {/* Hover Background Pattern */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
          <Icon className="w-64 h-64 rotate-12" />
        </div>
      </div>
    </SectionReveal>
  );
}

// Main Software Page
export default function SoftwareList() {
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const data = await softwareService.getSoftwares();
        setSoftwares(data);
      } catch (error) {
        console.error('Failed to fetch softwares:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSoftwares();
  }, []);

  const filteredSoftwares = selectedCategory === 'All'
    ? softwares
    : softwares.filter(s => s.category === selectedCategory);

  return (
    <div className="relative">
      <SEO
        title="Engineering Software Suite | Dahar Engineer"
        description="A curated ecosystem of digital tools built to empower the modern engineer in geotechnical, structural, and productivity flows."
        url="https://daharengineer.com/software"
        keywords="civil engineering software, geotechnical software, structural software, civil engineering apps, dahar engineer, teknik sipil, software, aplikasi, geoteknik, struktur, aplikasi teknik sipil, software teknik sipil"
      />
      <HeroSection />
      <div className="h-screen" />

      <div className="relative z-10 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-32">
          {/* Header & Filter */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
            <div className="space-y-4">
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-widest block">
                  Interactive Tools
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter">
                  The Suite.
                </h2>
              </SectionReveal>
            </div>

            <SectionReveal delay={0.2}>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 text-xs uppercase tracking-widest border transition-all duration-300
                      ${selectedCategory === cat
                        ? 'bg-army-500 border-army-500 text-white shadow-lg shadow-army-500/20'
                        : 'border-border hover:border-army-500/50 text-muted-foreground'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Software Listing */}
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-12 h-12 animate-spin text-army-500" />
              <p className="uppercase tracking-[0.3em] text-xs">Synchronizing Ecosystem</p>
            </div>
          ) : filteredSoftwares.length > 0 ? (
            <div className="flex flex-col">
              {filteredSoftwares.map((software) => (
                <SoftwareItem key={software.id} software={software} />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center gap-6 border-y border-border/50">
              <Construction className="w-16 h-16 text-muted-foreground/20" />
              <div className="text-center">
                <p className="text-2xl font-bold mb-2 tracking-tight">Expansion in Progress</p>
                <p className="text-muted-foreground uppercase tracking-widest text-xs">No tools found in this category yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-army-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <SectionReveal>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-8 italic text-white uppercase">
              Need Something <br className="sm:hidden" /> <span className="text-army-400 font-light">Custom?</span>
            </h2>
            <p className="text-army-200/60 text-lg max-w-xl mx-auto mb-12">
              Our engineering team can build bespoke vertical software solutions for your specific structural or geotechnical challenges.
            </p>
            <Button
              className="bg-army-500 hover:bg-army-400 text-white px-12 h-14 uppercase tracking-widest"
              onClick={() => window.location.href = '/contact'}
            >
              Get In Touch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Code2,
  GraduationCap,
  ShoppingBag,
  CheckCircle2,
  Box,
  Package,
  ChevronDown
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { softwareService } from '@/services/pb/software';
import { productsService } from '@/services/pb/products';
import type { Software } from '@/types/software';
import type { Product } from '@/types/store';

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
        <div className="absolute inset-0 bg-noise opacity-20" />

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
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 text-white">Scroll</span>
            <ChevronDown className="w-5 h-5 text-army-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Building Design (Service 01)
function BuildingDesignSection() {
  const features = [
    'Architectural Design & Planning',
    'Structural Engineering Analysis',
    'BIM (Building Information Modeling)',
    'Site Planning & Development',
    'Geotechnical Engineering',
    '3D Modeling & Visualization',
    'Technical Drawing',
    'Construction Documentation'
  ];

  return (
    <section id="building-design" className="section-fullscreen relative flex items-center bg-background border-b border-border/50">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionReveal>
                <div className="w-16 h-16 bg-army-700/10 flex items-center justify-center mb-6 border border-army-500/20 shadow-sm">
                  <Building2 className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <span className="text-xs text-army-400 font-bold uppercase tracking-widest mb-4 block">
                  Service 01
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 uppercase">
                  Building Design
                </h2>
              </SectionReveal>
              <LineReveal delay={0.3} className="max-w-md mb-8" />

              <SectionReveal delay={0.4}>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  Comprehensive engineering and architectural design solutions for diverse projects.
                  We combine technical precision with creative vision to deliver safe, functional,
                  and sustainable building structures.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 group">
                      <CheckCircle2 className="w-4 h-4 text-army-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <Button asChild className="bg-army-700 hover:bg-army-600 rounded-none h-12 px-8 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md text-white">
                  <Link to="/building-design" className="inline-flex items-center gap-3">
                    Explore Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </SectionReveal>
            </div>

            <SectionReveal delay={0.3}>
              <div className="aspect-[4/3] bg-secondary/5 border border-border/50 relative overflow-hidden group shadow-inner">
                <div className="absolute inset-0 bg-grid opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                  <div className="w-24 h-24 bg-army-900/10 rounded-full flex items-center justify-center mb-6">
                    <Building2 className="w-12 h-12 text-army-700/30" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-2">Engineering Excellence</p>
                  <p className="text-xs text-muted-foreground italic max-w-[200px]">Advanced Structural & Architectural Solutions</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Software (Service 02)
function SoftwareSection() {
  const [softwares, setSoftwares] = useState<Software[]>([]);
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

  const displayedSoftwares = softwares.slice(0, 4);

  return (
    <section id="software" className="section-fullscreen relative flex items-center bg-secondary/5 border-b border-border/50">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionReveal className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-8 bg-background border border-border/50 animate-pulse rounded-sm">
                      <div className="w-10 h-10 bg-secondary rounded-lg mb-4" />
                      <div className="h-4 bg-secondary w-20" />
                    </div>
                  ))
                ) : (
                  <>
                    {displayedSoftwares.map((software) => {
                      const logoUrl = software.logo ? softwareService.getFileUrl(software, software.logo) : null;
                      return (
                        <div key={software.id} className="p-8 bg-background border border-border/50 hover:border-army-500/50 transition-all rounded-sm shadow-sm flex flex-col items-center justify-center text-center group">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={software.name}
                              className="w-12 h-12 mb-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <Box className="w-8 h-8 text-army-400 mb-4 opacity-50" />
                          )}
                          <h4 className="text-[10px] font-bold uppercase tracking-widest">{software.name}</h4>
                        </div>
                      );
                    })}
                    {softwares.length > 4 && (
                      <div className="p-8 bg-background/50 border border-dashed border-border/50 flex flex-col items-center justify-center text-center rounded-sm">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">
                          And many more...
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </SectionReveal>

            <div className="order-1 lg:order-2">
              <SectionReveal>
                <div className="w-16 h-16 bg-army-700/10 flex items-center justify-center mb-6 border border-army-500/20 shadow-sm">
                  <Code2 className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <span className="text-xs text-army-400 font-bold uppercase tracking-widest mb-4 block">
                  Service 02
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 uppercase">
                  Software
                </h2>
              </SectionReveal>
              <LineReveal delay={0.3} className="max-w-md mb-8" />

              <SectionReveal delay={0.4}>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  Innovative web-based engineering software designed to optimize analysis,
                  design, and project management workflows for construction professionals.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <Button asChild variant="outline" className="border-army-700 text-army-400 hover:bg-army-700 hover:text-white rounded-none h-12 px-8 text-xs font-bold uppercase tracking-widest transition-all duration-300">
                  <Link to="/software" className="inline-flex items-center gap-3">
                    Explore Software
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Courses & Consultation (Service 03)
function CoursesConsultationSection() {
  const options = [
    {
      title: 'Private Courses & Consultation',
      icon: GraduationCap,
      desc: 'One-on-one personalized mentoring tailored to your learning pace and career goals.',
      href: '/courses/private-courses'
    },
    {
      title: 'Online Courses',
      icon: GraduationCap,
      desc: 'Flexible, self-paced certification programs covering advanced engineering concepts.',
      href: '/courses/online-courses'
    }
  ];

  return (
    <section id="courses-consultation" className="section-fullscreen relative flex items-center bg-background border-b border-border/50">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionReveal>
              <span className="text-xs text-army-400 font-bold uppercase tracking-widest mb-4 block">
                Service 03
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 uppercase">
                Courses & Consultation
              </h2>
            </SectionReveal>
            <LineReveal delay={0.2} className="max-w-xs mx-auto mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {options.map((option, index) => (
              <SectionReveal key={option.title} delay={index * 0.1}>
                <Link to={option.href} className="flex h-full group">
                  <div className="p-8 lg:p-10 bg-secondary/10 border border-border/50 group-hover:border-army-500/40 
                                  transition-all duration-300 w-full rounded-sm shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-army-700/10 flex items-center justify-center mb-6 border border-army-500/20 group-hover:bg-army-700 group-hover:text-white transition-colors">
                      <option.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-tight">{option.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-8 flex-grow">
                      {option.desc}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-army-400 group-hover:text-army-300 transition-colors mt-auto">
                      View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Digital Products (Service 04)
function DigitalProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = products.slice(0, 3);

  return (
    <section id="digital-products" className="section-fullscreen relative flex items-center bg-army-950 text-white border-b border-army-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="w-full px-6 lg:px-20 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionReveal>
                <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center mb-6 border border-army-500/30 backdrop-blur-sm">
                  <ShoppingBag className="w-8 h-8 text-army-400" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <span className="text-xs text-army-400 font-bold uppercase tracking-widest mb-4 block">
                  Service 04
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 uppercase italic text-white">
                  Digital <span className="text-army-500 non-italic">Products</span>
                </h2>
              </SectionReveal>
              <LineReveal delay={0.3} className="max-w-md mb-8" color="bg-army-500/50" />

              <SectionReveal delay={0.4}>
                <p className="text-base text-army-100/60 mb-10 leading-relaxed font-light">
                  Explore our digital marketplace offering premium tools and resources
                  designed specifically for the modern engineering community.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <Button asChild className="bg-white text-army-950 hover:bg-army-100 rounded-none h-12 px-10 text-xs font-bold uppercase tracking-widest shadow-lg">
                  <Link to="/store">Go to Store</Link>
                </Button>
              </SectionReveal>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
                ))
              ) : (
                <>
                  {displayedProducts.map((p, i) => {
                    const thumbUrl = p.thumbnail ? productsService.getFileUrl(p, p.thumbnail) : null;
                    const slug = productsService.createSlug(p.name);
                    return (
                      <SectionReveal key={p.id} delay={0.3 + i * 0.1}>
                        <Link to={`/store/product/${slug}`} className="group relative aspect-square bg-white/5 border border-white/10 overflow-hidden rounded-sm block shadow-lg">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={p.name}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-white/10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                            <p className="text-[10px] font-bold uppercase truncate text-white">{p.name}</p>
                            <p className="text-[8px] text-army-400 font-bold uppercase tracking-widest mt-1">View Product</p>
                          </div>
                        </Link>
                      </SectionReveal>
                    );
                  })}
                  {products.length > 3 && (
                    <SectionReveal delay={0.7}>
                      <Link to="/store" className="aspect-square bg-white/5 border border-dashed border-white/20 hover:border-army-500/50 hover:bg-white/10 transition-all flex flex-col items-center justify-center text-center p-4 group">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-army-100/30 font-bold italic group-hover:text-army-400 transition-colors">
                          And many<br />more...
                        </p>
                        <ArrowRight className="w-4 h-4 mt-2 text-white/10 group-hover:translate-x-1 group-hover:text-army-500 transition-all" />
                      </Link>
                    </SectionReveal>
                  )}
                </>
              )}
            </div>
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
      <div className="h-0" /> {/* Spacer handled by the layout structure */}
      <div className="relative z-20 bg-background">
        <BuildingDesignSection />
        <SoftwareSection />
        <CoursesConsultationSection />
        <DigitalProductsSection />
      </div>
    </div>
  );
}

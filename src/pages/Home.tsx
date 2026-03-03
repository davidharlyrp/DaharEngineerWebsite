import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioService } from '@/services/pb/portfolio';
import { bookingService } from '@/services/pb/booking';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  ChevronDown,
  Code,
  FileText,
  Users,
  FolderOpen,
  MessageSquare,
  Search,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { NewsSlider } from '@/components/home/NewsSlider';

// Hero Section with News Slider
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
    <div ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        style={{ opacity, scale, y }}
        className="fixed inset-0 flex items-center justify-center z-0"
      >
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise pointer-events-none" />

        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* Video background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/Hero.webm" type="video/webm" />
          </video>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-20 flex flex-col justify-center h-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-army-500/30 
                         bg-army-500/5 mb-8"
            >
              <span className="w-1.5 h-1.5 bg-army-500 animate-pulse" />
              <span className="text-[10px] text-army-400 font-bold uppercase tracking-widest">
                CIVIL ENGINEERING CONSULTANT
              </span>
            </motion.div>

            {/* Main title */}
            <div className="mb-8">
              <TextReveal
                text="DAHAR"
                tag="h1"
                className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.8]"
                delay={0.3}
              />
              <TextReveal
                text="ENGINEER"
                tag="h1"
                className="text-7xl sm:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.8] 
                           text-muted-foreground mt-2"
                delay={0.5}
              />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground/60 max-w-lg mb-10 leading-relaxed"
            >
              Complete construction solutions from planning, building design,
              courses, to software and resources for developing your engineering career.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/services"
                className="group flex items-center gap-2 px-8 py-4 bg-army-700 hover:bg-army-600 
                           text-white text-[11px] font-bold uppercase tracking-tight transition-all duration-300"
              >
                Explore Services
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* News Slider - Right Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 right-10 z-20 hidden lg:block"
        >
          <NewsSlider />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute w-full bottom-10 left-10 lg:left-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground/30"
          >
            <p className="text-xs text-muted-foreground/60">Scroll Down</p>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Explore Section (Quicklinks)
function ExploreSection() {
  const groups = [
    {
      title: 'CORE ECOSYSTEM',
      items: [
        { label: 'Building Design', desc: 'Structural & Architectural Design', href: '/services', icon: Building2 },
        { label: 'Software Suite', desc: 'Engineering Calculation Tools', href: '/software', icon: Code },
        { label: 'Digital Store', desc: 'Spreadsheets & Templates', href: '/store', icon: ShoppingBag },
        { label: 'Private Courses', desc: '1-on-1 Personalized Training', href: '/courses/private-courses', icon: GraduationCap },
      ]
    },
    {
      title: 'COMMUNITY HUB',
      items: [
        { label: 'Engineering Blog', desc: 'Articles & Tutorials', href: '/blog', icon: FileText },
        { label: 'Revit Files', desc: 'Family & Project Library', href: '/community/revit-files', icon: FolderOpen },
        { label: 'Resources', desc: 'Free Engineering Library', href: '/community/resources', icon: BookOpen },
        { label: 'Help & FAQ', desc: 'Common Questions', href: '/faq', icon: MessageSquare },
      ]
    },
    {
      title: 'CLIENT SERVICES',
      items: [
        { label: 'About Dahar', desc: 'Our Vision & Expertise', href: '/about', icon: Users },
        { label: 'Project Portfolio', desc: 'Showcase of Our Work', href: 'https://portfolio.daharengineer.com', icon: Search },
        { label: 'Contact Us', desc: 'Get Professional Advice', href: '/contact', icon: MessageSquare },
        { label: 'Online Learning', desc: 'Video-based Courses', href: '/courses/online-courses', icon: GraduationCap },
      ]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {groups.map((group, gIndex) => (
            <div key={group.title} className="space-y-6">
              <SectionReveal delay={gIndex * 0.1}>
                <h3 className="text-[10px] font-bold text-army-500 uppercase tracking-[0.2em] mb-8 border-l border-army-500/30 pl-3">
                  {group.title}
                </h3>
              </SectionReveal>

              <div className="space-y-px bg-border/5">
                {group.items.map((item, iIndex) => {
                  const Icon = item.icon;
                  const isExternal = item.href.startsWith('http');
                  const LinkComponent = isExternal ? 'a' : Link;
                  const linkProps = isExternal ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : { to: item.href };

                  return (
                    <SectionReveal key={item.label} delay={(gIndex * 0.1) + (iIndex * 0.05)}>
                      <LinkComponent
                        {...(linkProps as any)}
                        className="group flex items-start gap-4 p-5 hover:bg-secondary/30 transition-all rounded-sm border border-transparent hover:border-border/5"
                      >
                        <div className="w-8 h-8 rounded-sm bg-army-700/10 flex items-center justify-center shrink-0 group-hover:bg-army-700 transition-colors duration-500">
                          <Icon className="w-3.5 h-3.5 text-army-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold tracking-tight group-hover:text-army-400 transition-colors uppercase">
                            {item.label}
                          </h4>
                          <p className="text-[10px] text-muted-foreground opacity-60 leading-tight">
                            {item.desc}
                          </p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-3 h-3 text-army-400" />
                        </div>
                      </LinkComponent>
                    </SectionReveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats & CTA (Compact)
function BottomInfo() {
  const [stats, setStats] = useState([
    { value: '0+', label: 'Projects' },
    { value: '0+', label: 'Students' },
    { value: '3+', label: 'Years' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsCount, studentsCount] = await Promise.all([
          portfolioService.getTotalProjects(),
          bookingService.getTotalPaidBookings()
        ]);

        // Round down to nearest 5 for projects
        const roundedProjects = Math.floor(projectsCount / 5) * 5;

        // Round down to nearest 10 for students
        const roundedStudents = Math.floor(studentsCount / 10) * 10;

        setStats([
          { value: `${roundedProjects}+`, label: 'Projects' },
          { value: `${roundedStudents}+`, label: 'Students' },
          { value: '3+', label: 'Years' },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="bg-secondary/10 border border-border/5 rounded-sm p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="grid grid-cols-3 gap-8 lg:gap-16 shrink-0">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-bold tracking-tighter text-army-400">{stat.value}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-md text-center lg:text-right">
            <h2 className="text-2xl font-bold tracking-tight mb-4 leading-tight">
              READY TO START YOUR <span className="text-army-500">NEXT PROJECT?</span>
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              <Link to="/contact" className="px-6 py-3 bg-army-700 hover:bg-army-600 text-white text-[10px] font-bold uppercase tracking-tight transition-all">
                Get Professional Advice
              </Link>
              <Link to="/about" className="px-6 py-3 bg-transparent border border-border/20 hover:border-army-500 text-[10px] font-bold uppercase tracking-tight transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="relative">
      {/* Hero with Fixed Effect */}
      <HeroSection />

      {/* Spacer for Fixed Hero */}
      <div className="h-screen" />

      {/* Content Sections */}
      <div className="relative z-10 bg-background">
        <ExploreSection />
        <BottomInfo />
      </div>
    </div>
  );
}

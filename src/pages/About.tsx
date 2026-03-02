import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Users,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { TextReveal, LineReveal, SectionReveal } from '@/components/ui-custom';
import { teamsService } from '@/services/pb/teams';
import type { DaharTeam } from '@/types/teams';

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
            <span className="text-sm text-army-400 font-medium tracking-wide">
              ABOUT DAHAR ENGINEER
            </span>
          </motion.div>

          <TextReveal
            text="We deliver reliable civil"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            delay={0.3}
          />
          <TextReveal
            text="engineering solutions,"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.5}
          />
          <TextReveal
            text="combining technical expertise with a clear and educational approach."
            tag="p"
            className="text-xl sm:text-2xl font-light tracking-tight text-muted-foreground"
            delay={0.7}
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
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Vision Section (Revised StorySection)
function VisionSection() {
  const principles = [
    {
      id: 1,
      text: "The need for civil engineering consultants who provide not only accurate designs but also transparent and well-documented technical justifications."
    },
    {
      id: 2,
      text: "A gap in the market for planners who can bridge academic principles with real-world, practical solutions."
    },
    {
      id: 3,
      text: "The complexity of regulations, site conditions, and technical standards requires planners who communicate clearly with clients, contractors, and stakeholders."
    },
    {
      id: 4,
      text: "A growing demand for continuous learning and knowledge sharing within the civil engineering profession, ensuring better project outcomes."
    },
    {
      id: 5,
      text: "The importance of human-centered design — functional, safe, and efficient — that addresses Indonesia's evolving infrastructure challenges."
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Content Left */}
            <div className="sticky top-32">
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Our Foundation
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
                  Core Principles<br />
                  <span className="text-muted-foreground">and Values</span>
                </h2>
              </SectionReveal>
              <LineReveal delay={0.2} className="max-w-md mb-8" />
              <SectionReveal delay={0.3}>
                <p className="text-lg text-muted-foreground">
                  Dahar Engineer was founded on a set of core principles that guide every project we undertake and every decision we make.
                </p>
                <img src="/logo.png" alt="About Hero" className="w-64 h-64 object-cover opacity-50 mt-10 rounded-sm" />
                {/* <img src="/About2.webp" alt="About Hero" className="w-full h-64 object-cover [object-position:center_80%] opacity-50 mt-10 rounded-sm" /> */}
              </SectionReveal>
            </div>

            {/* Principles Right */}
            <div className="space-y-12">
              {principles.map((principle, index) => (
                <SectionReveal key={principle.id} delay={0.1 * index}>
                  <div className="flex gap-6 group">
                    <span className="text-2xl font-bold text-army-500/40 group-hover:text-army-500 transition-colors">
                      {principle.id}.
                    </span>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {principle.text}
                    </p>
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

// Inspiration Section
function InspirationSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/10">
      <div className="w-full px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SectionReveal>
              <div className="aspect-[16/9] bg-gradient-to-br from-army-800/30 to-army-900/30 overflow-hidden">
                {/* Image or Pattern */}
                <img src="/About1.webp" alt="About Hero" className="w-full h-full object-cover opacity-50" />
                <div className="w-full h-full bg-grid opacity-20" />
              </div>
            </SectionReveal>
            <div className="space-y-8">
              <SectionReveal delay={0.2}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
                  We're inspired by the <span className="font-bold">growing need for reliable infrastructure</span>,
                  the demand for accountable engineering practices, and the mission to build
                  a <span className="text-army-400 underline decoration-army-500/30 underline-offset-8">more informed civil engineering community.</span>
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.4}>
                <p className="text-muted-foreground text-lg italic">
                  "Our goal is to simplify complex technical knowledge and empower professionals across the nation."
                </p>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Team Section
function TeamSection() {
  const [teams, setTeams] = useState<DaharTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamsService.getActiveTeams();
        setTeams(data);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-army-500" />
      </div>
    );
  }

  return (
    <section className="relative bg-background py-24">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="mb-16">
              <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                The Experts
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Meet the Team
              </h2>
            </div>
          </SectionReveal>

          <div className="space-y-32">
            {teams.map((member, index) => (
              <SectionReveal key={member.id} delay={0.1}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={index % 2 !== 0 ? 'lg:order-2' : ''}>
                    <h3 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-army-400 font-medium mb-6 uppercase tracking-wider text-sm">
                      {member.title}
                    </p>
                    <LineReveal className="mb-8" />
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                      {member.description}
                    </p>
                  </div>

                  <div className={`aspect-square relative group overflow-hidden bg-secondary/20 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    {member.image ? (
                      <img
                        src={teamsService.getFileUrl(member, member.image)}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-20 h-20 text-muted-foreground/20" />
                      </div>
                    )}
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

// Main About Page
export default function About() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <VisionSection />
        <InspirationSection />
        <TeamSection />
      </div>
    </div>
  );
}

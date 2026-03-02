import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  Target,
  Lightbulb,
  Users,
  Award
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
            <span className="text-sm text-army-400 font-medium tracking-wide">
              ABOUT US
            </span>
          </motion.div>

          <TextReveal
            text="Building the Future"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="With Engineering Excellence"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-muted-foreground"
            delay={0.5}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Story Section
function StorySection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Our Story
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  Bridging Theory<br />
                  <span className="text-muted-foreground">and Practice</span>
                </h2>
              </SectionReveal>
              <LineReveal delay={0.2} className="max-w-md mb-8" />

              <div className="space-y-6 text-muted-foreground">
                <SectionReveal delay={0.3}>
                  <p>
                    Dahar Engineer was founded with a clear mission: to provide reliable
                    civil engineering solutions that combine technical expertise with a
                    transparent, educational approach.
                  </p>
                </SectionReveal>
                <SectionReveal delay={0.4}>
                  <p>
                    We recognized the need for engineering consultants who not only deliver
                    accurate designs but also provide well-documented technical justifications
                    that clients can understand and trust.
                  </p>
                </SectionReveal>
                <SectionReveal delay={0.5}>
                  <p>
                    Based in Bandung, Indonesia, we have grown from a small consultancy
                    into a comprehensive engineering solutions provider, serving clients
                    across the nation with our unique blend of practical experience and
                    academic rigor.
                  </p>
                </SectionReveal>
              </div>
            </div>

            {/* Principles */}
            <div className="space-y-6">
              {[
                {
                  title: 'Technical Excellence',
                  desc: 'We deliver accurate, well-documented designs with clear technical justifications.',
                  icon: Target
                },
                {
                  title: 'Practical Solutions',
                  desc: 'We bridge academic principles with real-world, implementable solutions.',
                  icon: Lightbulb
                },
                {
                  title: 'Clear Communication',
                  desc: 'We communicate complex technical concepts in ways clients can understand.',
                  icon: Users
                },
                {
                  title: 'Continuous Learning',
                  desc: 'We are committed to knowledge sharing and professional development.',
                  icon: Award
                }
              ].map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <SectionReveal key={principle.title} delay={0.1 * (index + 1)}>
                    <div className="flex items-start gap-4 p-6 bg-secondary/30 hover:bg-secondary/50 
                                    transition-colors duration-300">
                      <div className="w-10 h-10 bg-army-700/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-army-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{principle.title}</h3>
                        <p className="text-sm text-muted-foreground">{principle.desc}</p>
                      </div>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Founder Section
function FounderSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <SectionReveal>
              <div className="aspect-square bg-gradient-to-br from-army-800/30 to-army-900/30 
                              flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-army-700/30 flex items-center justify-center">
                    <span className="text-4xl font-bold text-army-400">DP</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Founder & Lead Engineer</p>
                </div>
              </div>
            </SectionReveal>

            {/* Content */}
            <div>
              <SectionReveal delay={0.1}>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Meet the Founder
                </span>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  David Prabudhi
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.3}>
                <p className="text-lg text-muted-foreground mb-6">
                  Civil Engineer & Founder
                </p>
              </SectionReveal>
              <LineReveal delay={0.4} className="max-w-md mb-8" />

              <div className="space-y-4 text-muted-foreground">
                <SectionReveal delay={0.5}>
                  <p>
                    With a passion for structural engineering and education, David founded
                    Dahar Engineer to bridge the gap between academic knowledge and practical
                    application in the construction industry.
                  </p>
                </SectionReveal>
                <SectionReveal delay={0.6}>
                  <p>
                    His expertise spans structural analysis, building design, and geotechnical
                    engineering, with a particular focus on developing innovative software
                    solutions that simplify complex engineering calculations.
                  </p>
                </SectionReveal>
              </div>

              <SectionReveal delay={0.7}>
                <div className="mt-8 flex items-center gap-2 text-army-400">
                  <a href="https://linkedin.com/in/davidprabudhi" target="_blank" rel="noopener noreferrer"
                    className="hover:underline">
                    Connect on LinkedIn
                  </a>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Values Section
function ValuesSection() {
  const values = [
    {
      number: '01',
      title: 'Accuracy',
      desc: 'Every calculation, every design, every recommendation is backed by thorough analysis and verification.'
    },
    {
      number: '02',
      title: 'Transparency',
      desc: 'We believe in clear communication and complete documentation of our engineering decisions.'
    },
    {
      number: '03',
      title: 'Innovation',
      desc: 'We continuously develop new tools and methods to improve engineering workflows.'
    },
    {
      number: '04',
      title: 'Education',
      desc: 'We are committed to sharing knowledge and building capacity in the engineering community.'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
              Our Values
            </span>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-16">
              What Drives Us
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-px bg-border/30">
            {values.map((value, index) => (
              <SectionReveal key={value.title} delay={0.1 * (index + 1)}>
                <div className="p-8 lg:p-12 bg-background hover:bg-secondary/30 transition-colors duration-300">
                  <span className="text-5xl font-bold text-army-700/30 mb-4 block">
                    {value.number}
                  </span>
                  <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
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
        <StorySection />
        <FounderSection />
        <ValuesSection />
      </div>
    </div>
  );
}

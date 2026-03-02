import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Code2, 
  Star,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe,
  Database,
  Calculator,
  Layers,
  Box,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Software, SoftwareCategory } from '@/types';

// Mock software data (will be replaced with PocketBase fetch)
const mockSoftware: Software[] = [
  {
    id: '1',
    name: 'DEColumn',
    slug: 'decolumn',
    description: 'Web-based application for analyzing column interaction P-M diagrams with comprehensive visualization.',
    fullDescription: 'DEColumn is a powerful web-based tool designed for structural engineers to analyze and visualize column interaction diagrams (P-M diagrams). It supports various concrete grades and steel reinforcement configurations.',
    category: 'structural-analysis',
    websiteUrl: 'https://decolumn.daharengineer.com',
    isNew: true,
    isFeatured: true,
    version: '2.1.0',
    features: [
      'Interactive P-M diagram visualization',
      'Multiple concrete grade support',
      'Custom reinforcement layouts',
      'Export to PDF and Excel',
      'SNI 2847:2019 compliance'
    ],
    pricing: { type: 'free' },
    rating: 4.8,
    userCount: 1250,
    created: '2024-01-15',
    updated: '2024-11-20'
  },
  {
    id: '2',
    name: 'TerraPile',
    slug: 'terrapile',
    description: 'Calculate pile bearing capacity with various methods including static and dynamic analysis.',
    fullDescription: 'TerraPile provides comprehensive pile capacity calculations using multiple methods including Meyerhof, Vesic, and CPT-based approaches.',
    category: 'geotechnical',
    websiteUrl: 'https://terrapile.daharengineer.com',
    isNew: false,
    isFeatured: true,
    version: '1.5.2',
    features: [
      'Multiple calculation methods',
      'Soil layer input',
      'Group pile analysis',
      'Settlement calculation',
      'Detailed reporting'
    ],
    pricing: { type: 'free' },
    rating: 4.7,
    userCount: 890,
    created: '2024-02-10',
    updated: '2024-10-15'
  },
  {
    id: '3',
    name: 'TerraShallow',
    slug: 'terrashallow',
    description: 'Analyze shallow foundation bearing capacity and settlement for different soil conditions.',
    fullDescription: 'TerraShallow offers comprehensive analysis tools for shallow foundations including footings and rafts with various soil conditions.',
    category: 'geotechnical',
    websiteUrl: 'https://terrashallow.daharengineer.com',
    isNew: false,
    isFeatured: false,
    version: '1.3.0',
    features: [
      'Bearing capacity analysis',
      'Settlement calculation',
      'Eccentric loading',
      'Sliding check',
      'Overturning check'
    ],
    pricing: { type: 'free' },
    rating: 4.6,
    userCount: 650,
    created: '2024-03-05',
    updated: '2024-09-20'
  },
  {
    id: '4',
    name: 'CutPro',
    slug: 'cutpro',
    description: 'Optimize your cutting list for bars and sheets to minimize waste and reduce costs.',
    fullDescription: 'CutPro uses advanced optimization algorithms to minimize material waste when cutting bars, sheets, and other construction materials.',
    category: 'optimization',
    websiteUrl: 'https://cutpro.daharengineer.com',
    isNew: true,
    isFeatured: true,
    version: '1.0.0',
    features: [
      '1D cutting optimization',
      '2D nesting optimization',
      'Multiple material types',
      'Waste minimization',
      'Cost estimation'
    ],
    pricing: { type: 'freemium', price: 99000, currency: 'IDR', billingPeriod: 'monthly' },
    rating: 4.9,
    userCount: 420,
    created: '2024-11-01',
    updated: '2024-11-01'
  },
  {
    id: '5',
    name: 'BrickCost',
    slug: 'brickcost',
    description: 'Estimate project costs with detailed material and labor calculations.',
    fullDescription: 'BrickCost helps contractors and engineers estimate construction project costs with detailed breakdowns of materials, labor, and equipment.',
    category: 'estimation',
    websiteUrl: 'https://brickcost.daharengineer.com',
    isNew: false,
    isFeatured: false,
    version: '2.0.1',
    features: [
      'Material cost database',
      'Labor cost estimation',
      'Equipment cost tracking',
      'Project templates',
      'Export to Excel'
    ],
    pricing: { type: 'free' },
    rating: 4.5,
    userCount: 1100,
    created: '2024-04-12',
    updated: '2024-08-25'
  },
  {
    id: '6',
    name: 'TerraID',
    slug: 'terraid',
    description: 'Interactive platform for Indonesia soil database with comprehensive soil parameters.',
    fullDescription: 'TerraID provides access to a comprehensive database of Indonesian soil properties, including SPT data, laboratory test results, and soil classification.',
    category: 'database',
    websiteUrl: 'https://terraid.daharengineer.com',
    isNew: false,
    isFeatured: true,
    version: '1.2.0',
    features: [
      'Soil parameter database',
      'Location-based search',
      'SPT data visualization',
      'Soil classification',
      'Export capabilities'
    ],
    pricing: { type: 'free' },
    rating: 4.7,
    userCount: 780,
    created: '2024-05-20',
    updated: '2024-10-10'
  }
];

// Category definitions with icons
const categoryIcons: Record<SoftwareCategory, React.ElementType> = {
  'structural-analysis': Box,
  'geotechnical': Layers,
  'calculation': Calculator,
  'optimization': TrendingUp,
  'estimation': Database,
  'database': Database
};

const categoryNames: Record<SoftwareCategory, string> = {
  'structural-analysis': 'Structural Analysis',
  'geotechnical': 'Geotechnical',
  'calculation': 'Calculation',
  'optimization': 'Optimization',
  'estimation': 'Estimation',
  'database': 'Database'
};

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
            <Code2 className="w-4 h-4 text-army-400" />
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
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto"
          >
            Powerful web-based tools designed to simplify complex engineering 
            calculations and streamline your workflow.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// Software Card Component - Unique and Bold Design
function SoftwareCard({ software, index }: { software: Software; index: number }) {
  const Icon = categoryIcons[software.category] || Box;
  
  const handleVisit = () => {
    window.open(software.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <SectionReveal delay={0.1 * (index + 1)}>
      <div className="group relative bg-background border border-border/50 hover:border-army-500 
                      transition-all duration-500 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-army-600 via-army-500 to-army-700 
                        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-army-700/10 transform translate-x-8 -translate-y-8 
                        group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
        
        <div className="p-8 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Icon Box */}
              <div className="w-16 h-16 bg-army-700/20 flex items-center justify-center
                              group-hover:bg-army-700 transition-colors duration-300">
                <Icon className="w-8 h-8 text-army-400 group-hover:text-white transition-colors" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold group-hover:text-army-400 transition-colors">
                    {software.name}
                  </h3>
                  {software.isNew && (
                    <Badge className="bg-army-600 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      NEW
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {software.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {software.userCount.toLocaleString()} users
                  </span>
                  {software.version && (
                    <>
                      <span>•</span>
                      <span>v{software.version}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Category Badge */}
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {categoryNames[software.category]}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 line-clamp-2">
            {software.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Key Features</p>
            <div className="flex flex-wrap gap-2">
              {software.features.slice(0, 4).map((feature, i) => (
                <span key={i} className="flex items-center gap-1 text-sm px-3 py-1 bg-secondary/50">
                  <CheckCircle2 className="w-3 h-3 text-army-400" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div>
              {software.pricing?.type === 'free' ? (
                <span className="text-green-400 font-semibold">Free</span>
              ) : software.pricing?.type === 'freemium' ? (
                <span className="text-army-400 font-semibold">
                  Freemium {software.pricing.price && 
                    `(from Rp ${software.pricing.price.toLocaleString('id-ID')})`
                  }
                </span>
              ) : (
                <span className="text-army-400 font-semibold">
                  Rp {software.pricing?.price?.toLocaleString('id-ID')}
                  {software.pricing?.billingPeriod && `/${software.pricing.billingPeriod}`}
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleVisit}
              className="bg-army-700 hover:bg-army-600 group/btn"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// Featured Software Section
function FeaturedSoftwareSection() {
  const featuredSoftware = mockSoftware.filter(s => s.isFeatured);

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <SectionReveal>
                <span className="text-sm text-army-400 font-medium uppercase tracking-wider mb-4 block">
                  Featured
                </span>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Our Software
                </h2>
              </SectionReveal>
            </div>
          </div>

          <div className="space-y-6">
            {featuredSoftware.map((software, index) => (
              <SoftwareCard key={software.id} software={software} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// All Software Section
function AllSoftwareSection() {
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');

  const filteredSoftware = selectedCategory === 'all' 
    ? mockSoftware 
    : mockSoftware.filter(s => s.category === selectedCategory);

  const categories = Array.from(new Set(mockSoftware.map(s => s.category)));

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              All Applications
            </h2>
          </SectionReveal>

          {/* Category Filter */}
          <SectionReveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-army-700' : ''}
              >
                All
              </Button>
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-army-700' : ''}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {categoryNames[cat]}
                  </Button>
                );
              })}
            </div>
          </SectionReveal>

          {/* Software Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredSoftware.map((software, index) => (
              <SoftwareCard key={software.id} software={software} index={index} />
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
      icon: Globe,
      title: 'Web-Based',
      desc: 'No installation required. Access from any device with a web browser.'
    },
    {
      icon: Database,
      title: 'Cloud Storage',
      desc: 'Save and access your projects from anywhere, anytime.'
    },
    {
      icon: CheckCircle2,
      title: 'Accurate Calculations',
      desc: 'Built on proven engineering formulas and SNI standards.'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      desc: 'Optimized algorithms for quick results and smooth user experience.'
    }
  ];

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
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
                  <div className="text-center p-8 bg-secondary/30 hover:bg-secondary/50 
                                  border border-transparent hover:border-army-500/30 
                                  transition-all duration-300">
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
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-army-700 hover:bg-army-600 
                         text-white font-medium transition-all duration-300"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Software Page
export default function SoftwareList() {
  // In production, fetch from PocketBase:
  // const [software, setSoftware] = useState<Software[]>([]);
  // useEffect(() => {
  //   pb.collection('software').getFullList({ sort: '-created' })
  //     .then(records => setSoftware(records as unknown as Software[]));
  // }, []);

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <FeaturedSoftwareSection />
        <AllSoftwareSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
}

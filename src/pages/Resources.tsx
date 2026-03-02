import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Download,
  FileText,
  GraduationCap,
  Scale,
  Eye,
  FileDown,
  Lock,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import type { Resource, ResourceCategory } from '@/types';

// Mock resources data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Structural Analysis Fundamentals',
    description: 'Comprehensive guide to structural analysis methods including statics, mechanics of materials, and structural behavior.',
    category: 'e-book',
    fileUrl: '#',
    fileSize: '15.5 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['structural', 'analysis', 'fundamentals', 'engineering'],
    downloadCount: 1234,
    viewCount: 3456,
    isPremium: false,
    requiresLogin: false,
    created: '2024-01-15',
    updated: '2024-06-20'
  },
  {
    id: '2',
    title: 'SNI 1727:2020 - Design Seismic Loads',
    description: 'Complete regulation document for seismic load design in Indonesia with commentary and examples.',
    category: 'regulation',
    fileUrl: '#',
    fileSize: '8.2 MB',
    fileFormat: 'PDF',
    author: 'BSN Indonesia',
    tags: ['SNI', 'seismic', 'regulation', 'loads'],
    downloadCount: 2890,
    viewCount: 5678,
    isPremium: false,
    requiresLogin: false,
    created: '2024-02-10',
    updated: '2024-07-15'
  },
  {
    id: '3',
    title: 'Revit Structure Mastery Module',
    description: 'Step-by-step learning module for mastering structural modeling in Revit with practical exercises.',
    category: 'module',
    fileUrl: '#',
    fileSize: '125 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['revit', 'bim', 'module', 'tutorial'],
    downloadCount: 567,
    viewCount: 1234,
    isPremium: true,
    price: 99000,
    requiresLogin: true,
    created: '2024-03-05',
    updated: '2024-08-10'
  },
  {
    id: '4',
    title: 'Concrete Design Handbook',
    description: 'Practical handbook for reinforced concrete design following SNI 2847:2019 standards.',
    category: 'e-book',
    fileUrl: '#',
    fileSize: '22.8 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['concrete', 'design', 'handbook', 'SNI'],
    downloadCount: 1890,
    viewCount: 4234,
    isPremium: false,
    requiresLogin: false,
    created: '2024-01-20',
    updated: '2024-05-15'
  },
  {
    id: '5',
    title: 'SNI 1726:2019 - Seismic Design Procedures',
    description: 'Official standard for seismic design procedures for building structures in Indonesia.',
    category: 'regulation',
    fileUrl: '#',
    fileSize: '12.5 MB',
    fileFormat: 'PDF',
    author: 'BSN Indonesia',
    tags: ['SNI', 'seismic', 'design', 'regulation'],
    downloadCount: 3456,
    viewCount: 6789,
    isPremium: false,
    requiresLogin: false,
    created: '2024-04-12',
    updated: '2024-09-01'
  },
  {
    id: '6',
    title: 'ETABS Advanced Training Module',
    description: 'Advanced training material for structural analysis and design using ETABS software.',
    category: 'module',
    fileUrl: '#',
    fileSize: '85 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['etabs', 'analysis', 'module', 'training'],
    downloadCount: 890,
    viewCount: 2345,
    isPremium: true,
    price: 149000,
    requiresLogin: true,
    created: '2024-05-20',
    updated: '2024-10-15'
  },
  {
    id: '7',
    title: 'Foundation Engineering Guide',
    description: 'Complete guide to foundation engineering including soil mechanics and foundation design.',
    category: 'e-book',
    fileUrl: '#',
    fileSize: '18.3 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['foundation', 'geotechnical', 'design', 'guide'],
    downloadCount: 1456,
    viewCount: 3456,
    isPremium: false,
    requiresLogin: false,
    created: '2024-02-28',
    updated: '2024-07-20'
  },
  {
    id: '8',
    title: 'SNI 2847:2019 - Concrete Structure Requirements',
    description: 'Standard requirements for structural concrete buildings and explanations.',
    category: 'regulation',
    fileUrl: '#',
    fileSize: '25.6 MB',
    fileFormat: 'PDF',
    author: 'BSN Indonesia',
    tags: ['SNI', 'concrete', 'regulation', 'requirements'],
    downloadCount: 4123,
    viewCount: 7890,
    isPremium: false,
    requiresLogin: false,
    created: '2024-03-15',
    updated: '2024-08-25'
  },
  {
    id: '9',
    title: 'Steel Structure Design Module',
    description: 'Learning module for steel structure design following SNI 1729:2020 standards.',
    category: 'module',
    fileUrl: '#',
    fileSize: '45 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['steel', 'design', 'module', 'SNI'],
    downloadCount: 678,
    viewCount: 1567,
    isPremium: true,
    price: 129000,
    requiresLogin: true,
    created: '2024-06-01',
    updated: '2024-11-01'
  },
  {
    id: '10',
    title: 'Structural Engineering Reference',
    description: 'Quick reference guide for structural engineers with formulas, tables, and charts.',
    category: 'e-book',
    fileUrl: '#',
    fileSize: '10.2 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['reference', 'formulas', 'engineering', 'quick-guide'],
    downloadCount: 2345,
    viewCount: 4567,
    isPremium: false,
    requiresLogin: false,
    created: '2024-04-20',
    updated: '2024-09-15'
  },
  {
    id: '11',
    title: 'SNI 1729:2020 - Steel Structure Specification',
    description: 'Specification for structural steel buildings with design examples.',
    category: 'regulation',
    fileUrl: '#',
    fileSize: '18.9 MB',
    fileFormat: 'PDF',
    author: 'BSN Indonesia',
    tags: ['SNI', 'steel', 'specification', 'design'],
    downloadCount: 2789,
    viewCount: 5678,
    isPremium: false,
    requiresLogin: false,
    created: '2024-07-10',
    updated: '2024-11-20'
  },
  {
    id: '12',
    title: 'BIM Implementation Guide',
    description: 'Comprehensive guide for BIM implementation in structural engineering projects.',
    category: 'module',
    fileUrl: '#',
    fileSize: '32 MB',
    fileFormat: 'PDF',
    author: 'Dahar Engineer',
    tags: ['bim', 'implementation', 'guide', 'workflow'],
    downloadCount: 456,
    viewCount: 1234,
    isPremium: true,
    price: 79000,
    requiresLogin: true,
    created: '2024-08-15',
    updated: '2024-12-01'
  }
];

// Category definitions
const categories: { id: ResourceCategory; name: string; icon: React.ElementType; description: string; color: string }[] = [
  { 
    id: 'e-book', 
    name: 'E-Books', 
    icon: BookOpen, 
    description: 'Comprehensive books and guides for engineering topics',
    color: 'bg-blue-600'
  },
  { 
    id: 'module', 
    name: 'Modules', 
    icon: GraduationCap, 
    description: 'Structured learning modules and training materials',
    color: 'bg-green-600'
  },
  { 
    id: 'regulation', 
    name: 'Regulations', 
    icon: Scale, 
    description: 'Official standards and regulatory documents',
    color: 'bg-amber-600'
  },
];

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
            <BookOpen className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              KNOWLEDGE BASE
            </span>
          </motion.div>

          <TextReveal
            text="Engineering"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Resources"
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
            Access our collection of e-books, learning modules, and regulatory documents 
            to enhance your engineering knowledge.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const { isAuthenticated } = useAuth();
  
  const canDownload = !resource.requiresLogin || (resource.requiresLogin && isAuthenticated);

  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'e-book': return BookOpen;
      case 'module': return GraduationCap;
      case 'regulation': return Scale;
      default: return FileText;
    }
  };

  const Icon = getCategoryIcon(resource.category);

  const handleDownload = () => {
    if (resource.requiresLogin && !isAuthenticated) {
      window.location.href = '/login?redirect=/resources';
      return;
    }
    if (resource.isPremium && !isAuthenticated) {
      window.location.href = '/login?redirect=/resources';
      return;
    }
    // Download logic here
    console.log('Downloading:', resource.id);
  };

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className="group h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                      hover:border-army-500/30 transition-all duration-300">
        {/* Header */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-army-700/20 flex items-center justify-center
                            group-hover:bg-army-700 transition-colors">
              <Icon className="w-6 h-6 text-army-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="text-xs uppercase">
                {resource.category}
              </Badge>
              {resource.isPremium && (
                <Badge className="bg-amber-600">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  PREMIUM
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-2">
            {resource.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {resource.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {resource.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(resource.created).getFullYear()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <FileDown className="w-4 h-4" />
                {resource.fileFormat}
              </span>
              <span className="text-muted-foreground">{resource.fileSize}</span>
            </div>
            {resource.isPremium && resource.price && (
              <span className="font-semibold text-army-400">
                Rp {resource.price.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resource.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {resource.downloadCount}
            </span>
          </div>

          {/* Download Button */}
          <Button 
            onClick={handleDownload}
            disabled={!canDownload}
            className="w-full mt-4 bg-army-700 hover:bg-army-600"
          >
            {resource.requiresLogin && !isAuthenticated ? (
              <><Lock className="w-4 h-4 mr-2" /> Login to Download</>
            ) : resource.isPremium && !isAuthenticated ? (
              <><Star className="w-4 h-4 mr-2" /> Premium Content</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Download</>
            )}
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
}

// Resources Section with Filter
function ResourcesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');

  const filteredResources = useMemo(() => {
    let resources = [...mockResources];

    // Filter by category
    if (selectedCategory !== 'all') {
      resources = resources.filter(r => r.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query)) ||
        r.author.toLowerCase().includes(query)
      );
    }

    return resources;
  }, [searchQuery, selectedCategory]);

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Category Cards */}
          <SectionReveal>
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = mockResources.filter(r => r.category === category.id).length;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : category.id)}
                    className={`cursor-pointer p-6 border transition-all duration-300 ${
                      isSelected 
                        ? 'border-army-500 bg-army-700/10' 
                        : 'border-border/30 bg-secondary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 ${category.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <p className="text-sm font-medium">{count} resources</p>
                  </div>
                );
              })}
            </div>
          </SectionReveal>

          {/* Search */}
          <SectionReveal delay={0.1}>
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search resources by title, description, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border/50"
              />
            </div>
          </SectionReveal>

          {/* Active Filter */}
          {selectedCategory !== 'all' && (
            <SectionReveal delay={0.2}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Showing:</span>
                <Badge className="bg-army-700">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 hover:text-white/70"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            </SectionReveal>
          )}

          {/* Results Count */}
          <SectionReveal delay={0.2}>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            </p>
          </SectionReveal>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const totalDownloads = mockResources.reduce((acc, r) => acc + r.downloadCount, 0);
  const totalViews = mockResources.reduce((acc, r) => acc + r.viewCount, 0);

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            {[
              { value: mockResources.length.toString(), label: 'Total Resources' },
              { value: totalDownloads.toLocaleString(), label: 'Total Downloads' },
              { value: totalViews.toLocaleString(), label: 'Total Views' },
              { value: categories.length.toString(), label: 'Categories' }
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

// Main Resources Page
export default function Resources() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <ResourcesSection />
        <StatsSection />
      </div>
    </div>
  );
}

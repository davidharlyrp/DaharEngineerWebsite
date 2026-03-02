import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { 
  Box, 
  Search, 
  Download,
  Grid3X3,
  List,
  Star,
  HardHat,
  Building2,
  Zap,
  FileText,
  Ruler,
  Lock
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import type { RevitFile, RevitCategory, RevitFilter } from '@/types';

// Mock Revit files data
const mockRevitFiles: RevitFile[] = [
  {
    id: '1',
    name: 'RC Column Family - Various Sizes',
    description: 'Complete reinforced concrete column family with parametric sizing from 300x300 to 800x800mm. Includes rebar detailing.',
    category: 'structural',
    version: '2022+',
    fileSize: '15 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 234,
    author: 'Dahar Engineer',
    tags: ['column', 'concrete', 'structural', 'parametric'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-01-15',
    updated: '2024-06-20'
  },
  {
    id: '2',
    name: 'Steel Beam Connection Details',
    description: 'Collection of steel beam-to-column connection details including moment connections and shear connections.',
    category: 'structural',
    version: '2021+',
    fileSize: '28 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 189,
    author: 'Dahar Engineer',
    tags: ['steel', 'connection', 'beam', 'detail'],
    isPremium: true,
    price: 99000,
    requiresLogin: true,
    created: '2024-02-10',
    updated: '2024-07-15'
  },
  {
    id: '3',
    name: 'Foundation Family Collection',
    description: 'Various foundation types including isolated footings, combined footings, and pile caps.',
    category: 'structural',
    version: '2020+',
    fileSize: '42 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 312,
    author: 'Dahar Engineer',
    tags: ['foundation', 'footing', 'pile', 'concrete'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-03-05',
    updated: '2024-08-10'
  },
  {
    id: '4',
    name: 'Architectural Door Family Set',
    description: 'Comprehensive door family set with various styles, materials, and parametric options.',
    category: 'architectural',
    version: '2022+',
    fileSize: '35 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 567,
    author: 'Dahar Engineer',
    tags: ['door', 'architectural', 'parametric'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-01-20',
    updated: '2024-05-15'
  },
  {
    id: '5',
    name: 'Window Family - Modern Series',
    description: 'Modern window family collection with customizable sizes, frames, and glazing options.',
    category: 'architectural',
    version: '2021+',
    fileSize: '48 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 423,
    author: 'Dahar Engineer',
    tags: ['window', 'architectural', 'modern'],
    isPremium: true,
    price: 79000,
    requiresLogin: true,
    created: '2024-04-12',
    updated: '2024-09-01'
  },
  {
    id: '6',
    name: 'HVAC Duct Fittings',
    description: 'Complete HVAC duct fitting family set for mechanical systems design.',
    category: 'mep',
    version: '2022+',
    fileSize: '65 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 156,
    author: 'Dahar Engineer',
    tags: ['hvac', 'duct', 'mep', 'mechanical'],
    isPremium: true,
    price: 149000,
    requiresLogin: true,
    created: '2024-05-20',
    updated: '2024-10-15'
  },
  {
    id: '7',
    name: 'Electrical Panel Families',
    description: 'Electrical panel and switchboard families with various configurations.',
    category: 'mep',
    version: '2020+',
    fileSize: '22 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 278,
    author: 'Dahar Engineer',
    tags: ['electrical', 'panel', 'mep'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-02-28',
    updated: '2024-07-20'
  },
  {
    id: '8',
    name: 'Rebar Detailing Components',
    description: 'Detailed rebar families for concrete reinforcement including standard bar shapes.',
    category: 'detail-components',
    version: '2021+',
    fileSize: '38 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 445,
    author: 'Dahar Engineer',
    tags: ['rebar', 'detailing', 'concrete', 'reinforcement'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-03-15',
    updated: '2024-08-25'
  },
  {
    id: '9',
    name: 'Annotation Tag Collection',
    description: 'Professional annotation tags for dimensions, levels, and structural elements.',
    category: 'annotation',
    version: '2020+',
    fileSize: '8 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 892,
    author: 'Dahar Engineer',
    tags: ['annotation', 'tag', 'dimension'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-01-05',
    updated: '2024-04-10'
  },
  {
    id: '10',
    name: 'Structural Template Project',
    description: 'Complete structural project template with pre-configured views, sheets, and families.',
    category: 'template',
    version: '2022+',
    fileSize: '125 MB',
    fileFormat: '.rvt',
    downloadCount: 678,
    author: 'Dahar Engineer',
    tags: ['template', 'structural', 'project'],
    isPremium: true,
    price: 199000,
    requiresLogin: true,
    created: '2024-06-01',
    updated: '2024-11-01'
  },
  {
    id: '11',
    name: 'Slab Edge Detail Components',
    description: 'Detailed slab edge and coping families for various construction types.',
    category: 'detail-components',
    version: '2021+',
    fileSize: '18 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 234,
    author: 'Dahar Engineer',
    tags: ['slab', 'edge', 'detail', 'coping'],
    isPremium: false,
    requiresLogin: false,
    created: '2024-04-20',
    updated: '2024-09-15'
  },
  {
    id: '12',
    name: 'Curtain Wall System Family',
    description: 'Advanced curtain wall system with customizable panels, mullions, and transoms.',
    category: 'architectural',
    version: '2022+',
    fileSize: '55 MB',
    fileFormat: '.rfa',
    downloadUrl: '#',
    downloadCount: 345,
    author: 'Dahar Engineer',
    tags: ['curtain wall', 'facade', 'architectural'],
    isPremium: true,
    price: 129000,
    requiresLogin: true,
    created: '2024-07-10',
    updated: '2024-11-20'
  }
];

// Category definitions
const categories: { id: RevitCategory; name: string; icon: React.ElementType; description: string }[] = [
  { id: 'structural', name: 'Structural', icon: HardHat, description: 'Columns, beams, foundations, and structural elements' },
  { id: 'architectural', name: 'Architectural', icon: Building2, description: 'Doors, windows, walls, and architectural elements' },
  { id: 'mep', name: 'MEP', icon: Zap, description: 'Mechanical, electrical, and plumbing components' },
  { id: 'detail-components', name: 'Detail Components', icon: Ruler, description: 'Rebar, connections, and detailing elements' },
  { id: 'annotation', name: 'Annotation', icon: FileText, description: 'Tags, dimensions, and annotation families' },
  { id: 'template', name: 'Templates', icon: Box, description: 'Project templates and starter files' },
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
            <Box className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              REVIT LIBRARY
            </span>
          </motion.div>

          <TextReveal
            text="Revit Families"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="& Templates"
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
            Download high-quality Revit families and templates for your BIM projects. 
            All files are professionally created and regularly updated.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// File Card Component
function FileCard({ file, index }: { file: RevitFile; index: number }) {
  const { isAuthenticated } = useAuth();
  
  const canDownload = !file.requiresLogin || (file.requiresLogin && isAuthenticated);

  const handleDownload = () => {
    if (file.requiresLogin && !isAuthenticated) {
      window.location.href = '/login?redirect=/revit-files';
      return;
    }
    if (file.isPremium && !isAuthenticated) {
      window.location.href = '/login?redirect=/revit-files';
      return;
    }
    // Download logic here
    console.log('Downloading:', file.id);
  };

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className="group h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                      hover:border-army-500/30 transition-all duration-300">
        {/* Preview */}
        <div className="aspect-video bg-gradient-to-br from-army-800/20 to-army-900/20 
                        flex items-center justify-center relative overflow-hidden">
          <Box className="w-16 h-16 text-army-700/40 group-hover:scale-110 transition-transform" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {file.isPremium && (
              <Badge className="bg-amber-600 text-white">
                <Star className="w-3 h-3 mr-1 fill-current" />
                PREMIUM
              </Badge>
            )}
            <Badge variant="outline" className="bg-background/80">
              {file.version}
            </Badge>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-army-900/80 opacity-0 group-hover:opacity-100 
                          transition-opacity flex items-center justify-center">
            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="bg-army-700 hover:bg-army-600"
            >
              {file.requiresLogin && !isAuthenticated ? (
                <><Lock className="w-4 h-4 mr-2" /> Login to Download</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Download</>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {file.fileFormat}
            </Badge>
            <span className="text-xs text-muted-foreground">{file.fileSize}</span>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-2">
            {file.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {file.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Download className="w-4 h-4" />
                {file.downloadCount}
              </span>
              <span className="text-muted-foreground">
                by {file.author}
              </span>
            </div>
            {file.isPremium && file.price && (
              <span className="font-semibold text-army-400">
                Rp {file.price.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {file.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-background text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// Main Content Section
function FilesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RevitCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<RevitFilter['sortBy']>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFiles = useMemo(() => {
    let files = [...mockRevitFiles];

    // Filter by category
    if (selectedCategory !== 'all') {
      files = files.filter(f => f.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      files = files.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
      case 'popular':
        files.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'name':
        files.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        // Simple size comparison (would need proper parsing in real app)
        files.sort((a, b) => parseFloat(b.fileSize) - parseFloat(a.fileSize));
        break;
    }

    return files;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Category Pills */}
          <SectionReveal>
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-army-700' : ''}
              >
                All Files
                <Badge variant="secondary" className="ml-2">
                  {mockRevitFiles.length}
                </Badge>
              </Button>
              {categories.map((cat) => {
                const Icon = cat.icon;
                const count = mockRevitFiles.filter(f => f.category === cat.id).length;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? 'bg-army-700' : ''}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {cat.name}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </SectionReveal>

          {/* Filters */}
          <SectionReveal delay={0.1}>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search files by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as RevitFilter['sortBy'])}
                  className="px-4 py-2 bg-background border border-border/50 rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Downloaded</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">File Size</option>
                </select>

                {/* View Mode */}
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-army-700' : ''}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-army-700' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SectionReveal>

          {/* Results Count */}
          <SectionReveal delay={0.2}>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            </p>
          </SectionReveal>

          {/* Files Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' 
            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'}`}>
            {filteredFiles.map((file, index) => (
              <FileCard key={file.id} file={file} index={index} />
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-20">
              <Box className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Categories Detail Section
function CategoriesDetailSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-12 text-center">
              Browse by Category
            </h2>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const count = mockRevitFiles.filter(f => f.category === category.id).length;
              
              return (
                <SectionReveal key={category.id} delay={0.1 * (index + 1)}>
                  <div className="group p-8 bg-background border border-border/30 
                                  hover:border-army-500/30 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-army-700/20 flex items-center justify-center mb-4
                                    group-hover:bg-army-700 transition-colors">
                      <Icon className="w-7 h-7 text-army-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-army-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {count} files
                      </span>
                      <span className="text-army-400 group-hover:translate-x-1 transition-transform">
                        Browse →
                      </span>
                    </div>
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

// Main Revit Files Page
export default function RevitFiles() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <FilesSection />
        <CategoriesDetailSection />
      </div>
    </div>
  );
}

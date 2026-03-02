import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  GraduationCap,
  Scale,
  FileDown,
  Lock,
  Calendar,
  User,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { resourceService } from '@/services/pb/resources';
import type { Resource } from '@/types/resources';

// Category definitions
const categories = [
  {
    id: 'ebooks',
    name: 'E-Books',
    icon: BookOpen,
    description: 'Comprehensive books and guides for engineering topics',
  },
  {
    id: 'modul',
    name: 'Modules',
    icon: GraduationCap,
    description: 'Structured learning modules and training materials',
  },
  {
    id: 'regulations',
    name: 'Regulations',
    icon: Scale,
    description: 'Official standards and regulatory documents',
  }
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

// Resource Card Component
// Resource Card Component
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const { isAuthenticated } = useAuth();

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'e-book': return BookOpen;
      case 'module': return GraduationCap;
      case 'regulation': return Scale;
      default: return FileText;
    }
  };

  const Icon = getCategoryIcon(resource.category);
  const downloadUrl = resourceService.getDownloadUrl(resource);

  const handleDownload = async () => {
    try {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      // Track download in background
      resourceService.incrementDownload(resource.id, resource.download_count || 0).catch(console.error);

      // Create a temporary link to trigger download (more robust against adblockers than window.open)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.download = resource.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className="group h-full bg-secondary/5 hover:bg-secondary/15 border border-border/10 
                      hover:border-army-500/30 transition-all duration-300 rounded-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/5">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-army-700/10 flex items-center justify-center rounded-sm
                            group-hover:bg-army-700/20 transition-colors">
              <Icon className="w-5 h-5 text-army-400" />
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <Badge variant="outline" className="text-[9px] uppercase h-5 px-1.5 border-border/20 rounded-sm">
                {resource.category}
              </Badge>
              {resource.subcategory && (
                <span className="text-[9px] text-muted-foreground uppercase opacity-50 tracking-wider">
                  {resource.subcategory}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold mb-1 group-hover:text-army-400 transition-colors line-clamp-1">
            {resource.title}
          </h3>

          <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 min-h-[32px] opacity-80 leading-relaxed">
            {resource.description}
          </p>

          <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground mb-4 opacity-70">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {resource.author || resource.uploaded_by_name}
            </span>
            {resource.year_released && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {resource.year_released}
              </span>
            )}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between pt-3 border-t border-border/5 mb-3">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-secondary/20 rounded-sm">
                  <FileDown className="w-3 h-3" />
                  {resource.file_type?.split('/').pop()?.toUpperCase() || 'FILE'}
                </span>
                <span className="opacity-60">{formatSize(resource.file_size)}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] opacity-60">
                <Download className="w-3 h-3" />
                {resource.download_count || 0}
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-army-700 hover:bg-army-600 h-8 text-[11px] rounded-sm transition-all"
            >
              {!isAuthenticated ? (
                <><Lock className="w-3 h-3 mr-2" /> Login to Access</>
              ) : (
                <><Download className="w-3 h-3 mr-2" /> Download Document</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 20;

// Resources Listing Section
function ResourcesListingSection({ resources, isLoading }: { resources: Resource[]; isLoading: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Extract unique subcategories from resources based on active category
  const availableSubcategories = useMemo(() => {
    const subs = new Set<string>();
    const sourceResources = selectedCategory === 'all'
      ? resources
      : resources.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());

    sourceResources.forEach(r => {
      if (r.subcategory) subs.add(r.subcategory);
    });
    return Array.from(subs).sort();
  }, [resources, selectedCategory]);

  const filteredResources = useMemo(() => {
    let result = [...resources];

    if (selectedCategory !== 'all') {
      result = result.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSubcategory !== 'all') {
      result = result.filter(r => r.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.author?.toLowerCase().includes(query) ||
        r.uploaded_by_name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [resources, searchQuery, selectedCategory, selectedSubcategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  // Scroll to section when page changes
  useEffect(() => {
    if (currentPage > 1) { // Only scroll if not the first page or filter reset
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
  };

  return (
    <section ref={sectionRef} className="relative flex items-center bg-background py-12">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Category Selection */}
          <SectionReveal>
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = resources.filter(r => r.category?.toLowerCase() === category.id).length;
                const isSelected = selectedCategory === category.id;

                return (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'all' : category.id);
                      setSelectedSubcategory('all');
                    }}
                    className={`cursor-pointer p-4 border transition-all duration-200 rounded-sm ${isSelected
                      ? 'border-army-500 bg-army-700/10'
                      : 'border-border/20 bg-secondary/10 hover:bg-secondary/20'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-sm shrink-0`}>
                        <Icon className="w-4 h-4 text-army-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{category.name}</h3>
                        <p className="text-[10px] text-muted-foreground truncate opacity-70">{count} Documents</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionReveal>

          {/* Search and Subcategory Selection */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-50" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/5 border-border/20 h-9 text-xs rounded-sm"
              />
            </div>

            {availableSubcategories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2 font-medium">Sub Category:</span>
                <Badge
                  onClick={() => setSelectedSubcategory('all')}
                  variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
                  className={`cursor-pointer px-2 py-0.5 text-[9px] rounded-sm transition-colors border-border/30 h-6 ${selectedSubcategory === 'all' ? 'bg-army-700 hover:bg-army-600' : 'hover:bg-army-700/10'
                    }`}
                >
                  ALL
                </Badge>
                {availableSubcategories.map(sub => (
                  <Badge
                    key={sub}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? 'all' : sub)}
                    variant={selectedSubcategory === sub ? 'default' : 'outline'}
                    className={`cursor-pointer px-2 py-0.5 text-[9px] rounded-sm transition-colors border-border/30 h-6 ${selectedSubcategory === sub ? 'bg-army-700 hover:bg-army-600' : 'hover:bg-army-700/10'
                      }`}
                  >
                    {sub}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Active Filter Badge Bar */}
          {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-1">
              <span className="text-[10px] text-muted-foreground italic">Filtered results for {filteredResources.length} matches:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-5 text-[9px] text-army-400 hover:text-army-300 px-1 hover:bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-army-500 mb-4 opacity-50" />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">Fetching Database Resources...</p>
            </div>
          ) : paginatedResources.length > 0 ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedResources.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} index={index} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8 border-t border-border/5">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={`cursor-pointer text-[10px] rounded-sm h-8 ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        // Basic logic to show limited page numbers
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={(e) => { e.preventDefault(); setCurrentPage(pageNumber); }}
                                className={`cursor-pointer text-[10px] rounded-sm w-8 h-8 ${currentPage === pageNumber ? 'bg-army-700 border-army-600' : ''}`}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (pageNumber === currentPage - 2 && pageNumber > 1) ||
                          (pageNumber === currentPage + 2 && pageNumber < totalPages)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={`cursor-pointer text-[10px] rounded-sm h-8 ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/10 rounded-sm bg-secondary/5">
              <FileText className="w-8 h-8 text-muted-foreground/10 mx-auto mb-3" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No resources found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Stats Preview
function StatsPreview({ resources }: { resources: Resource[] }) {
  const totalDownloads = resources.reduce((acc, r) => acc + (r.download_count || 0), 0);
  const categoriesCount = new Set(resources.map(r => r.category)).size;

  return (
    <section className="relative bg-secondary/5 py-12">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { value: resources.length.toString(), label: 'RESOURCES' },
              { value: totalDownloads.toLocaleString(), label: 'DOWNLOADS' },
              { value: categoriesCount.toString(), label: 'DOMAINS' }
            ].map((stat, index) => (
              <SectionReveal key={stat.label} delay={0.05 * (index + 1)}>
                <div className="p-6 bg-background/50 border border-border/10 rounded-sm text-center">
                  <div className="text-2xl font-bold text-army-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] opacity-60">
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
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await resourceService.getResources();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen pointer-events-none" />
      <div className="relative z-10 bg-background">
        <ResourcesListingSection resources={resources} isLoading={isLoading} />
        <StatsPreview resources={resources} />
      </div>
    </div>
  );
}

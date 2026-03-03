import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Search,
  Download,
  Grid3X3,
  List,
  FileText,
  Loader2,
  ChevronDown,
  Upload,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { revitService } from '@/services/pb/revit';
import type { RevitFile } from '@/types/revit';
import { RevitCategory } from '@/types/revit';
import { UploadModal } from '@/components/revit/UploadModal';

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

// File Card Component
function FileCard({ file, index, viewMode }: { file: RevitFile; index: number; viewMode: 'grid' | 'list' }) {
  const { isAuthenticated } = useAuth();

  const handleDownload = async () => {
    try {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      revitService.incrementDownload(file.id, file.download_count || 0).catch(console.error);

      const downloadUrl = revitService.getDownloadUrl(file);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = file.file_name || file.display_name || 'revit-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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

  const previewUrl = revitService.getPreviewUrl(file);

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className={`group bg-secondary/5 hover:bg-secondary/10 border border-border/10 
                      hover:border-army-500/30 transition-all duration-300 rounded-sm overflow-hidden flex ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-row items-center gap-6 p-4'
        }`}>
        {/* Preview */}
        <div className={`${viewMode === 'grid' ? 'w-full' : 'w-48 shrink-0'} 
                        bg-gradient-to-br from-army-800/20 to-army-900/20 aspect-1/1
                        flex items-center justify-center relative overflow-hidden rounded-sm`}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={file.display_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Box className="w-12 h-12 text-army-700/40 group-hover:scale-110 transition-transform" />
          )}

          {/* Version Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-background/80 text-[9px] h-5 border-border/20 rounded-sm">
              {file.revit_version}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 ${viewMode === 'grid' ? 'p-4' : 'p-0'}`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-army-400 font-medium uppercase tracking-wider">
              {RevitCategory.find(cat => cat.id === file.category)?.name || file.category}
            </span>
            <span className="text-[10px] text-muted-foreground opacity-60">
              {formatSize(file.file_size)}
            </span>
          </div>

          <h3 className="text-sm font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-1">
            {file.display_name}
          </h3>

          <div className="flex flex-col gap-2 text-[10px] text-muted-foreground mb-2 opacity-70">
            <span className="flex items-center gap-1">
              uploaded by:
              <span className="text-[10px] text-muted-foreground opacity-60"></span>{file.uploaded_by_name}
            </span>
            <span className="flex items-center gap-1">
              version:
              <span className="text-[10px] text-muted-foreground opacity-60"></span>{new Date(file.created).getFullYear()}
            </span>
            <span className="flex items-center gap-1">
              extension:
              <span className="text-[10px] text-muted-foreground opacity-60"></span>{file.file_name?.split('.').pop()?.toUpperCase() || 'RFA'}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/5">
            <div className="flex items-center gap-2 text-[10px]">
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-army-700 hover:bg-army-600 h-8 text-[11px] rounded-sm"
              >
                {!isAuthenticated ? (
                  <><Download className="w-3 h-3 mr-2" /> Login to Download</>
                ) : (
                  <><Download className="w-3 h-3 mr-2" /> Download</>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-[10px] opacity-60">
              <Download className="w-3 h-3" />
              {file.download_count || 0}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

const ITEMS_PER_PAGE = 20;

// Main Content Section
function FilesSection({
  files,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  sectionRef,
  onUploadClick
}: {
  files: RevitFile[];
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sectionRef: React.RefObject<HTMLElement | null>;
  onUploadClick: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(f => f.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.display_name?.toLowerCase().includes(query) ||
        f.uploaded_by_name?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
        break;
      case 'name':
        result.sort((a, b) => a.display_name.localeCompare(b.display_name));
        break;
      case 'size':
        result.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
        break;
    }

    return result;
  }, [files, searchQuery, selectedCategory, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Scroll to section when page changes
  useEffect(() => {
    if (currentPage > 1) { // Only scroll if not the first page or filter reset
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, sectionRef]);

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFiles, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <section ref={sectionRef} className="relative flex items-center bg-background py-16">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Category Selection */}
          <SectionReveal>
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={`text-[10px] h-8 rounded-sm transition-all ${selectedCategory === 'all' ? 'bg-army-700 hover:bg-army-600' : 'hover:bg-army-700/10'}`}
              >
                All Assets
                <Badge variant="secondary" className="ml-2 h-4 text-[9px] px-1 bg-secondary/50 rounded-sm">
                  {files.length}
                </Badge>
              </Button>
              {RevitCategory.map((cat) => {
                const count = files.filter(f => f.category?.toLowerCase() === cat.id).length;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-[10px] h-8 rounded-sm transition-all ${selectedCategory === cat.id ? 'bg-army-700 hover:bg-army-600' : 'hover:bg-army-700/10'}`}
                  >
                    {cat.name}
                    <Badge variant="secondary" className="ml-2 h-4 text-[9px] px-1 bg-secondary/50 rounded-sm">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </SectionReveal>

          {/* Toolbar */}
          <SectionReveal delay={0.1}>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <Button
                onClick={onUploadClick}
                className="bg-army-700 hover:bg-army-600 h-10 px-6 text-xs font-bold uppercase tracking-widest rounded-sm shrink-0 shadow-md group"
              >
                <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Upload File
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/10 border-border/20 h-10 text-xs rounded-sm focus-visible:ring-army-500/50"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-secondary/10 border border-border/20 rounded-sm text-[11px] h-10 focus:outline-none focus:ring-1 focus:ring-army-500/50"
                >
                  <option value="newest" className='text-black'>Recent Uploads</option>
                  <option value="popular" className='text-black'>Most Popular</option>
                  <option value="name" className='text-black'>Alphabetical</option>
                  <option value="size" className='text-black'>Largest Size</option>
                </select>

                <div className="flex border border-border/20 rounded-sm overflow-hidden h-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={`h-full rounded-none px-3 ${viewMode === 'grid' ? 'bg-army-700 text-white' : 'bg-secondary/10 opacity-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={`h-full rounded-none px-3 ${viewMode === 'list' ? 'bg-army-700 text-white' : 'bg-secondary/10 opacity-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Active Filter Info */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/20">
              <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest opacity-80">
                Found {filteredFiles.length} Match{filteredFiles.length !== 1 ? 'es' : ''}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 text-[10px] text-army-400 hover:text-army-300 hover:bg-army-500/10 px-2"
              >
                Reset All
              </Button>
            </div>
          )}

          {/* Grid / Loader */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-army-500 mb-4 opacity-50" />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">Syncing Asset Library...</p>
            </div>
          ) : paginatedFiles.length > 0 ? (
            <div className="space-y-12">
              <div className={`grid gap-4 ${viewMode === 'grid'
                ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {paginatedFiles.map((file, index) => (
                  <FileCard key={file.id} file={file} index={index} viewMode={viewMode} />
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No assets match your search</p>
              <Button
                variant="link"
                onClick={resetFilters}
                className="text-army-400 mt-4 text-xs h-auto p-0"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Stats Preview
function StatsBar({ files }: { files: RevitFile[] }) {
  const totalDownloads = files.reduce((acc, f) => acc + (f.download_count || 0), 0);
  const categoriesCount = new Set(files.map(f => f.category)).size;

  return (
    <section className="relative bg-secondary/5 py-12">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { value: files.length.toString(), label: 'ASSETS' },
              { value: totalDownloads.toLocaleString(), label: 'DOWNLOADS' },
              { value: categoriesCount.toString(), label: 'DOMAINS' }
            ].map((stat, index) => (
              <SectionReveal key={stat.label} delay={0.05 * (index + 1)}>
                <div className="p-6 bg-background/50 border border-border/10 rounded-sm text-center">
                  <div className="text-2xl font-bold text-army-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] opacity-60" >
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

// Categories Detail Section
function CategoriesDetailSection({ files, onCategorySelect }: { files: RevitFile[]; onCategorySelect: (id: string) => void }) {
  return (
    <section className="relative bg-background py-20">
      <div className="w-full px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Structured BIM Library
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto opacity-70">
                Browse our curated collections of Revit assets designed to streamline your modeling workflow.
              </p>
            </div>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RevitCategory.map((category, index) => {
              const count = files.filter(f => f.category?.toLowerCase() === category.id).length;

              return (
                <SectionReveal key={category.id} delay={0.1 * (index + 1)}>
                  <div
                    onClick={() => onCategorySelect(category.id)}
                    className="group p-6 bg-secondary/5 border border-border/10 
                                  hover:border-army-500/30 transition-all duration-300 rounded-sm cursor-pointer"
                  >
                    <h3 className="text-sm font-semibold mb-2 group-hover:text-army-400 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-muted-foreground font-medium opacity-60">
                        {count} assets
                      </span>
                      <span className="text-[10px] text-army-400 group-hover:translate-x-1 transition-transform font-bold">
                        EXPLORE →
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
  const [files, setFiles] = useState<RevitFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const filesSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const data = await revitService.getRevitFiles();
        setFiles(data);
      } catch (error) {
        console.error('Failed to fetch revit files:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleUploadSuccess = async () => {
    // Refresh files
    const data = await revitService.getRevitFiles();
    setFiles(data);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen pointer-events-none" />
      <div className="relative z-10 bg-background">
        <FilesSection
          files={files}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sectionRef={filesSectionRef}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        <StatsBar files={files} />
        <CategoriesDetailSection files={files} onCategorySelect={handleCategorySelect} />
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}

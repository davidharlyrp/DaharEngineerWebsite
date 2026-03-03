import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Clock,
  Eye,
  Heart,
  Loader2,
  ChevronDown,
  User
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogService } from '@/services/pb/blog';
import type { DaharBlog } from '@/types/blog';

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
              BLOG
            </span>
          </motion.div>

          <TextReveal
            text="Engineering"
            tag="h1"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            delay={0.3}
          />
          <TextReveal
            text="Insights"
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
            Tutorials, case studies, industry insights, and tips from our team of experienced engineers.
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

// Featured Post Card
function FeaturedPostCard({ post }: { post: DaharBlog }) {
  const thumbnailUrl = blogService.getThumbnailUrl(post);

  return (
    <SectionReveal>
      <Link
        to={`/blog/${post.page_name}`}
        className="group block bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                   hover:border-army-500/30 transition-all duration-300 overflow-hidden"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-gradient-to-br from-army-800/30 to-army-900/30 
                          flex items-center justify-center">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-army-700/40 group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:hidden" />
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center relative bg-background/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-army-700 font-bold uppercase tracking-widest text-[10px] rounded-sm">{post.category}</Badge>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 opacity-60">
                <Clock className="w-3.5 h-3.5" />
                {post.read_time}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-army-400 transition-colors tracking-tight">
              {post.title}
            </h2>

            <p className="text-sm text-muted-foreground/70 mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-army-700/20 rounded-full flex items-center justify-center border border-army-500/10">
                  <span className="text-xs font-bold text-army-400">
                    <User />
                  </span>
                </div>
                <div>
                  <p className="text-[12px] font-bold tracking-tight">{post.author}</p>
                  <p className="text-[10px] text-muted-foreground opacity-50">
                    {new Date(post.published_date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <span className="text-army-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                Read Article →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}

// Regular Post Card
function PostCard({ post, index }: { post: DaharBlog; index: number }) {
  const thumbnailUrl = blogService.getThumbnailUrl(post);

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <Link
        to={`/blog/${post.page_name}`}
        className="group block h-full bg-secondary/10 hover:bg-secondary/20 border border-border/5 
                   hover:border-army-500/20 transition-all duration-300 rounded-sm overflow-hidden flex flex-col"
      >
        {/* Image */}
        <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-army-800/10 to-army-900/10 
                        flex items-center justify-center">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
            />
          ) : (
            <BookOpen className="w-10 h-10 text-army-700/30 group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-secondary/30 rounded-full px-2">{post.category}</Badge>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-50 font-medium">
              <Clock className="w-3 h-3" />
              {post.read_time}
            </span>
          </div>

          <h3 className="text-base font-bold mb-2 group-hover:text-army-400 transition-colors line-clamp-2 leading-snug tracking-tight">
            {post.title}
          </h3>

          <p className="text-xs text-muted-foreground/60 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-[10px] mt-auto pt-4 border-t border-border/5">
            <span className="text-muted-foreground font-medium">
              {new Date(post.published_date).toLocaleDateString('id-ID', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <div className="flex items-center gap-3 text-muted-foreground font-bold">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.view_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {post.like_count || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}

// Blog Content Section
function BlogContentSection({ blogs, isLoading }: { blogs: DaharBlog[], isLoading: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(blogs.map(b => b.category)))];
    return cats.map(c => ({
      id: c,
      name: c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1),
      count: c === 'all' ? blogs.length : blogs.filter(b => b.category === c).length
    }));
  }, [blogs]);

  const filteredPosts = useMemo(() => {
    let posts = [...blogs];

    // Filter by category
    if (selectedCategory !== 'all') {
      posts = posts.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags_keyword.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [blogs, searchQuery, selectedCategory]);

  const featuredPosts = filteredPosts.slice(0, 1);
  const regularPosts = filteredPosts;

  return (
    <section className="relative flex items-center bg-background min-h-screen">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <SectionReveal>
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  placeholder="Search articles by title, content or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/5 border-border/10 h-10 text-xs rounded-sm focus-visible:ring-army-500/30"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`h-10 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all
                      ${selectedCategory === cat.id ? 'bg-army-700 text-white border-transparent' : 'bg-transparent border-border/10 text-muted-foreground hover:bg-secondary/20'}`}
                  >
                    {cat.name}
                    <span className="ml-2 opacity-50 font-normal">({cat.count})</span>
                  </Button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-army-500 animate-spin" />
              <p className="text-xs text-muted-foreground/60 font-medium tracking-widest uppercase">Fetching Articles...</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && selectedCategory === 'all' && !searchQuery && (
                <div className="mb-16">
                  <SectionReveal>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-army-500/60 mb-6 flex items-center gap-3">
                      <div className="h-px w-8 bg-army-500/20" /> Featured Article
                    </h2>
                  </SectionReveal>
                  <div className="space-y-6">
                    {featuredPosts.map((post) => (
                      <FeaturedPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <SectionReveal delay={0.1}>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold tracking-tight">
                      {selectedCategory === 'all' ? 'Recent Publications' : categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">
                      {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </SectionReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedCategory !== 'all' || searchQuery ? filteredPosts : regularPosts).map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-24 bg-secondary/5 rounded-sm border border-dashed border-border/10">
                    <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground/60 font-medium">No articles found matching your criteria</p>
                    <Button
                      variant="ghost"
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                      className="mt-4 text-xs font-bold text-army-500 hover:text-army-400"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Main Blog Page
export default function Blog() {
  const [blogs, setBlogs] = useState<DaharBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen pointer-events-none" />
      <div className="relative z-10 bg-background">
        <BlogContentSection blogs={blogs} isLoading={isLoading} />
      </div>
    </div>
  );
}

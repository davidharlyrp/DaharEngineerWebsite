import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Clock,
  Eye,
  Heart
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BlogPost, BlogCategory } from '@/types';

// Mock blog posts data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Seismic Load Analysis in ETABS',
    slug: 'understanding-seismic-load-analysis-etabs',
    excerpt: 'Learn the fundamentals of seismic load analysis and how to properly apply SNI 1726:2019 standards in your ETABS models.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer',
      bio: 'Founder of Dahar Engineer with expertise in structural analysis and design.'
    },
    category: 'tutorial',
    tags: ['ETABS', 'seismic', 'analysis', 'SNI', 'tutorial'],
    readTime: 15,
    viewCount: 2345,
    likeCount: 178,
    isFeatured: true,
    isPublished: true,
    publishedDate: '2024-11-15',
    created: '2024-11-10',
    updated: '2024-11-15'
  },
  {
    id: '2',
    title: 'Best Practices for Revit Structural Modeling',
    slug: 'best-practices-revit-structural-modeling',
    excerpt: 'Discover the essential best practices for creating accurate and efficient structural models in Revit.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'tips-tricks',
    tags: ['Revit', 'BIM', 'modeling', 'best-practices'],
    readTime: 12,
    viewCount: 1890,
    likeCount: 145,
    isFeatured: true,
    isPublished: true,
    publishedDate: '2024-11-10',
    created: '2024-11-05',
    updated: '2024-11-10'
  },
  {
    id: '3',
    title: 'New Updates to SNI 2847:2019 for Concrete Design',
    slug: 'new-updates-sni-2847-2019-concrete-design',
    excerpt: 'A comprehensive overview of the latest amendments to the Indonesian concrete design standard.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'news',
    tags: ['SNI', 'concrete', 'regulations', 'updates'],
    readTime: 8,
    viewCount: 3456,
    likeCount: 234,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-11-05',
    created: '2024-11-01',
    updated: '2024-11-05'
  },
  {
    id: '4',
    title: 'Case Study: High-Rise Building Foundation Design',
    slug: 'case-study-high-rise-building-foundation-design',
    excerpt: 'An in-depth analysis of the foundation design challenges and solutions for a 40-story building project.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'case-study',
    tags: ['foundation', 'case-study', 'high-rise', 'geotechnical'],
    readTime: 20,
    viewCount: 1567,
    likeCount: 189,
    isFeatured: true,
    isPublished: true,
    publishedDate: '2024-10-28',
    created: '2024-10-20',
    updated: '2024-10-28'
  },
  {
    id: '5',
    title: 'Introduction to Geotechnical Engineering for Structural Engineers',
    slug: 'introduction-geotechnical-engineering-structural-engineers',
    excerpt: 'A beginner-friendly guide to understanding soil mechanics and foundation engineering principles.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'tutorial',
    tags: ['geotechnical', 'foundation', 'soil', 'tutorial'],
    readTime: 18,
    viewCount: 2123,
    likeCount: 167,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-10-20',
    created: '2024-10-15',
    updated: '2024-10-20'
  },
  {
    id: '6',
    title: 'The Future of BIM in Indonesian Construction Industry',
    slug: 'future-bim-indonesian-construction-industry',
    excerpt: 'Exploring the trends and opportunities for Building Information Modeling adoption in Indonesia.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'industry-insights',
    tags: ['BIM', 'industry', 'technology', 'future'],
    readTime: 10,
    viewCount: 2890,
    likeCount: 256,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-10-15',
    created: '2024-10-10',
    updated: '2024-10-15'
  },
  {
    id: '7',
    title: 'How to Use DEColumn for Column Design',
    slug: 'how-to-use-decolumn-column-design',
    excerpt: 'Step-by-step tutorial on using our DEColumn web application for efficient column design.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'software',
    tags: ['DEColumn', 'software', 'tutorial', 'column', 'design'],
    readTime: 8,
    viewCount: 1234,
    likeCount: 98,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-10-08',
    created: '2024-10-05',
    updated: '2024-10-08'
  },
  {
    id: '8',
    title: 'Steel Connection Design: Common Mistakes to Avoid',
    slug: 'steel-connection-design-common-mistakes-avoid',
    excerpt: 'Learn about the most common errors in steel connection design and how to prevent them.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'tips-tricks',
    tags: ['steel', 'connection', 'design', 'mistakes'],
    readTime: 14,
    viewCount: 1789,
    likeCount: 134,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-10-01',
    created: '2024-09-25',
    updated: '2024-10-01'
  },
  {
    id: '9',
    title: 'Understanding Load Combinations per SNI 1727:2020',
    slug: 'understanding-load-combinations-sni-1727-2020',
    excerpt: 'A comprehensive guide to load combinations for building structure design in Indonesia.',
    content: '',
    author: {
      id: '1',
      name: 'David Prabudhi',
      role: 'Structural Engineer'
    },
    category: 'tutorial',
    tags: ['loads', 'SNI', 'combinations', 'design'],
    readTime: 16,
    viewCount: 2678,
    likeCount: 198,
    isFeatured: false,
    isPublished: true,
    publishedDate: '2024-09-25',
    created: '2024-09-20',
    updated: '2024-09-25'
  }
];

// Category definitions
const categories: { id: BlogCategory; name: string; count: number }[] = [
  { id: 'tutorial', name: 'Tutorials', count: mockPosts.filter(p => p.category === 'tutorial').length },
  { id: 'news', name: 'News', count: mockPosts.filter(p => p.category === 'news').length },
  { id: 'tips-tricks', name: 'Tips & Tricks', count: mockPosts.filter(p => p.category === 'tips-tricks').length },
  { id: 'case-study', name: 'Case Studies', count: mockPosts.filter(p => p.category === 'case-study').length },
  { id: 'industry-insights', name: 'Industry Insights', count: mockPosts.filter(p => p.category === 'industry-insights').length },
  { id: 'software', name: 'Software', count: mockPosts.filter(p => p.category === 'software').length },
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
      </motion.div>
    </div>
  );
}

// Featured Post Card
function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <SectionReveal>
      <Link 
        to={`/blog/${post.slug}`}
        className="group block bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                   hover:border-army-500/30 transition-all duration-300"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-army-800/30 to-army-900/30 
                          flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-army-700/40 group-hover:scale-110 transition-transform" />
          </div>
          
          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-army-700">{post.category}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-army-400 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-muted-foreground mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-army-700/30 flex items-center justify-center">
                  <span className="text-sm font-semibold text-army-400">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.publishedDate).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <span className="text-army-400 group-hover:translate-x-1 transition-transform">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}

// Regular Post Card
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <Link 
        to={`/blog/${post.slug}`}
        className="group block h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                   hover:border-army-500/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-army-800/20 to-army-900/20 
                        flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-army-700/40 group-hover:scale-110 transition-transform" />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {new Date(post.publishedDate).toLocaleDateString('id-ID', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likeCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}

// Blog Content Section
function BlogContentSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');

  const filteredPosts = useMemo(() => {
    let posts = [...mockPosts];

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
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return posts;
  }, [searchQuery, selectedCategory]);

  const featuredPosts = filteredPosts.filter(p => p.isFeatured).slice(0, 2);
  const regularPosts = filteredPosts.filter(p => !p.isFeatured || !featuredPosts.includes(p));

  return (
    <section className="section-fullscreen relative flex items-center bg-background">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <SectionReveal>
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-army-700' : ''}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? 'bg-army-700' : ''}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && selectedCategory === 'all' && !searchQuery && (
            <div className="mb-16">
              <SectionReveal>
                <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'all' ? 'Latest Articles' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
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
            {categories.map((category, index) => (
              <SectionReveal key={category.id} delay={0.1 * (index + 1)}>
                <Link
                  to={`/blog/category/${category.id}`}
                  className="group block p-8 bg-background border border-border/30 
                             hover:border-army-500/30 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-army-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.count} articles
                  </p>
                  <span className="text-army-400 group-hover:translate-x-1 transition-transform inline-block">
                    Browse →
                  </span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-army-950">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="w-full px-6 lg:px-20 py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tutorials, and industry insights delivered to your inbox.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border-border/50"
              />
              <Button className="bg-army-700 hover:bg-army-600">
                Subscribe
              </Button>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// Main Blog Page
export default function Blog() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <BlogContentSection />
        <CategoriesSection />
        <NewsletterSection />
      </div>
    </div>
  );
}

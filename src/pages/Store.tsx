import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Star,
  ArrowRight,
  Grid3X3,
  List,
  ShoppingCart,
  Tag,
  TrendingUp,
  Sparkles,
  Download
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { CheckoutModal } from '@/components/store/CheckoutModal';
import type { Product, ProductCategory } from '@/types';

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Structural Column Revit Family',
    description: 'Complete collection of structural column families for Revit with various sizes and reinforcement details.',
    price: 299000,
    originalPrice: 399000,
    category: 'revit-family',
    thumbnail: '',
    features: ['20+ column types', 'Parametric design', 'Detail components included'],
    rating: 4.8,
    reviewCount: 45,
    soldCount: 128,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    slug: 'structural-column-revit-family',
    created: '2024-01-15',
    updated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Beam Design Excel Template',
    description: 'Comprehensive Excel template for reinforced concrete beam design with automatic calculations.',
    price: 149000,
    category: 'excel-template',
    thumbnail: '',
    features: ['Auto-calculation', 'SNI compliance', 'Graphical output'],
    rating: 4.9,
    reviewCount: 67,
    soldCount: 234,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    slug: 'beam-design-excel-template',
    created: '2024-02-01',
    updated: '2024-02-01'
  },
  {
    id: '3',
    name: 'Foundation Calculation Sheet',
    description: 'Complete calculation sheet for various foundation types including shallow and deep foundations.',
    price: 199000,
    category: 'calculation-sheet',
    thumbnail: '',
    features: ['Multiple foundation types', 'Bearing capacity', 'Settlement analysis'],
    rating: 4.7,
    reviewCount: 32,
    soldCount: 89,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    slug: 'foundation-calculation-sheet',
    created: '2024-11-20',
    updated: '2024-11-20'
  },
  {
    id: '4',
    name: 'Structural Drawing Template',
    description: 'Professional AutoCAD and Revit templates for structural engineering drawings.',
    price: 249000,
    category: 'drawing-template',
    thumbnail: '',
    features: ['Title blocks', 'Layer standards', 'Sheet layouts'],
    rating: 4.6,
    reviewCount: 28,
    soldCount: 76,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    slug: 'structural-drawing-template',
    created: '2024-03-10',
    updated: '2024-03-10'
  },
  {
    id: '5',
    name: 'ETABS Modeling Guide E-Book',
    description: 'Comprehensive guide for structural modeling and analysis using ETABS software.',
    price: 349000,
    category: 'e-book',
    thumbnail: '',
    features: ['Step-by-step tutorials', 'Real case studies', 'Video supplements'],
    rating: 4.9,
    reviewCount: 89,
    soldCount: 312,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    slug: 'etabs-modeling-guide-ebook',
    created: '2024-04-05',
    updated: '2024-04-05'
  },
  {
    id: '6',
    name: 'Seismic Analysis Excel',
    description: 'Excel-based tool for seismic load calculation and response spectrum analysis.',
    price: 179000,
    originalPrice: 229000,
    category: 'excel-template',
    thumbnail: '',
    features: ['SNI 1726 compliance', 'Spectrum generation', 'Base shear calc'],
    rating: 4.8,
    reviewCount: 41,
    soldCount: 98,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    slug: 'seismic-analysis-excel',
    created: '2024-10-15',
    updated: '2024-10-15'
  },
  {
    id: '7',
    name: 'Rebar Detailing Revit Family',
    description: 'Detailed rebar families for concrete reinforcement modeling in Revit.',
    price: 399000,
    category: 'revit-family',
    thumbnail: '',
    features: ['Standard bar shapes', 'Custom parameters', 'BIM compliant'],
    rating: 4.7,
    reviewCount: 23,
    soldCount: 54,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    slug: 'rebar-detailing-revit-family',
    created: '2024-11-01',
    updated: '2024-11-01'
  },
  {
    id: '8',
    name: 'Concrete Mix Design Calculator',
    description: 'Excel calculator for concrete mix design with material optimization.',
    price: 129000,
    category: 'calculation-sheet',
    thumbnail: '',
    features: ['SNI 7656 compliance', 'Material optimization', 'Cost estimation'],
    rating: 4.5,
    reviewCount: 19,
    soldCount: 43,
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    slug: 'concrete-mix-design-calculator',
    created: '2024-05-20',
    updated: '2024-05-20'
  }
];

const categories: { id: ProductCategory; name: string; icon: React.ElementType }[] = [
  { id: 'revit-family', name: 'Revit Families', icon: Grid3X3 },
  { id: 'excel-template', name: 'Excel Templates', icon: Download },
  { id: 'calculation-sheet', name: 'Calculation Sheets', icon: TrendingUp },
  { id: 'drawing-template', name: 'Drawing Templates', icon: Tag },
  { id: 'e-book', name: 'E-Books', icon: ShoppingBag },
  { id: 'course-material', name: 'Course Materials', icon: Sparkles },
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
            <ShoppingBag className="w-4 h-4 text-army-400" />
            <span className="text-sm text-army-400 font-medium tracking-wide">
              DIGITAL STORE
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
            Premium Revit families, Excel templates, calculation sheets, and more 
            to accelerate your engineering workflow.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  index, 
  onBuy 
}: { 
  product: Product; 
  index: number;
  onBuy: (product: Product) => void;
}) {
  const { isAuthenticated } = useAuth();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=/store';
      return;
    }
    onBuy(product);
  };

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className="group h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                      hover:border-army-500/30 transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] bg-gradient-to-br from-army-800/20 to-army-900/20 
                        flex items-center justify-center relative overflow-hidden">
          <ShoppingBag className="w-16 h-16 text-army-700/40 group-hover:scale-110 transition-transform" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-army-700 text-white">NEW</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-amber-600 text-white">BESTSELLER</Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-red-600 text-white">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through block">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xl font-bold text-army-400">
                {formatPrice(product.price)}
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={handleBuy}
              className="bg-army-700 hover:bg-army-600"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Buy
            </Button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// Featured Products Section
function FeaturedProductsSection({ onBuy }: { onBuy: (product: Product) => void }) {
  const featured = mockProducts.filter(p => p.isFeatured).slice(0, 4);

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
                  Featured Products
                </h2>
              </SectionReveal>
            </div>
            <SectionReveal delay={0.2}>
              <Link 
                to="/store/all" 
                className="group flex items-center gap-2 text-army-400 hover:text-army-300"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onBuy={onBuy} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// All Products Section with Filter
function AllProductsSection({ onBuy }: { onBuy: (product: Product) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="section-fullscreen relative flex items-center bg-secondary/20">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-12">
              All Products
            </h2>
          </SectionReveal>

          {/* Filters */}
          <SectionReveal delay={0.1}>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-army-700' : ''}
                >
                  All
                </Button>
                {categories.map((cat) => {
                  const Icon = cat.icon;
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
                    </Button>
                  );
                })}
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
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

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' 
            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'}`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onBuy={onBuy} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  return (
    <section className="section-fullscreen relative flex items-center bg-background">
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
              const count = mockProducts.filter(p => p.category === category.id).length;
              
              return (
                <SectionReveal key={category.id} delay={0.1 * (index + 1)}>
                  <Link
                    to={`/store/category/${category.id}`}
                    className="group block p-8 bg-secondary/30 hover:bg-secondary/50 
                               border border-transparent hover:border-army-500/30 
                               transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-army-700/20 flex items-center justify-center mb-4
                                    group-hover:bg-army-700 transition-colors">
                      <Icon className="w-7 h-7 text-army-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-army-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {count} products
                    </p>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Store Page
export default function Store() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    // Show success message or redirect
  };

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <FeaturedProductsSection onBuy={handleBuy} />
        <CategoriesSection />
        <AllProductsSection onBuy={handleBuy} />
      </div>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}

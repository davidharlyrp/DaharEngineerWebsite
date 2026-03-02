import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Grid3X3,
  List,
  ShoppingCart,
  Tag,
  TrendingUp,
  Sparkles,
  Download,
  ChevronDown,
  Loader2,
  Eye
} from 'lucide-react';
import { TextReveal, SectionReveal } from '@/components/ui-custom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { CheckoutModal } from '@/components/store/CheckoutModal';
import { productsService } from '@/services/pb/products';
import type { Product } from '@/types/store';

// No mock data - fetching from PocketBase

const categoryIconMap: Record<string, React.ElementType> = {
  'revit-family': Grid3X3,
  'excel-template': Download,
  'calculation-sheet': TrendingUp,
  'drawing-template': Tag,
  'e-book': ShoppingBag,
  'course-material': Sparkles,
};

const getCategoryName = (id: string) =>
  id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

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

  const thumb = product.thumbnail ? productsService.getFileUrl(product, product.thumbnail) : null;
  const slug = productsService.createSlug(product.name);

  return (
    <SectionReveal delay={0.05 * (index + 1)}>
      <div className="group h-full bg-secondary/30 hover:bg-secondary/50 border border-transparent 
                      hover:border-army-500/30 transition-all duration-300">
        <Link to={`/store/product/${slug}`} className="block">
          {/* Image */}
          <div className="aspect-[4/3] bg-gradient-to-br from-army-800/20 to-army-900/20 
                          flex items-center justify-center relative overflow-hidden">
            {thumb ? (
              <img src={thumb} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <ShoppingBag className="w-16 h-16 text-army-700/40 group-hover:scale-110 transition-transform" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.discount_price && product.main_price > product.discount_price && (
                <Badge className="bg-red-600 text-white">
                  {Math.round((1 - product.discount_price / product.main_price) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">

            <h3 className="text-lg font-semibold mb-2 group-hover:text-army-400 transition-colors line-clamp-2">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.short_description}
            </p>

            <div className="flex items-center gap-1 mb-4">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{product.view_count}</span>
              <span className="text-sm text-muted-foreground mx-2">|</span>
              <Download className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{product.download_count}</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                {product.discount_price && product.main_price > product.discount_price && (
                  <span className="text-sm text-muted-foreground line-through block">
                    {formatPrice(product.main_price)}
                  </span>
                )}
                <span className="text-xl font-bold text-army-400">
                  {formatPrice(product.discount_price || product.main_price)}
                </span>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBuy();
                }}
                className="bg-army-700 hover:bg-army-600"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </SectionReveal>
  );
}

// All Products Section with Filter
function AllProductsSection({
  onBuy,
  products,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory
}: {
  onBuy: (product: Product) => void,
  products: Product[],
  selectedCategory: string,
  setSelectedCategory: (cat: string) => void,
  selectedSubCategory: string,
  setSelectedSubCategory: (sub: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dynamic Categories
  const dynamicCategories = Array.from(new Set(products.map(p => p.category))).map(id => ({
    id,
    name: getCategoryName(id),
    icon: categoryIconMap[id] || ShoppingBag
  }));

  // Dynamic Subcategories for selected category
  const dynamicSubCategories = selectedCategory !== 'all'
    ? Array.from(new Set(products
      .filter(p => p.category === selectedCategory && p.sub_category)
      .map(p => p.sub_category!)))
    : [];

  useEffect(() => {
    setSelectedSubCategory('all');
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'all' || product.sub_category === selectedSubCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <section className="section-fullscreen relative flex flex-col bg-background border-t border-border/10">
      <div className="w-full px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex flex-col lg:flex-row gap-4">
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

                {/* Main Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className={selectedCategory === 'all' ? 'bg-army-700' : ''}
                  >
                    All
                  </Button>
                  {dynamicCategories.map((cat) => {
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

              {/* Sub Category Filter (Animated) */}
              {dynamicSubCategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30"
                >
                  <span className="text-xs uppercase tracking-widest text-muted-foreground w-full mb-1 ml-1">Sub Categories</span>
                  <Button
                    variant={selectedSubCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubCategory('all')}
                    className={`h-7 px-3 text-xs ${selectedSubCategory === 'all' ? 'bg-army-600' : ''}`}
                  >
                    All
                  </Button>
                  {dynamicSubCategories.map((sub) => (
                    <Button
                      key={sub}
                      variant={selectedSubCategory === sub ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`h-7 px-3 text-xs ${selectedSubCategory === sub ? 'bg-army-600' : ''}`}
                    >
                      {sub.replace(/-/g, ' ')}
                    </Button>
                  ))}
                </motion.div>
              )}
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

// Main Store Page
export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | 'all'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    // Show success message or redirect
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-army-500" />
        <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Gathering Assets</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-10 bg-background">
        <div id="all-products-section">
          <AllProductsSection
            onBuy={handleBuy}
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>
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

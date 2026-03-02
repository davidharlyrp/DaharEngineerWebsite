import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ShoppingCart,
    CheckCircle2,
    Download,
    Info,
    Tag,
    Globe,
    Code2,
    Clock,
    ChevronRight,
    ShieldCheck,
    Loader2,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionReveal, TextReveal } from '@/components/ui-custom';
import { productsService } from '@/services/pb/products';
import { paymentApi } from '@/services/api/payment';
import { CheckoutModal } from '@/components/store/CheckoutModal';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '@/types/store';

export default function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const data = await productsService.getProductBySlug(slug);
                if (isMounted) {
                    setProduct(data);
                    if (data) {
                        const thumb = data.thumbnail ? productsService.getFileUrl(data, data.thumbnail) : null;
                        setActiveImage(thumb);

                        // Check purchase status if authenticated
                        if (isAuthenticated && user?.id) {
                            const purchased = await paymentApi.checkPurchaseStatus(data.id, user.id);
                            setIsPurchased(purchased);
                        }
                    }
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error in fetchProduct:', error);
                    setLoading(false);
                }
            }
        };
        fetchProduct();

        // Check for success status in URL
        if (searchParams.get('status') === 'paid') {
            setShowSuccessModal(true);
            // Clean up URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('status');
            newParams.delete('orderId');
            setSearchParams(newParams);
        }

        return () => { isMounted = false; };
    }, [slug, isAuthenticated, user?.id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleBuy = async () => {
        if (!isAuthenticated || !user) {
            window.location.href = `/login?redirect=/store/product/${slug}`;
            return;
        }

        if (isPurchased) {
            handleDownload();
            return;
        }

        try {
            if (!product) return;
            // Use the new backend API to create Xendit invoice
            const response = await paymentApi.createInvoice({
                productId: product.id,
                userId: user.id,
                userEmail: user.email,
                userName: user.name || 'Customer',
                amount: product.discount_price || product.main_price,
                productName: product.name,
                productCategory: product.category,
                fileName: product.file_name || 'Resource',
                fileSize: product.file_size || 0,
                productSlug: slug || ''
            });

            if (response.invoiceUrl) {
                window.location.href = response.invoiceUrl;
            }
        } catch (error) {
            console.error('Failed to create payment:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    const handleDownload = async () => {
        if (!product || !user) return;

        try {
            // Log download to backend
            await paymentApi.logDownload(product.id, user.id);

            // Trigger browser download
            const fileUrl = productsService.getFileUrl(product, product.file);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = product.file_name || product.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-army-500" />
                <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Retrieving Product Details</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-muted-foreground mb-8 text-lg">The resource you are looking for might have been moved or deleted.</p>
                    <Button asChild className="bg-army-700 hover:bg-army-600 px-8">
                        <Link to="/store">Back to Store</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const images = [
        product.thumbnail ? productsService.getFileUrl(product, product.thumbnail) : null,
        ...(Array.isArray(product.pictures) ? product.pictures : []).map(pic => productsService.getFileUrl(product, pic))
    ].filter(Boolean) as string[];

    // Ensure features is an array - handle potential string or array from PB
    let features: string[] = [];
    const rawFeatures = product.features as any;

    if (Array.isArray(rawFeatures)) {
        features = rawFeatures as string[];
    } else if (typeof rawFeatures === 'string' && rawFeatures.trim()) {
        try {
            const parsed = JSON.parse(rawFeatures);
            features = Array.isArray(parsed) ? parsed : [rawFeatures];
        } catch (e) {
            // If not JSON, it might be a comma-separated list or just a plain string
            features = rawFeatures.split(/[\n,]/).map((f: string) => f.trim()).filter(Boolean);
        }
    }

    return (
        <div className="pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-12 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/store" className="hover:text-army-400 transition-colors">Store</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Images */}
                    <div className="space-y-6">
                        <SectionReveal>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="aspect-[4/3] bg-secondary/30 rounded-lg overflow-hidden border border-border/50 group relative"
                            >
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Code2 className="w-20 h-20 text-muted-foreground/20" />
                                    </div>
                                )}

                                {product.discount_price && product.main_price > product.discount_price && (
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-red-600 text-white border-none px-3 py-1 text-sm font-bold">
                                            {Math.round((1 - (product.discount_price / product.main_price)) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </motion.div>
                        </SectionReveal>

                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all
                      ${activeImage === img ? 'border-army-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div>
                            <SectionReveal>
                                <Badge variant="outline" className="mb-4 uppercase tracking-widest text-army-400 border-army-400/30">
                                    {product.category.replace(/-/g, ' ')}
                                </Badge>
                            </SectionReveal>
                            <TextReveal
                                text={product.name}
                                tag="h1"
                                className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
                            />
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    <span className="text-muted-foreground">{product.view_count}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Download className="w-4 h-4" />
                                    <span className="text-muted-foreground">{product.download_count} downloads</span>
                                </div>
                            </div>
                        </div>

                        <SectionReveal delay={0.1}>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {product.short_description}
                            </p>
                        </SectionReveal>

                        <div className="p-8 bg-secondary/30 rounded-xl border border-border/50 space-y-6">
                            <div className="flex items-end gap-4">
                                <div className="space-y-1">
                                    {product.discount_price && (
                                        <span className="text-lg text-muted-foreground line-through block">
                                            {formatPrice(product.main_price)}
                                        </span>
                                    )}
                                    <span className="text-4xl font-black text-army-400 tracking-tighter italic">
                                        {formatPrice(product.discount_price || product.main_price)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe className="w-4 h-4 text-army-400" />
                                    <span className="text-muted-foreground">Language:</span>
                                    <span className="font-medium">{product.language || 'English/Indonesia'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Tag className="w-4 h-4 text-army-400" />
                                    <span className="text-muted-foreground">Version:</span>
                                    <span className="font-medium">{product.version || '1.0.0'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-army-400" />
                                    <span className="text-muted-foreground">Updates:</span>
                                    <span className="font-medium">Lifetime</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-army-400" />
                                    <span className="text-muted-foreground">Access:</span>
                                    <span className="font-medium">Instant</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleBuy}
                                className="w-full h-14 bg-army-700 hover:bg-army-600 text-lg font-bold group"
                            >
                                {isPurchased ? (
                                    <>
                                        <Download className="w-5 h-5 mr-2" />
                                        DOWNLOAD NOW
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        BUY NOW
                                    </>
                                )}
                                <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Extended Details */}
                <div className="mt-32 grid lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <SectionReveal>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-army-400" />
                                Product Description
                            </h2>
                            <div
                                className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: product.long_description }}
                            />
                        </SectionReveal>

                        {features && features.length > 0 && (
                            <SectionReveal delay={0.1}>
                                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-army-400" />
                                    Key Features
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                                    {features.map((feature: string, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 bg-secondary/20 rounded-lg group hover:bg-secondary/40 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-army-400/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-army-400" />
                                            </div>
                                            <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </SectionReveal>
                        )}
                    </div>

                    <aside className="space-y-8">
                        <div className="p-8 bg-secondary/10 border border-border/50 rounded-lg sticky top-32">
                            <h3 className="font-bold text-xl mb-6">File Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">File Format</span>
                                    <span className="font-medium text-army-400 font-mono">{product.file_format || '.zip / .rvt'}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">Original Name</span>
                                    <span className="font-medium">{product.file_name || 'Design_Kit_V1'}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">File Size</span>
                                    <span className="font-medium">{product.file_size ? `${(product.file_size / 1024 / 1024).toFixed(2)} MB` : 'Dynamic'}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2">
                                    <span className="text-muted-foreground">Author</span>
                                    <span className="font-medium italic">{product.created_by_name || 'DHAR TEAM'}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50">
                                <p className="text-xs text-muted-foreground text-center italic">
                                    *After purchase, your files will be available for instant download in your profile area.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <CheckoutModal
                product={product}
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={() => {
                    setIsCheckoutOpen(false);
                    // This modal might be legacy now that we use Xendit redirect
                }}
            />

            {/* Payment Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border/50 p-8 rounded-2xl max-w-md w-full text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Purchase Successful!</h3>
                            <p className="text-muted-foreground">
                                Thank you for your purchase. You can now download your resource directly from this page.
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-army-700 hover:bg-army-600"
                        >
                            Got it, thanks!
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

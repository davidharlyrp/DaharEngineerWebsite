import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
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
import { SectionReveal } from '@/components/ui-custom';
import { productsService } from '@/services/pb/products';
import { paymentApi } from '@/services/api/payment';
import { CheckoutModal } from '@/components/store/CheckoutModal';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
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
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState(false);
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
                            try {
                                const purchased = await paymentApi.checkPurchaseStatus(data.id, user.id);
                                setIsPurchased(purchased);
                            } catch (err) {
                                console.warn('Could not check purchase status (Backend might be down):', err);
                                // Default to not purchased if API fails
                                setIsPurchased(false);
                            }
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
            setIsDownloading(true);
            setDownloadProgress(0);

            // Log download to backend
            await paymentApi.logDownload(product.id, user.id);

            // Trigger browser download (Blob with progress for filename & UX)
            const fileUrl = productsService.getFileUrl(product, product.file);
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const contentLength = +(response.headers.get('Content-Length') ?? 0);

            if (!reader) {
                const blob = await response.blob();
                triggerDownload(blob, product.file_name || product.name);
                return;
            }

            let receivedLength = 0;
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                if (contentLength) {
                    setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
                }
            }

            const blob = new Blob(chunks, { type: response.headers.get('Content-Type') || undefined });
            triggerDownload(blob, product.file_name || product.name);

        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    const triggerDownload = (blob: Blob, filename: string) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    };

    if (loading) {
        return (
            <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-army-500" />
                <p className="tracking-widest text-xs text-muted-foreground">Retrieving Product Details</p>
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
        <div className="pt-24 pb-16 lg:pb-32">
            <SEO
                title={`${product.name} | Dahar Engineer Store`}
                description={product.short_description}
                image={activeImage || undefined}
                type="product"
                url={`https://daharengineer.com/store/product/${slug}`}
                keywords={`perhitungan, template excel, revit family, ${product.category.replace(/-/g, ' ')}, ${product.name.toLowerCase()}`}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 lg:mb-12 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <Link to="/store" className="hover:text-army-400 transition-colors">Store</Link>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    <span className="capitalize hidden sm:inline">{product.category.replace(/-/g, ' ')}</span>
                    <span className="capitalize sm:hidden">...</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-start">
                    {/* Left: Images */}
                    <div className="space-y-3 lg:space-y-6 w-full overflow-hidden">
                        <SectionReveal>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="aspect-[4/3] sm:aspect-video lg:aspect-[4/3] bg-secondary/20 rounded-lg overflow-hidden border border-border/50 group relative flex items-center justify-center p-1"
                            >
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 mx-auto"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Code2 className="w-12 lg:w-20 h-12 lg:h-20 text-muted-foreground/10" />
                                    </div>
                                )}

                                {product.discount_price && product.main_price > product.discount_price && (
                                    <div className="absolute top-2 left-2 lg:top-4 lg:left-4 z-10">
                                        <Badge className="bg-red-600 text-white border-none px-2 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-sm font-bold shadow-lg">
                                            {Math.round((1 - (product.discount_price / product.main_price)) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </motion.div>
                        </SectionReveal>

                        {images.length > 1 && (
                            <div className="flex gap-2 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-14 lg:w-24 h-14 lg:h-24 flex-shrink-0 rounded overflow-hidden border-2 transition-all p-0.5 bg-secondary/10
                      ${activeImage === img ? 'border-army-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-4 lg:space-y-8">
                        <div>
                            <SectionReveal>
                                <Badge variant="outline" className="mb-2 lg:mb-4 text-[10px] lg:text-xs tracking-tight text-army-400 border-army-400/30">
                                    {product.category.replace(/-/g, ' ')}
                                </Badge>
                            </SectionReveal>
                            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight mb-2 lg:mb-4 text-balance">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

                        <div className="p-4 lg:p-8 bg-secondary/30 rounded-xl border border-border/50 space-y-4 lg:space-y-6">
                            <div className="flex items-end gap-3 lg:gap-4">
                                <div className="space-y-0.5 lg:space-y-1">
                                    {product.discount_price && (
                                        <span className="text-sm lg:text-lg text-muted-foreground line-through block">
                                            {formatPrice(product.main_price)}
                                        </span>
                                    )}
                                    <span className="text-2xl lg:text-4xl font-bold text-army-400 tracking-tight">
                                        {formatPrice(product.discount_price || product.main_price)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 lg:gap-4 pt-4 border-t border-border/30">
                                <div className="flex items-center gap-2 text-[10px] lg:text-sm">
                                    <Globe className="w-3.5 h-3.5 text-army-400" />
                                    <span className="text-muted-foreground hidden sm:inline">Language:</span>
                                    <span className="font-medium truncate">{product.language || 'EN/ID'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] lg:text-sm">
                                    <Tag className="w-3.5 h-3.5 text-army-400" />
                                    <span className="text-muted-foreground hidden sm:inline">Version:</span>
                                    <span className="font-medium">{product.version || '1.0.0'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] lg:text-sm">
                                    <Clock className="w-3.5 h-3.5 text-army-400" />
                                    <span className="text-muted-foreground hidden sm:inline">Updates:</span>
                                    <span className="font-medium">Lifetime</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] lg:text-sm">
                                    <ShieldCheck className="w-3.5 h-3.5 text-army-400" />
                                    <span className="text-muted-foreground hidden sm:inline">Access:</span>
                                    <span className="font-medium">Instant</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleBuy}
                                disabled={isDownloading}
                                className="w-full h-11 lg:h-14 bg-army-700 hover:bg-army-600 text-sm lg:text-lg font-bold group"
                            >
                                {isDownloading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Downloading {downloadProgress}%</span>
                                    </div>
                                ) : isPurchased ? (
                                    <>
                                        <Download className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                        Download Now
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                        Buy Now
                                    </>
                                )}
                                {!isDownloading && (
                                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Extended Details */}
                <div className="mt-10 lg:mt-32 grid lg:grid-cols-3 gap-8 lg:gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <SectionReveal>
                            <h2 className="text-xl lg:text-3xl font-bold mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                                <Info className="w-5 h-5 lg:w-6 lg:h-6 text-army-400" />
                                Product Description
                            </h2>
                            <div
                                className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.long_description) }}
                            />
                        </SectionReveal>

                        {features && features.length > 0 && (
                            <SectionReveal delay={0.1}>
                                <h2 className="text-xl lg:text-3xl font-bold mb-4 lg:mb-8 flex items-center gap-2 lg:gap-3">
                                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-army-400" />
                                    Key Features
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 lg:gap-y-6">
                                    {features.map((feature: string, i: number) => (
                                        <div key={i} className="flex gap-4 p-3 lg:p-4 bg-secondary/20 rounded-lg group hover:bg-secondary/40 transition-colors">
                                            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-army-400/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-army-400" />
                                            </div>
                                            <span className="text-sm lg:text-base text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </SectionReveal>
                        )}
                    </div>

                    <aside className="space-y-6 lg:space-y-8">
                        <div className="p-4 lg:p-8 bg-secondary/10 border border-border/50 rounded-lg sticky top-32">
                            <h3 className="font-bold text-lg lg:text-xl mb-4 lg:mb-6">File Information</h3>
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
                                <div className="flex justify-between text-[11px] lg:text-sm py-2">
                                    <span className="text-muted-foreground">Author</span>
                                    <span className="font-medium italic truncate ml-2">{product.created_by_name || 'DHAR TEAM'}</span>
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
                        <div className="w-20 h-20 bg-army-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-army-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Purchase Successful!</h3>
                            <p className="text-muted-foreground">
                                Thank you for your purchase. You can now download your resource directly from this page or from your dashboard.
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

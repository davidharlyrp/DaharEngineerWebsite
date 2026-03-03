import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboard.service';
import { productsService } from '@/services/pb/products';
import { paymentApi } from '@/services/api/payment';
import type { ProductHistory } from '@/types';
import { toast } from 'sonner';

export function ProductHistoryTab() {
    const { user } = useAuth();
    const [history, setHistory] = useState<ProductHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    const fetchHistory = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await dashboardService.getPaymentHistory(user.id);
            setHistory(data);
        } catch (error) {
            console.error('Error fetching purchase history:', error);
            toast.error('Failed to load purchase history');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.id]);

    const handleDownload = async (item: ProductHistory) => {
        if (!user) return;

        try {
            setDownloadingId(item.id);
            setDownloadProgress(0);

            // 1. Fetch full product details for the file field
            const product = await productsService.getProductById(item.product_id);
            if (!product || !product.file) {
                toast.error('Product file not found');
                return;
            }

            // 2. Log download to backend
            try {
                await paymentApi.logDownload(product.id, user.id);
            } catch (err) {
                console.warn('Logging download failed, but continuing with download:', err);
            }

            // 3. Trigger browser download (Blob with progress for filename & UX)
            const fileUrl = productsService.getFileUrl(product, product.file);
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const contentLength = +(response.headers.get('Content-Length') ?? 0);

            if (!reader) {
                const blob = await response.blob();
                triggerDownload(blob, item.file_name || product.file_name || product.name);
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
            triggerDownload(blob, item.file_name || product.file_name || product.name);

            toast.success('Download complete');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Download failed. Please try again.');
        } finally {
            setDownloadingId(null);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-army-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="bg-secondary/30 border-border/30">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                    <CardTitle className="text-base font-semibold">Purchase History</CardTitle>
                    <Badge variant="outline" className="border-army-500/20 text-[10px] font-bold">
                        {history.length} Total
                    </Badge>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <div className="text-center py-10">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No purchases yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                                             transition-all duration-300 rounded-sm"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-sm">{item.product_name}</h3>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-army-600/5 text-army-500 border-army-600/40 rounded-sm text-[10px] h-5 px-1.5 font-medium"
                                                >
                                                    {item.product_category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                                <span>ID: {item.id.slice(0, 8)}</span>
                                                <span>Purchased: {item.payment_date ? new Date(item.payment_date).toLocaleDateString() : new Date(item.created).toLocaleDateString()}</span>
                                            </div>
                                            {item.file_size && (
                                                <p className="mt-2 text-[10px] text-muted-foreground">
                                                    Size: {(item.file_size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between lg:justify-end gap-6">
                                            <p className="font-bold text-army-400 text-sm">
                                                Rp {item.final_amount.toLocaleString('id-ID')}
                                            </p>
                                            <Button
                                                size="sm"
                                                disabled={downloadingId === item.id}
                                                onClick={() => handleDownload(item)}
                                                className="bg-army-700 hover:bg-army-600 h-8 rounded-sm gap-2 text-xs"
                                            >
                                                {downloadingId === item.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        {downloadProgress > 0 && (
                                                            <span className="text-[10px] font-bold">
                                                                {downloadProgress}%
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Download className="w-3.5 h-3.5" />
                                                )}
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

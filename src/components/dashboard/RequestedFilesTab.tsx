import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown, Download, Loader2, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboard.service';
import { getFileUrl } from '@/lib/pocketbase/client';
import type { RequestedFile, RequestedFileItem } from '@/types';
import { toast } from 'sonner';

export function RequestedFilesTab() {
    const { user } = useAuth();
    const [files, setFiles] = useState<RequestedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    const fetchFiles = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await dashboardService.getRequestedFiles(user.id);
            setFiles(data);
        } catch (error) {
            console.error('Error fetching requested files:', error);
            toast.error('Failed to load requested files');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user?.id]);

    const handleDownload = async (item: RequestedFileItem) => {
        try {
            setDownloadingId(item.id);
            setDownloadProgress(0);
            const url = getFileUrl('requested_file_items', item.id, item.file, { download: true });

            // Fetch with progress tracking
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const contentLength = +(response.headers.get('Content-Length') ?? 0);

            if (!reader) {
                // Fallback to simple blob if stream not supported
                const blob = await response.blob();
                triggerDownload(blob, item.original_filename);
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
            triggerDownload(blob, item.original_filename);

            toast.success(`Download complete: ${item.original_filename}`);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Download failed');
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

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    <CardTitle className="text-base font-semibold">Requested Files</CardTitle>
                    <Badge variant="outline" className="border-army-500/20 text-[10px] font-bold">
                        {files.length} Shared
                    </Badge>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <div className="text-center py-10">
                            <FileDown className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No shared files yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {files.map((record) => {
                                const items = record.expand?.['requested_file_items(requested_file_id)'] || [];

                                return (
                                    <div
                                        key={record.id}
                                        className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                                                 transition-all duration-300 rounded-sm"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-sm">{record.subject}</h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-army-600/5 text-army-500 border-army-600/40 rounded-sm text-[10px] h-5 px-1.5 font-medium"
                                                    >
                                                        {items.length} Files
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed max-w-2xl">
                                                    {record.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground opacity-70">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(record.created).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* File items list */}
                                            {items.length > 0 && (
                                                <div className="grid sm:grid-cols-2 gap-2 mt-2 pt-4 border-t border-border/10">
                                                    {items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between p-2 rounded-sm bg-secondary/20 border border-border/20 group hover:border-army-500/20 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-8 h-8 rounded-sm bg-army-500/10 flex items-center justify-center flex-shrink-0">
                                                                    <FileText className="w-4 h-4 text-army-500" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[11px] font-medium truncate pr-2">
                                                                        {item.original_filename}
                                                                    </p>
                                                                    <p className="text-[9px] text-muted-foreground">
                                                                        {formatSize(item.file_size)} • {item.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                disabled={downloadingId === item.id}
                                                                onClick={() => handleDownload(item)}
                                                                className="h-7 w-7 rounded-sm hover:bg-army-500 hover:text-white transition-all flex-shrink-0"
                                                            >
                                                                {downloadingId === item.id ? (
                                                                    <div className="relative flex items-center justify-center">
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                        {downloadProgress > 0 && (
                                                                            <span className="absolute -top-3 text-[7px] font-bold text-army-500 whitespace-nowrap">
                                                                                {downloadProgress}%
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <Download className="w-3.5 h-3.5" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsService } from '@/services/pb/news';
import type { DaharNews } from '@/types/news';
import { Newspaper, ArrowUpRight, Loader2 } from 'lucide-react';

export function NewsSlider() {
    const [news, setNews] = useState<DaharNews[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await newsService.getActiveNews();
                setNews(data);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    useEffect(() => {
        if (news.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [news]);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 p-4 bg-background/40 backdrop-blur-md border border-border/10 rounded-sm">
                <Loader2 className="w-4 h-4 animate-spin text-army-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Loading News...</span>
            </div>
        );
    }

    if (news.length === 0) return null;

    const currentItem = news[currentIndex];

    return (
        <div className="relative overflow-hidden bg-background/20 backdrop-blur-md border border-border/5 rounded-sm p-4 min-w-[360px] max-w-[420px]">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-tight text-army-500">Latest Updates</span>
                <div className="flex-1" />
                <span className="text-[8px] font-bold text-muted-foreground opacity-30">
                    {currentIndex + 1} / {news.length}
                </span>
            </div>

            <div className="h-[120px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="absolute inset-0"
                    >
                        <div className="flex gap-4">
                            {/* Thumbnail */}
                            <div className="w-40 h-full shrink-0 bg-army-900/20 rounded-sm overflow-hidden border border-border/10">
                                {newsService.getThumbnailUrl(currentItem) ? (
                                    <img
                                        src={newsService.getThumbnailUrl(currentItem)!}
                                        alt={currentItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Newspaper className="w-4 h-4 text-army-900" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-1.5 overflow-hidden">
                                <span className="text-[9px] font-bold text-muted-foreground opacity-40 flex items-center gap-1.5 uppercase tracking-tight">
                                    {new Date(currentItem.news_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <h4 className="text-xs font-bold leading-snug line-clamp-2 tracking-tight">
                                    {currentItem.title}
                                </h4>
                                <p className="text-[10px] text-muted-foreground/60 line-clamp-2 leading-relaxed">
                                    {currentItem.short_description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between">
                {currentItem.link ? (
                    <a
                        href={currentItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-army-400 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-tight"
                    >
                        SEE DETAIL <ArrowUpRight className="w-3 h-3" />
                    </a>
                ) : (
                    <span className="text-[9px] font-bold text-muted-foreground opacity-20 uppercase tracking-tight">DE Community</span>
                )}
            </div>
        </div>
    );
}

import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Clock,
    Calendar,
    ChevronLeft,
    Share2,
    Heart,
    Eye,
    Loader2,
    BookOpen,
    User
} from 'lucide-react';
import { blogService } from '@/services/pb/blog';
import { cookieUtils } from '@/lib/utils/cookie';
import type { DaharBlog } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { LaTeXRenderer } from '@/components/blog/LaTeXRenderer';
import { CommentSection } from '@/components/blog/CommentSection';
import { SectionReveal } from '@/components/ui-custom';
import { SEO } from '@/components/seo/SEO';
import { toast } from 'sonner';

export default function BlogDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<DaharBlog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<DaharBlog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const detailRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: detailRef,
        offset: ["start start", "end start"]
    });

    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const fetchBlogData = async () => {
            if (!slug) return;
            try {
                setIsLoading(true);
                const data = await blogService.getBlogBySlug(slug);
                setBlog(data);
                setIsLiked(cookieUtils.isLiked('blog', data.id));

                // Background tasks
                blogService.incrementViewCount(data.id, data.view_count || 0);
                const related = await blogService.getRelatedBlogs(data.category, data.id);
                setRelatedBlogs(related.items);
            } catch (error) {
                console.error('Failed to fetch blog:', error);
                toast.error('Article not found');
                navigate('/blog');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogData();
        window.scrollTo(0, 0);
    }, [slug, navigate]);

    const handleLike = async () => {
        if (!blog) return;

        const currentlyLiked = cookieUtils.isLiked('blog', blog.id);
        const newCount = currentlyLiked ? blog.like_count - 1 : blog.like_count + 1;

        try {
            await blogService.updateLikeCount(blog.id, Math.max(0, newCount));
            if (currentlyLiked) {
                cookieUtils.removeLike('blog', blog.id);
            } else {
                cookieUtils.addLike('blog', blog.id);
            }
            setIsLiked(!currentlyLiked);
            setBlog({ ...blog, like_count: Math.max(0, newCount) });
            toast.success(currentlyLiked ? 'Unliked article' : 'Liked article!');
        } catch (error) {
            console.error('Failed to like blog:', error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog?.title,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-army-500 animate-spin opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading Article...</p>
            </div>
        );
    }

    if (!blog) return null;

    const thumbnailUrl = blogService.getThumbnailUrl(blog);

    return (
        <div ref={detailRef} className="relative bg-background min-h-screen pb-20">
            <SEO
                title={`${blog.title} | Dahar Engineer Blog`}
                description={blog.content ? blog.content.substring(0, 160).replace(/(<([^>]+)>)/gi, "") : 'Read the latest insights and engineering tutorials from Dahar Engineer.'}
                image={thumbnailUrl || undefined}
                type="article"
                url={`https://daharengineer.com/blog/${slug}`}
                keywords={blog.tags_keyword || 'engineering blog, civil engineering articles, konstruksi, teknik sipil, dahar engineer'}
            />
            {/* Reading Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-army-500 z-50 origin-left"
                style={{ scaleX: progressWidth }}
            />

            {/* Sticky Header with Back and Engagement */}
            <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-border/5 py-2 px-6 lg:px-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/blog" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-army-400 transition-colors group">
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        BACK TO BLOG
                    </Link>
                </div>
            </div>

            {/* Article Hero */}
            <div className="relative pt-12 lg:pt-20 px-6 lg:px-20 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <SectionReveal>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-army-700/10 text-army-500 rounded-sm font-bold uppercase tracking-tight text-[9px] px-2 py-0.5 border border-army-500/20">
                                {blog.category}
                            </Badge>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium opacity-50">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.published_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.read_time}</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-3 py-6 border-y border-border/5 mb-8">
                            <div className="w-10 h-10 bg-army-700/20 rounded-full flex items-center justify-center border border-army-500/10 shrink-0">
                                <span className="text-xs font-bold text-army-400">
                                    <User className="w-4 h-4" />
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold tracking-tight">{blog.author}</p>
                                <p className="text-[10px] text-muted-foreground font-medium opacity-40 uppercase tracking-tight">{blog.author_title}</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 opacity-50" /> {blog.view_count || 0} Views</span>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isLiked ? 'text-army-500' : 'text-muted-foreground/50 hover:text-army-500'}`}
                                    >
                                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                        {blog.like_count || 0}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="text-muted-foreground/50 hover:text-army-500 transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SectionReveal>

                    {thumbnailUrl && (
                        <SectionReveal delay={0.2}>
                            <div className="aspect-[21/9] w-full relative overflow-hidden rounded-sm mb-12 border border-border/10">
                                <img
                                    src={thumbnailUrl}
                                    alt={blog.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                            </div>
                        </SectionReveal>
                    )}

                    {/* Article Content */}
                    <SectionReveal delay={0.3}>
                        <div className="prose prose-sm !max-w-none prose-invert prose-p:text-muted-foreground/80 prose-p:leading-relaxed prose-headings:tracking-tight prose-headings:font-bold prose-a:text-army-400 prose-img:rounded-sm prose-img:border prose-img:border-border/10">
                            <LaTeXRenderer content={blog.content} />
                        </div>

                        <div className="mt-12 flex flex-wrap gap-2">
                            {blog.tags_keyword.split(',').map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-secondary/20 hover:bg-secondary/30 text-[10px] font-bold opacity-60 rounded-sm uppercase tracking-wider px-2">
                                    #{tag.trim()}
                                </Badge>
                            ))}
                        </div>
                    </SectionReveal>

                    {/* Comment Section */}
                    <SectionReveal delay={0.4}>
                        <CommentSection blogId={blog.id} />
                    </SectionReveal>
                </div>
            </div>

            {/* Related Articles Section */}
            {relatedBlogs.length > 0 && (
                <div className="bg-secondary/5 py-16 mt-16 border-t border-border/5 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6">
                        <SectionReveal>
                            <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center justify-between">
                                More from {blog.category}
                                <Link to="/blog" className="text-[10px] font-bold text-army-500 uppercase tracking-tight hover:text-army-400 transition-colors">See all publications →</Link>
                            </h3>
                        </SectionReveal>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedBlogs.map((related, index) => {
                                const relThumbnail = blogService.getThumbnailUrl(related);
                                return (
                                    <SectionReveal key={related.id} delay={0.1 * index}>
                                        <Link
                                            to={`/blog/${related.page_name}`}
                                            className="group block space-y-4"
                                        >
                                            <div className="aspect-video relative overflow-hidden bg-army-900/20 rounded-sm border border-border/5">
                                                {relThumbnail ? (
                                                    <img src={relThumbnail} alt={related.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-20"><BookOpen className="w-8 h-8" /></div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold group-hover:text-army-400 transition-colors line-clamp-2 leading-tight tracking-tight">{related.title}</h4>
                                                <p className="text-[11px] text-muted-foreground opacity-50 mt-2 font-medium">
                                                    {new Date(related.published_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </Link>
                                    </SectionReveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

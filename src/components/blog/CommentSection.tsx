import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { blogService } from '@/services/pb/blog';
import { cookieUtils } from '@/lib/utils/cookie';
import type { DaharBlogComment } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Reply, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CommentSectionProps {
    blogId: string;
}

interface CommentItemProps {
    comment: DaharBlogComment;
    depth?: number;
    replyingTo: string | null;
    setReplyingTo: (id: string | null) => void;
    handleLike: (comment: DaharBlogComment) => void;
    handlePostComment: (parentId?: string) => void;
    newComment: string;
    setNewComment: (val: string) => void;
    isSubmitting: boolean;
}

const CommentItem = ({
    comment,
    depth = 0,
    replyingTo,
    setReplyingTo,
    handleLike,
    handlePostComment,
    newComment,
    setNewComment,
    isSubmitting
}: CommentItemProps) => {
    const isLiked = cookieUtils.isLiked('comment', comment.id);
    const userAvatar = comment.expand?.user_id?.avatar ?
        `${import.meta.env.VITE_POCKETBASE_URL}/api/files/_pb_users_auth_/${comment.user_id}/${comment.expand.user_id.avatar}` :
        null;

    return (
        <div className={`space-y-3 ${depth > 0 ? 'ml-6 mt-3 border-l border-border/10 pl-3' : ''}`}>
            <div className="flex gap-2">
                <Avatar className="w-7 h-7 rounded-sm">
                    {userAvatar ? (
                        <AvatarImage src={userAvatar} className="object-cover" />
                    ) : (
                        <AvatarFallback className="bg-army-700/20 text-army-400 text-[9px] font-bold rounded-sm">
                            {comment.expand?.user_id?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-tight">{comment.expand?.user_id?.name || 'Anonymous User'}</span>
                        <span className="text-[9px] text-muted-foreground opacity-50">
                            {new Date(comment.created).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center gap-4 pt-1">
                        <button
                            onClick={() => handleLike(comment)}
                            className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors ${isLiked ? 'text-army-500' : 'text-muted-foreground/40 hover:text-army-500'}`}
                        >
                            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                            {comment.like || 0}
                        </button>
                        <button
                            onClick={() => {
                                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                setNewComment('');
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 hover:text-army-500 transition-colors"
                        >
                            <Reply className="w-3 h-3" />
                            Reply
                        </button>
                    </div>

                    {replyingTo === comment.id && (
                        <div className="mt-4 space-y-2">
                            <Textarea
                                placeholder="Write a reply..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-secondary/5 border border-border/90 min-h-[60px] text-[11px] rounded-sm focus-visible:ring-army-500/30 ring-offset-background resize-none"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(null)}
                                    className="h-7 px-3 text-[10px] font-bold text-muted-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handlePostComment(comment.id)}
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="h-7 px-3 text-[10px] font-bold text-white bg-army-700 hover:bg-army-600 rounded-sm"
                                >
                                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Post Reply'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {comment.replies?.map(reply => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    handleLike={handleLike}
                    handlePostComment={handlePostComment}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    isSubmitting={isSubmitting}
                />
            ))}
        </div>
    );
};

export function CommentSection({ blogId }: CommentSectionProps) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<DaharBlogComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            const data = await blogService.getComments(blogId);
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const handlePostComment = async (parentId?: string) => {
        if (!isAuthenticated || !user) {
            toast.error('Please login to comment');
            return;
        }

        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            await blogService.addComment(blogId, user.id, newComment, parentId);
            setNewComment('');
            setReplyingTo(null);
            fetchComments();
            toast.success('Comment posted!');
        } catch (error) {
            console.error('Failed to post comment:', error);
            toast.error('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (comment: DaharBlogComment) => {
        const isLiked = cookieUtils.isLiked('comment', comment.id);
        const newCount = isLiked ? comment.like - 1 : comment.like + 1;

        try {
            await blogService.updateCommentLike(comment.id, Math.max(0, newCount));
            if (isLiked) {
                cookieUtils.removeLike('comment', comment.id);
            } else {
                cookieUtils.addLike('comment', comment.id);
            }
            // Optimization: Update local state
            updateLocalCommentLike(comment.id, Math.max(0, newCount));
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const updateLocalCommentLike = (id: string, count: number) => {
        const updateRecursive = (list: DaharBlogComment[]): DaharBlogComment[] => {
            return list.map(c => {
                if (c.id === id) return { ...c, like: count };
                if (c.replies?.length) return { ...c, replies: updateRecursive(c.replies) };
                return c;
            });
        };
        setComments(prev => updateRecursive(prev));
    };

    return (
        <div className="space-y-6 pt-10 border-t border-border/5">
            <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-army-500" />
                <h3 className="text-base font-bold tracking-tight">Discussion</h3>
                <span className="text-[9px] font-bold text-muted-foreground opacity-40 ml-1">
                    {comments.length} Comments
                </span>
            </div>

            {/* Post Comment Input */}
            {isAuthenticated ? (
                <div className="space-y-3 bg-secondary/5 p-3 rounded-sm border border-border/10">
                    <div className="flex gap-2">
                        <Avatar className="w-7 h-7 rounded-sm">
                            <AvatarFallback className="bg-army-700/20 text-army-400 text-[9px] font-bold rounded-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Share your thoughts on this article..."
                                value={replyingTo ? '' : newComment}
                                onChange={(e) => !replyingTo && setNewComment(e.target.value)}
                                className="bg-background border border-border/90 min-h-[80px] text-[11px] rounded-sm focus-visible:ring-army-500/30 ring-offset-background resize-none"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => handlePostComment()}
                                    disabled={isSubmitting || !newComment.trim() || !!replyingTo}
                                    className="bg-army-700 hover:bg-army-600 h-8 px-5 text-[10px] font-bold tracking-tight rounded-sm shadow-md"
                                >
                                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 text-center bg-secondary/5 rounded-sm border border-dashed border-border/20">
                    <p className="text-[10px] text-muted-foreground font-medium mb-3 italic opacity-60">Join the discussion by logging into your account.</p>
                    <Button asChild variant="outline" className="h-8 px-5 text-[10px] font-bold tracking-tight rounded-sm border-army-500/30 text-army-400 hover:bg-army-500/10 transition-all">
                        <a href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>Login to Participate</a>
                    </Button>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 text-army-500 animate-spin opacity-20" />
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                handleLike={handleLike}
                                handlePostComment={handlePostComment}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                isSubmitting={isSubmitting}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-[11px] text-muted-foreground/40 font-medium">No comments yet. Be the first to start the conversation!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { toast } from 'sonner';

interface SessionReviewFormProps {
    userId: string;
    bookingGroupId: string;
    sessionNumber: number;
    onSuccess: () => void;
}

export function SessionReviewForm({ userId, bookingGroupId, sessionNumber, onSuccess }: SessionReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setIsSubmitting(true);
            await dashboardService.submitSessionReview({
                user_id: userId,
                booking_group_id: bookingGroupId,
                session_number: sessionNumber,
                rating,
                comment
            });
            toast.success('Thank you for your review!');
            onSuccess();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-border/10">
            <h4 className="text-[11px] font-semibold text-army-400 mb-3 uppercase tracking-wider">
                Session {sessionNumber} Review
            </h4>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-5 h-5 ${(hoverRating || rating) >= star
                                        ? 'fill-army-400 text-army-400'
                                        : 'text-muted-foreground/30'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-2">
                        {rating > 0 ? `${rating} / 5 Stars` : 'Select rating'}
                    </span>
                </div>

                <Textarea
                    placeholder="Tell us about your session experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] text-xs bg-background/50 focus:bg-background transition-colors"
                />

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="bg-army-700 hover:bg-army-600 h-8 rounded-sm text-[11px] font-bold w-full uppercase tracking-widest"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit session Review'
                    )}
                </Button>
            </div>
        </div>
    );
}

export function SessionReviewDisplay({ rating, comment, created }: { rating: number, comment: string, created: string }) {
    return (
        <div className="mt-4 pt-4 border-t border-border/10">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-semibold text-army-400 uppercase tracking-wider">
                    Your Review
                </h4>
                <span className="text-[10px] text-muted-foreground italic">
                    {new Date(created).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            </div>

            <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${rating >= star
                                ? 'fill-army-400 text-army-400'
                                : 'text-muted-foreground/20'
                            }`}
                    />
                ))}
                <span className="text-[10px] font-bold text-army-400 ml-1">
                    {rating}/5
                </span>
            </div>

            {comment && (
                <div className="bg-secondary/20 p-3 rounded-sm">
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                        "{comment}"
                    </p>
                </div>
            )}
        </div>
    );
}

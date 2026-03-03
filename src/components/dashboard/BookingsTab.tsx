import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboard.service';
import { toast } from 'sonner';
import { SessionReviewForm, SessionReviewDisplay } from './SessionReviewForm';
import type { CourseBooking } from '@/types';
import type { SessionReview } from '@/types/courses';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BookingsTab() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<CourseBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [reviews, setReviews] = useState<SessionReview[]>([]);

    const fetchBookings = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const [bookingsData, reviewsData] = await Promise.all([
                dashboardService.getBookings(user.id),
                dashboardService.getSessionReviews(user.id)
            ]);
            setBookings(bookingsData);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user?.id]);


    const handleDelete = (bookingId: string) => {
        setBookingToDelete(bookingId);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;

        try {
            setIsDeleting(bookingToDelete);
            await dashboardService.deleteBooking(bookingToDelete);
            toast.success('Booking deleted');
            setBookings(prev => prev.filter(b => b.id !== bookingToDelete));
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        } finally {
            setIsDeleting(null);
            setBookingToDelete(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-army-600/5 text-army-500 border-army-600/50 hover:bg-army-600/20 rounded-sm text-[10px] h-5 px-1.5 font-medium">Confirmed</Badge>;
            case 'pending':
                return <Badge className="bg-army-600/5 text-army-500 border-army-600/50 hover:bg-army-600/20 rounded-sm text-[10px] h-5 px-1.5 font-medium">Pending</Badge>;
            case 'completed':
            case 'finished':
                return <Badge className="bg-army-600/5 text-army-500 border-army-600/50 hover:bg-army-600/20 rounded-sm text-[10px] h-5 px-1.5 font-medium">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-600/5 text-red-600 border-red-600/50 hover:bg-red-600/20 rounded-sm text-[10px] h-5 px-1.5 font-medium">Cancelled</Badge>;
            default:
                return <Badge className="text-[10px] h-5 px-1.5">{status}</Badge>;
        }
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge variant="outline" className="border-army-500/50 text-army-500 bg-army-500/5 rounded-sm font-medium h-5 px-1.5 text-[10px]">Paid</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-army-500/50 text-army-500 bg-army-500/5 rounded-sm font-medium h-5 px-1.5 text-[10px]">Pending</Badge>;
            case 'failed':
                return <Badge variant="outline" className="border-red-500/50 text-red-500 bg-red-500/5 rounded-sm font-medium h-5 px-1.5 text-[10px]">Failed</Badge>;
            case 'expired':
                return <Badge variant="outline" className="border-gray-500/50 text-gray-500 bg-gray-500/5 rounded-sm font-medium h-5 px-1.5 text-[10px]">Expired</Badge>;
            default:
                return <Badge variant="outline" className="h-5 px-1.5 text-[10px]">{status}</Badge>;
        }
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
                    <CardTitle className="text-base font-semibold">My Course Bookings</CardTitle>
                    <Badge variant="outline" className="border-army-500/20 text-[10px] font-bold">
                        {bookings.length} Total
                    </Badge>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No bookings yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-4 bg-background border border-border/30 hover:border-army-500/30 
                                             transition-all duration-300 rounded-sm"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold text-sm lg:text-base">{booking.course_title}</h3>
                                                {getStatusBadge(booking.booking_status)}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mb-3">
                                                Instructor: {booking.mentor_name || 'N/A'}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mb-3">
                                                Topic:
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mb-3">
                                                {booking.topic || 'N/A'}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    {booking.course_type || 'General'}
                                                </span>
                                                {booking.session_date && (
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(booking.session_date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                )}
                                                {booking.session_time && (
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {booking.session_time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/10">
                                            <div className="text-left lg:text-right">
                                                <p className="font-bold text-army-400">
                                                    Rp {booking.total_amount.toLocaleString('id-ID')}
                                                </p>
                                                {getPaymentBadge(booking.payment_status)}
                                            </div>

                                            <div className="flex items-center gap-2">

                                                {booking.payment_status !== 'paid' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(booking.id)}
                                                        disabled={isDeleting === booking.id}
                                                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                                                    >
                                                        {isDeleting === booking.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Session Review Section */}
                                    {(booking.booking_status === 'finished' || booking.booking_status === 'completed') && user?.id && (
                                        <>
                                            {reviews.find(r =>
                                                r.booking_group_id === (booking.booking_group_id || booking.id) &&
                                                r.session_number === (booking.session_number || 1)
                                            ) ? (
                                                <SessionReviewDisplay
                                                    {...reviews.find(r =>
                                                        r.booking_group_id === (booking.booking_group_id || booking.id) &&
                                                        r.session_number === (booking.session_number || 1)
                                                    )!}
                                                />
                                            ) : (
                                                <SessionReviewForm
                                                    userId={user.id}
                                                    bookingGroupId={booking.booking_group_id || booking.id}
                                                    sessionNumber={booking.session_number || 1}
                                                    onSuccess={fetchBookings}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!bookingToDelete} onOpenChange={(open) => !open && setBookingToDelete(null)}>
                <AlertDialogContent className="max-w-[320px] rounded-sm p-4 gap-4">
                    <AlertDialogHeader className="gap-1.5">
                        <AlertDialogTitle className="text-base font-semibold">Delete Booking?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            This action cannot be undone. This records will be permanently deleted from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                        <AlertDialogCancel className="h-8 text-xs px-4 rounded-sm">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-8 text-xs px-4 bg-red-600 hover:bg-red-700 text-white rounded-sm border-0"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

import { pb, getFileUrl } from '@/lib/pocketbase/client';
import type { UserProfile, CourseBooking, ProductHistory, RequestedFile, DashboardStats } from '@/types';
import type { SessionReview } from '@/types/courses';

export const dashboardService = {
    /**
     * Update user profile information
     */
    async updateProfile(userId: string, data: Partial<UserProfile>) {
        const updateData = {
            name: data.name,
            phone_number: data.phone_number,
            institution: data.institution,
            display_name: data.display_name,
            newsletter: data.newsletter,
        };

        return await pb.collection('users').update(userId, updateData);
    },

    /**
     * Upload user avatar
     */
    async uploadAvatar(userId: string, file: File) {
        const formData = new FormData();
        formData.append('avatar', file);
        return await pb.collection('users').update(userId, formData);
    },

    /**
     * Get formatted avatar URL
     */
    getAvatarUrl(userId: string, avatarFilename: string) {
        if (!avatarFilename) return '';
        return getFileUrl('users', userId, avatarFilename);
    },

    /**
     * Get user bookings
     */
    async getBookings(userId: string) {
        return await pb.collection('bookings').getFullList<CourseBooking>({
            filter: `user_id = "${userId}"`,
            sort: '-created',
        });
    },

    /**
     * Delete a booking (only if not paid)
     */
    async deleteBooking(bookingId: string) {
        return await pb.collection('bookings').delete(bookingId);
    },

    /**
     * Get user payment history (for products)
     */
    async getPaymentHistory(userId: string) {
        return await pb.collection('payment_history').getFullList<ProductHistory>({
            filter: `user_id = "${userId}" && payment_status = "paid"`,
            sort: '-created',
        });
    },

    /**
     * Get requested files for a user
     */
    async getRequestedFiles(userId: string) {
        return await pb.collection('requested_files').getFullList<RequestedFile>({
            filter: `recipient_id ~ "${userId}"`,
            sort: '-created',
            expand: 'requested_file_items(requested_file_id)',
        });
    },

    /**
     * Get user session reviews
     */
    async getSessionReviews(userId: string) {
        return await pb.collection('session_reviews').getFullList<SessionReview>({
            filter: `user_id = "${userId}"`,
            sort: '-created',
        });
    },

    /**
     * Submit a session review
     */
    async submitSessionReview(data: Partial<SessionReview>) {
        return await pb.collection('session_reviews').create(data);
    },

    /**
     * Get real-time dashboard stats
     */
    async getDashboardStats(userId: string): Promise<DashboardStats> {
        try {
            const [bookings, history, requestedFiles] = await Promise.all([
                this.getBookings(userId),
                this.getPaymentHistory(userId),
                this.getRequestedFiles(userId)
            ]);

            // Note: requestedFiles is already filtered by the service now
            const userRequestedFiles = requestedFiles;

            const totalSpentBookings = bookings.reduce((sum, b) => b.payment_status === 'paid' ? sum + b.total_amount : sum, 0);
            const totalSpentProducts = history.reduce((sum, h) => sum + h.final_amount, 0);

            return {
                totalBookings: bookings.length,
                activeBookings: bookings.filter(b => ['confirmed', 'ongoing'].includes(b.booking_status)).length,
                completedBookings: bookings.filter(b => ['completed', 'finished'].includes(b.booking_status)).length,
                totalPurchases: history.length,
                pendingFiles: 0, // Logic for pending files can be added later
                availableFiles: userRequestedFiles.length,
                totalSpent: totalSpentBookings + totalSpentProducts
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalBookings: 0,
                activeBookings: 0,
                completedBookings: 0,
                totalPurchases: 0,
                pendingFiles: 0,
                availableFiles: 0,
                totalSpent: 0
            };
        }
    }
};

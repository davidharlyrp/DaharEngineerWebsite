import { pb } from '@/lib/pocketbase/client';
import type { Course, Mentor, Booking, SessionReview, ClientReview, OnlineCourse } from '@/types/courses';

export const courseService = {
    async getOnlineCourses(): Promise<OnlineCourse[]> {
        try {
            const records = await pb.collection('online_courses').getFullList<OnlineCourse>({
                filter: 'isActive = true',
                sort: 'created',
                expand: 'instructor',
            });
            return records;
        } catch (error) {
            console.error('Error fetching online courses:', error);
            return [];
        }
    },

    getOnlineCourseFileUrl(record: OnlineCourse, fileName: string): string {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
    },
    async getActiveCourses(): Promise<Course[]> {
        try {
            const records = await pb.collection('course_list').getFullList<Course>({
                filter: 'isActive = true',
                sort: 'created',
            });
            return records;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    },

    async getActiveMentors(): Promise<Mentor[]> {
        try {
            const records = await pb.collection('mentor').getFullList<Mentor>({
                filter: 'isActive = true',
                sort: 'name',
            });
            return records;
        } catch (error) {
            console.error('Error fetching mentors:', error);
            return [];
        }
    },

    async getMentorsByCourse(courseId: string): Promise<Mentor[]> {
        try {
            const records = await pb.collection('mentor').getFullList<Mentor>({
                filter: `isActive = true && tags ~ "${courseId}"`,
                sort: 'name',
            });
            return records;
        } catch (error) {
            console.error('Error fetching mentors for course:', error);
            return [];
        }
    },

    getFileUrl(record: { collectionId: string; id: string }, fileName: string): string {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
    },

    async getSessionReviews(): Promise<ClientReview[]> {
        try {
            const reviews = await pb.collection('session_reviews').getFullList<SessionReview>({
                sort: '-created',
            });

            if (reviews.length === 0) return [];

            // Fetch associated bookings to get client and course info
            // Note: booking_group_id is used to link
            const groupIds = [...new Set(reviews.map(r => r.booking_group_id))];

            const filter = groupIds.map(id => `booking_group_id = "${id}"`).join(' || ');
            const bookings = await pb.collection('bookings').getFullList<Booking>({
                filter: filter
            });

            return reviews.map(review => {
                const booking = bookings.find(b => b.booking_group_id === review.booking_group_id);
                return {
                    ...review,
                    clientName: booking?.full_name || 'Anonymous Client',
                    courseTitle: booking?.course_title || 'Private Session',
                    mentorId: booking?.mentor_id || '',
                    sessionDate: booking?.session_date || review.created
                };
            }).sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
        } catch (error) {
            console.error('Error fetching session reviews:', error);
            return [];
        }
    }
};

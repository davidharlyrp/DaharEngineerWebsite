import PocketBase from 'pocketbase';
import type { Course, Mentor, Booking } from '@/types/courses';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export const courseService = {
    async getActiveCourses(): Promise<Course[]> {
        try {
            const records = await pb.collection('course_list').getFullList<Course>({
                filter: 'isActive = true',
                sort: '-created',
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

    async createBooking(data: any): Promise<any> {
        try {
            const record = await pb.collection('bookings').create(data);
            return record;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    async getBookingById(bookingId: string): Promise<Booking> {
        return await pb.collection('bookings').getOne<Booking>(bookingId);
    }
};

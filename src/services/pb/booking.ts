import PocketBase from 'pocketbase';
import axios from 'axios';
import type { Booking } from '@/types/courses';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
const API_URL = 'https://api.daharengineer.com/api';

export const bookingService = {
    async getBookingById(bookingId: string): Promise<Booking> {
        return await pb.collection('bookings').getOne<Booking>(bookingId);
    },

    async createBookingInvoice(bookingData: any): Promise<{ invoiceUrl: string }> {
        try {
            const response = await axios.post(`${API_URL}/booking/create`, bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking invoice:', error);
            throw error;
        }
    },

    async createCoinBooking(bookingData: any): Promise<{ success: boolean; bookingId: string }> {
        try {
            const response = await axios.post(`${API_URL}/booking/coin-payment`, bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating coin booking:', error);
            throw error;
        }
    }
};

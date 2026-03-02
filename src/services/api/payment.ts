import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://api.daharengineer.com';

export const paymentApi = {
    async createInvoice(data: {
        productId: string;
        userId: string;
        userEmail: string;
        userName: string;
        amount: number;
        productName: string;
        productCategory: string;
        fileName: string;
        fileSize: number;
        productSlug: string;
    }) {
        const response = await axios.post(`${API_URL}/api/payment/create`, data);
        return response.data;
    },

    async checkPurchaseStatus(productId: string, userId: string): Promise<boolean> {
        try {
            const response = await axios.get(`${API_URL}/api/payment/check/${productId}/${userId}`);
            return response.data.purchased;
        } catch (error) {
            console.error('Error checking purchase status:', error);
            return false;
        }
    },

    async logDownload(productId: string, userId: string) {
        const response = await axios.post(`${API_URL}/api/payment/download`, { productId, userId });
        return response.data;
    }
};

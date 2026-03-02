import axios from 'axios';

const API_URL = 'https://api.daharengineer.com/api';

export const coinService = {
    async createCoinPurchaseInvoice(purchaseData: {
        userId?: string;
        userEmail?: string;
        userName?: string;
        packageType: string;
        coinQuantity: number;
        amount: number;
    }): Promise<{ invoiceUrl: string }> {
        try {
            const response = await axios.post(`${API_URL}/coins/create`, purchaseData);
            return response.data;
        } catch (error) {
            console.error('Error creating coin purchase invoice:', error);
            throw error;
        }
    }
};

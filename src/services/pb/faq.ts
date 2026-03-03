import { pb } from '@/lib/pocketbase/client';
import type { FAQ, FAQListResponse } from '@/types/faq';

export const faqService = {
    async getFAQs(page: number = 1, perPage: number = 15): Promise<FAQListResponse> {
        try {
            const result = await pb.collection('dahar_faq').getList(page, perPage, {
                sort: '-created',
            });

            return {
                page: result.page,
                perPage: result.perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                items: result.items as unknown as FAQ[],
            };
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            throw error;
        }
    }
};

import { pb } from '@/lib/pocketbase/client';

export const portfolioService = {
    async getTotalProjects(): Promise<number> {
        try {
            const result = await pb.collection('portfolio').getList(1, 1, {
                fields: 'id',
            });
            return result.totalItems;
        } catch (error) {
            console.error('Error fetching total projects:', error);
            return 0;
        }
    }
};

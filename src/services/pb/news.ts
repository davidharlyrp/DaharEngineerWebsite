import { pb } from '@/lib/pocketbase/client';
import type { DaharNews } from '@/types/news';

export const newsService = {
    async getActiveNews() {
        return pb.collection('dahar_news').getFullList<DaharNews>({
            filter: 'is_active = true',
            sort: '-news_date',
        });
    },

    getThumbnailUrl(record: DaharNews) {
        if (!record.thumbnail) return null;
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/dahar_news/${record.id}/${record.thumbnail}`;
    }
};

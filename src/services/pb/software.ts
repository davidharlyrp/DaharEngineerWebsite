import { pb } from '@/lib/pocketbase/client';
import type { Software } from '@/types/software';

export const softwareService = {
    async getSoftwares(): Promise<Software[]> {
        try {
            const records = await pb.collection('softwares').getFullList<Software>({
                sort: '-created',
            });
            return records;
        } catch (error) {
            console.error('Error fetching softwares:', error);
            return [];
        }
    },

    getFileUrl(record: Software, fileName: string): string {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
    }
};

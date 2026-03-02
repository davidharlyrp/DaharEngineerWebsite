import { pb, getFileUrl } from '@/lib/pocketbase/client';
import type { Resource } from '@/types/resources';

export const resourceService = {
    /**
     * Fetch all active resources
     */
    async getResources() {
        return await pb.collection('resources').getFullList<Resource>({
            sort: '-created',
            filter: 'is_active = true',
        });
    },

    /**
     * Get a single resource by ID
     */
    async getResourceById(id: string) {
        return await pb.collection('resources').getOne<Resource>(id);
    },

    /**
     * Increment download count
     */
    async incrementDownload(id: string, currentCount: number) {
        return await pb.collection('resources').update(id, {
            download_count: currentCount + 1,
        });
    },

    /**
     * Helper to get file URL (Forced download)
     */
    getDownloadUrl(resource: Resource) {
        if (!resource.file) return '#';
        const url = getFileUrl('resources', resource.id, resource.file);
        return `${url}?download=1`;
    }
};

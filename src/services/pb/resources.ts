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
     * Fetch user's uploaded resources (paginated)
     */
    async getUserResources(userId: string, page: number = 1, perPage: number = 15) {
        return await pb.collection('resources').getList<Resource>(page, perPage, {
            filter: `uploaded_by = "${userId}"`,
            sort: '-created',
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
    },

    /**
     * Upload a new resource
     */
    async uploadResource(formData: FormData) {
        return await pb.collection('resources').create<Resource>(formData);
    },

    /**
     * Update an existing resource
     */
    async updateResource(id: string, formData: FormData) {
        return await pb.collection('resources').update<Resource>(id, formData);
    },

    /**
     * Delete a resource
     */
    async deleteResource(id: string) {
        return await pb.collection('resources').delete(id);
    }
};

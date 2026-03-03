import { pb, getFileUrl } from '@/lib/pocketbase/client';
import type { RevitFile } from '@/types/revit';

export const revitService = {
    /**
     * Fetch all revit files
     */
    async getRevitFiles() {
        return await pb.collection('revit_files').getFullList<RevitFile>({
            sort: '-created',
        });
    },

    /**
     * Fetch user's uploaded revit files (paginated)
     */
    async getUserRevitFiles(userId: string, page: number = 1, perPage: number = 15) {
        return await pb.collection('revit_files').getList<RevitFile>(page, perPage, {
            filter: `uploaded_by = "${userId}"`,
            sort: '-created',
        });
    },

    /**
     * Get a single revit file by ID
     */
    async getRevitFileById(id: string) {
        return await pb.collection('revit_files').getOne<RevitFile>(id);
    },

    /**
     * Increment download count
     */
    async incrementDownload(id: string, currentCount: number) {
        return await pb.collection('revit_files').update(id, {
            download_count: currentCount + 1,
        });
    },

    /**
     * Helper to get file URL (Forced download)
     */
    getDownloadUrl(file: RevitFile) {
        if (!file.file) return '#';
        const url = getFileUrl('revit_files', file.id, file.file);
        return `${url}?download=1`;
    },

    /**
     * Helper to get preview image URL
     */
    getPreviewUrl(file: RevitFile) {
        if (!file.preview_image) return '';
        return getFileUrl('revit_files', file.id, file.preview_image);
    },

    /**
     * Upload a new revit file
     */
    async uploadRevitFile(formData: FormData) {
        return await pb.collection('revit_files').create<RevitFile>(formData);
    },

    /**
     * Update an existing revit file
     */
    async updateRevitFile(id: string, formData: FormData) {
        return await pb.collection('revit_files').update<RevitFile>(id, formData);
    },

    /**
     * Delete a revit file
     */
    async deleteRevitFile(id: string) {
        return await pb.collection('revit_files').delete(id);
    }
};

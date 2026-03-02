import PocketBase from 'pocketbase';
import type { Product } from '@/types/store';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export const productsService = {
    async getProducts(): Promise<Product[]> {
        try {
            const records = await pb.collection('products').getFullList<Product>({
                filter: 'is_active = true',
                sort: '-created',
            });
            return records;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            // Since we don't have a slug field yet, we'll search by name
            // In a real scenario, we might want to add a slug field to the collection
            // or find a record where name converts to this slug.
            // For now, let's try to find a product whose name (slugified) matches.
            const records = await pb.collection('products').getFullList<Product>({
                filter: 'is_active = true',
                requestKey: null, // Disable auto-cancellation to prevent "request was aborted" errors
            });

            const product = records.find(p => this.createSlug(p.name) === slug);
            return product || null;
        } catch (error) {
            console.error('Error fetching product by slug:', error);
            return null;
        }
    },

    createSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    },

    getFileUrl(record: Product, fileName: string): string {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
    }
};

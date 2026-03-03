import { pb } from '@/lib/pocketbase/client';
import type { DaharTeam } from '@/types/teams';

export const teamsService = {
    async getActiveTeams(): Promise<DaharTeam[]> {
        try {
            const records = await pb.collection('dahar_teams').getFullList<DaharTeam>({
                filter: 'isActive = true',
                sort: 'order',
            });
            return records;
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    },

    getFileUrl(record: DaharTeam, fileName: string): string {
        return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
    }
};

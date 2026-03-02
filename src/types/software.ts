export type SoftwareCategory = 'Geotechnical' | 'Structural' | 'Project Management' | 'Productivity';

export interface Software {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  name: string;
  isMaintain: boolean;
  logo: string;
  thumbnail: string;
  preview: string[];
  page: string;
  description: string;
  version: string;
  add_by: string;
  category: SoftwareCategory;
  link: string;
}

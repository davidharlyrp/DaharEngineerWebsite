// Revit File types
export interface RevitFile {
  id: string;
  name: string;
  description: string;
  category: RevitCategory;
  subcategory?: string;
  version: string;
  fileSize: string;
  fileFormat: string;
  thumbnail?: string;
  previewImages?: string[];
  downloadUrl: string;
  downloadCount: number;
  author: string;
  tags: string[];
  isPremium: boolean;
  price?: number;
  requiresLogin: boolean;
  created: string;
  updated: string;
}

export type RevitCategory =
  | 'structural'
  | 'architectural'
  | 'mep'
  | 'detail-components'
  | 'annotation'
  | 'template';

export interface RevitCategoryInfo {
  id: RevitCategory;
  name: string;
  description: string;
  icon: string;
  fileCount: number;
}

export interface RevitFilter {
  category?: RevitCategory;
  search?: string;
  sortBy: 'newest' | 'popular' | 'name' | 'size';
  version?: string;
  isPremium?: boolean;
}

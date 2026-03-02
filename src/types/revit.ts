export interface RevitFile {
  id: string;
  uploaded_by?: string;
  uploaded_by_name?: string;
  file_name?: string;
  display_name: string;
  category: string;
  revit_version: string;
  preview_image?: string;
  file: string;
  file_size: number;
  download_count: number;
  created: string;
  updated: string;
}

export const RevitCategory = [
  { id: 'architectural', name: 'Architectural' },
  { id: 'structural_framing', name: 'Structural Framing' },
  { id: 'structural_columns', name: 'Structural Columns' },
  { id: 'structural_foundations', name: 'Structural Foundations' },
  { id: 'doors', name: 'Doors' },
  { id: 'windows', name: 'Windows' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'lighting_fixtures', name: 'Lighting Fixtures' },
  { id: 'electrical_fixtures', name: 'Electrical Fixtures' },
  { id: 'mechanical_equipment', name: 'Mechanical Equipment' },
  { id: 'plumbing_fixtures', name: 'Plumbing Fixtures' },
  { id: 'site_elements', name: 'Site Elements' },
  { id: 'landscape', name: 'Landscape' },
  { id: 'generic_models', name: 'Generic Models' },
  { id: 'specialty_equipment', name: 'Specialty Equipment' },
  { id: 'curtain_panels', name: 'Curtain Panels' },
  { id: 'railings', name: 'Railings' },
  { id: 'stairs', name: 'Stairs' },
  { id: 'roofs', name: 'Roofs' },
  { id: 'walls', name: 'Walls' },
  { id: 'floors', name: 'Floors' },
  { id: 'ceilings', name: 'Ceilings' },
  { id: 'templates', name: 'Templates' },
]

export type RevitCategoryID = typeof RevitCategory[number]['id'];

export interface RevitCategoryInfo {
  id: RevitCategoryID;
  name: string;
  description: string;
  icon: string;
  fileCount: number;
}

export interface RevitFilter {
  category?: RevitCategoryID | 'all';
  search?: string;
  sortBy: 'newest' | 'popular' | 'name' | 'size';
  version?: string;
  isPremium?: boolean;
}

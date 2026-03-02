// Resource types
export interface Resource {
  id: string;
  title: string;
  description: string;
  author: string;
  year_released: number;
  file_name: string;
  file: string;
  file_size: number;
  file_type: string;
  category: string;
  subcategory: string;
  uploaded_by: string;
  uploaded_by_name: string;
  is_active: boolean;
  download_count: number;
  created: string;
  updated: string;
}

export type ResourceCategory = 'ebooks' | 'modul' | 'regulations' | 'guides' | 'references';

export interface ResourceCategoryInfo {
  id: ResourceCategory;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  category: BlogCategory;
  tags: string[];
  featuredImage?: string;
  images?: string[];
  readTime: number;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedDate: string;
  created: string;
  updated: string;
}

export type BlogCategory =
  | 'tutorial'
  | 'news'
  | 'tips-tricks'
  | 'case-study'
  | 'industry-insights'
  | 'software';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  created: string;
}

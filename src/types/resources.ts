// Resource types
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileUrl: string;
  fileSize: string;
  fileFormat: string;
  thumbnail?: string;
  author: string;
  tags: string[];
  downloadCount: number;
  viewCount: number;
  isPremium: boolean;
  price?: number;
  requiresLogin: boolean;
  created: string;
  updated: string;
}

export type ResourceCategory = 'e-book' | 'module' | 'regulation' | 'guide' | 'reference';

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

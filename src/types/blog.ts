export interface DaharBlog {
    id: string;
    page_name: string;
    title: string;
    excerpt: string;
    author: string;
    author_title: string;
    content: string;
    published_date: string;
    read_time: string;
    category: string;
    tags_keyword: string;
    is_active: boolean;
    images: string[];
    view_count: number;
    like_count: number;
    created: string;
    updated: string;
}

export interface DaharBlogComment {
    id: string;
    user_id: string;
    expand?: {
        user_id: {
            name: string;
            avatar: string;
        };
    };
    content: string;
    blog_id: string;
    like: number;
    parent: string;
    created: string;
    updated: string;
    replies?: DaharBlogComment[];
}

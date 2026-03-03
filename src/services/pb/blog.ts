import { pb, getFileUrl } from '@/lib/pocketbase/client';
import type { DaharBlog, DaharBlogComment } from '@/types/blog';

export const blogService = {
    /**
     * Fetch all active blog posts
     */
    async getBlogs() {
        return await pb.collection('dahar_blog').getFullList<DaharBlog>({
            filter: 'is_active = true',
            sort: '-published_date',
        });
    },

    /**
     * Get a single blog by slug (page_name)
     */
    async getBlogBySlug(slug: string) {
        return await pb.collection('dahar_blog').getFirstListItem<DaharBlog>(`page_name = "${slug}" && is_active = true`);
    },

    /**
     * Get related blogs by category
     */
    async getRelatedBlogs(category: string, excludeId: string) {
        return await pb.collection('dahar_blog').getList<DaharBlog>(1, 3, {
            filter: `category = "${category}" && id != "${excludeId}" && is_active = true`,
            sort: '-published_date',
        });
    },

    /**
     * Increment view count
     */
    async incrementViewCount(id: string, currentCount: number) {
        return await pb.collection('dahar_blog').update(id, {
            view_count: currentCount + 1,
        });
    },

    /**
     * Update like count
     */
    async updateLikeCount(id: string, newCount: number) {
        return await pb.collection('dahar_blog').update(id, {
            like_count: newCount,
        });
    },

    /**
     * Get comments for a blog
     */
    async getComments(blogId: string) {
        const comments = await pb.collection('dahar_blog_comment').getFullList<DaharBlogComment>({
            filter: `blog_id = "${blogId}"`,
            sort: 'created',
            expand: 'user_id',
        });

        // Build threaded structure
        const commentMap = new Map<string, DaharBlogComment>();
        const rootComments: DaharBlogComment[] = [];

        comments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment.id, comment);
        });

        comments.forEach(comment => {
            if (comment.parent && commentMap.has(comment.parent)) {
                commentMap.get(comment.parent)?.replies?.push(comment);
            } else {
                rootComments.push(comment);
            }
        });

        return rootComments;
    },

    /**
     * Add a comment
     */
    async addComment(blogId: string, userId: string, content: string, parentId?: string) {
        return await pb.collection('dahar_blog_comment').create({
            blog_id: blogId,
            user_id: userId,
            content: content,
            parent: parentId || '',
            like: 0,
        });
    },

    /**
     * Update comment like count
     */
    async updateCommentLike(id: string, newCount: number) {
        return await pb.collection('dahar_blog_comment').update(id, {
            like: newCount,
        });
    },

    /**
     * Helper to get image URL
     */
    getThumbnailUrl(blog: DaharBlog) {
        if (!blog.images || blog.images.length === 0) return null;
        return getFileUrl('dahar_blog', blog.id, blog.images[0]);
    }
};

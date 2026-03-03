import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// PocketBase configuration
const POCKETBASE_URL = 'https://pb.daharengineer.com';

function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')        // Trim - from start of text
        .replace(/-+$/, '');       // Trim - from end of text
}

async function generateSitemap() {
    const baseUrl = 'https://daharengineer.com';

    // Static routes from AppRouter.tsx
    const staticPages = [
        '',
        '/about',
        '/contact',
        '/faq',
        '/services',
        '/building-design',
        '/software',
        '/courses/private-courses',
        '/store',
        '/community/revit-files',
        '/community/resources',
        '/blog',
        '/terms',
        '/privacy',
        '/refund',
        '/community-policy'
    ];

    try {
        console.log('Fetching dynamic routes for sitemap...');

        // 1. Fetch Blog Posts (using page_name as slug)
        const blogResponse = await fetch(`${POCKETBASE_URL}/api/collections/dahar_blog/records?filter=(is_active=true)&perPage=200`);
        const blogData = await blogResponse.json();
        const blogUrls = (blogData.items || []).map(post => `/blog/${post.page_name}`);

        // 2. Fetch Products from Store (using slugified name)
        const productResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?filter=(is_active=true)&perPage=200`);
        const productData = await productResponse.json();
        const productUrls = (productData.items || []).map(product => `/store/product/${slugify(product.name)}`);

        // Combine all URLs 
        const allUrls = Array.from(new Set([...staticPages, ...blogUrls, ...productUrls]));

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
                .map(url => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '' ? 'weekly' : url.startsWith('/blog/') ? 'monthly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/blog/') ? '0.8' : url.startsWith('/store/product/') ? '0.7' : '0.6'}</priority>
  </url>`)
                .join('')}
</urlset>`;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const publicPath = path.resolve(__dirname, '../public/sitemap.xml');

        fs.writeFileSync(publicPath, sitemap);
        console.log(`Sitemap generated successfully with ${allUrls.length} links at ${publicPath}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();

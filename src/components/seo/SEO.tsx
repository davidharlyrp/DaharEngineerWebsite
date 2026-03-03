import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
    keywords?: string;
}

export function SEO({
    title = 'Dahar Engineer | Civil Engineering Consultant',
    description = 'Complete construction solutions from planning, building design, courses, to software and resources for developing your engineering career.',
    name = 'Dahar Engineer',
    type = 'website',
    image = 'https://daharengineer.com/Metaimage.png',
    url = 'https://daharengineer.com',
    keywords = 'civil engineering, structural analysis, teknik sipil, konstruksi, kursus teknik sipil, revit tutorials, software teknik sipil'
}: SEOProps) {
    useEffect(() => {
        // Standard metadata
        document.title = title;

        const changeMetaTag = (selector: string, content: string, attr: string = 'name') => {
            let element = document.querySelector(`meta[${attr}="${selector}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, selector);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Name related Meta tags
        changeMetaTag('description', description);
        changeMetaTag('application-name', name);
        if (keywords) {
            changeMetaTag('keywords', keywords);
        }

        // Open Graph Meta tags
        changeMetaTag('og:title', title, 'property');
        changeMetaTag('og:description', description, 'property');
        changeMetaTag('og:type', type, 'property');
        changeMetaTag('og:image', image, 'property');
        changeMetaTag('og:url', url, 'property');
        changeMetaTag('og:site_name', name, 'property');

        // Twitter Meta tags
        changeMetaTag('twitter:card', 'summary_large_image');
        changeMetaTag('twitter:creator', '@daharengineer');
        changeMetaTag('twitter:title', title);
        changeMetaTag('twitter:description', description);
        changeMetaTag('twitter:image', image);

    }, [title, description, name, type, image, url, keywords]);

    return null; // This component handles side-effects only
}

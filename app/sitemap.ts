import type { MetadataRoute } from 'next';
import { caseStudiesLive, projects } from '@/content/projects';
import { profile } from '@/content/profile';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: profile.siteUrl, changeFrequency: 'monthly', priority: 1 },
        ...(caseStudiesLive ? projects : []).map(({ slug }) => ({
            url: `${profile.siteUrl}/work/${slug}`,
            changeFrequency: 'yearly' as const,
            priority: 0.7,
        })),
    ];
}

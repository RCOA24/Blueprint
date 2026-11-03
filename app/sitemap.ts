import type { MetadataRoute } from 'next';
import { paths } from '@/lib/site';
import { siteUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map(path => ({ url: `${siteUrl}/${path ? `${path}/` : ''}`, changeFrequency: 'monthly', priority: path === '' ? 1 : 0.7 }));
}

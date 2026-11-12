import type { Metadata } from 'next';
import { getPage } from './pages';

const configured = process.env.NEXT_PUBLIC_SITE_URL || 'https://blueprint.ky';
export const siteUrl = configured.replace(/\/$/, '');

export function metadataFor(path: string): Metadata {
  const page = getPage(path);
  const title = `${page?.title ?? 'Page not found'} | Blueprint Group`;
  const description = page?.description ?? 'Blueprint Group of Companies in the Cayman Islands.';
  const url = `${siteUrl}/${path ? `${path.replace(/^\/+|\/+$/g, '')}/` : ''}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'Blueprint Group',
      images: [
        {
          url: `${siteUrl}/assets/blueprint-hero-poster.jpg`,
          width: 1200,
          height: 630,
          alt: 'Blueprint Group architectural design',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/assets/blueprint-hero-poster.jpg`],
    },
  };
}

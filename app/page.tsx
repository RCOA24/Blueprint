import type { Metadata } from 'next';
import SitePage from '@/components/SitePage';
import { metadataFor } from '@/lib/metadata';

export const metadata: Metadata = metadataFor('');
export default function HomePage() { return <SitePage path="" />; }

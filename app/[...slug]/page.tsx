import type { Metadata } from 'next';
import SitePage from '@/components/SitePage';
import { metadataFor } from '@/lib/metadata';
import { paths } from '@/lib/site';

type Props = { params: Promise<{ slug: string[] }> };
export function generateStaticParams() { return paths.filter(Boolean).map(path => ({ slug: path.split('/') })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return metadataFor((await params).slug.join('/')); }
export default async function ContentPage({ params }: Props) { return <SitePage path={(await params).slug.join('/')} />; }

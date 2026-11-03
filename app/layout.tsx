import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteUrl } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Blueprint Group',
  robots: { index: true, follow: true },
  icons: { icon: '/assets/blueprint-logo-smooth.png' }
};

export const viewport: Viewport = { themeColor: '#f8f8f4' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

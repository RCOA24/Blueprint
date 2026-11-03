import { getFooter, getHeader } from '@/lib/site';
import SiteInteractions from '@/components/SiteInteractions';
import Link from 'next/link';

export default function NotFound() {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header" dangerouslySetInnerHTML={{ __html: getHeader('') }} />
    <main id="main"><section className="page-hero"><div className="wrap"><p className="eyebrow">Page not found</p><h1>Let’s get you<br />back on track.</h1><p>Explore our services or contact the team about your project.</p></div></section><div className="wrap section"><Link className="btn" href="/">Back to home<span className="arrow" aria-hidden="true">↗</span></Link></div></main>
    <footer className="footer" dangerouslySetInnerHTML={{ __html: getFooter() }} />
    <SiteInteractions />
  </>;
}

import { getFooter, getHeader, getPage } from '@/lib/site';
import { notFound } from 'next/navigation';
import SiteInteractions from './SiteInteractions';
import AppointmentForm from './AppointmentForm';
import { siteUrl } from '@/lib/metadata';
import { contactAddress } from '@/lib/contact';

export default function SitePage({ path }: { path: string }) {
  const page = getPage(path);
  if (!page) notFound();
  const localBusiness = {
    '@context': 'https://schema.org', '@type': 'GeneralContractor',
    name: 'Blueprint Group of Companies', url: `${siteUrl}/`,
    image: `${siteUrl}/assets/blueprint-logo-smooth.png`,
    email: 'info@blueprint.ky', telephone: '+1-345-926-4546',
    address: { '@type': 'PostalAddress', streetAddress: `${contactAddress.unit}, ${contactAddress.building}, ${contactAddress.street}, ${contactAddress.square}`, addressLocality: contactAddress.city, postalCode: contactAddress.postalCode, addressCountry: 'KY' }
  };
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header" id="header" dangerouslySetInnerHTML={{ __html: getHeader(path) }} />
    <main id="main"><div dangerouslySetInnerHTML={{ __html: page.html }} />{path === 'contact' && <AppointmentForm />}</main>
    <footer className="footer" id="footer" dangerouslySetInnerHTML={{ __html: getFooter() }} />
    <SiteInteractions />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }} />
  </>;
}

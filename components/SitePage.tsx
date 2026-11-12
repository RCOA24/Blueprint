import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import { getPage, type StaticPagePath } from '@/lib/pages';
import { siteUrl } from '@/lib/metadata';
import { contactAddress } from '@/lib/contact';
import { recipient } from '@/lib/email';
import Header from './Header';
import Footer from './Footer';
import SiteInteractions from './SiteInteractions';
import AppointmentForm from './AppointmentForm';
import HomeContent from './pages/HomeContent';
import AboutContent from './pages/AboutContent';
import ServicesContent from './pages/ServicesContent';
import ServiceContent from './pages/ServiceContent';
import ProjectsContent from './pages/ProjectsContent';
import ProjectContent from './pages/ProjectContent';
import ProductsContent from './pages/ProductsContent';
import CareersContent from './pages/CareersContent';
import ContactContent from './pages/ContactContent';

const contentPages = {
  '': HomeContent,
  about: AboutContent,
  services: ServicesContent,
  projects: ProjectsContent,
  products: ProductsContent,
  careers: CareersContent,
  contact: ContactContent,
} satisfies Record<StaticPagePath, ComponentType>;

export default function SitePage({ path }: { path: string }) {
  const page = getPage(path);
  if (!page) notFound();
  const Content = page.kind === 'static' ? contentPages[page.path] : null;
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'Blueprint Group of Companies',
    url: `${siteUrl}/`,
    image: `${siteUrl}/assets/blueprint-logo-smooth.png`,
    email: recipient,
    telephone: '+1-345-926-4546',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${contactAddress.unit}, ${contactAddress.building}, ${contactAddress.street}, ${contactAddress.square}`,
      addressLocality: contactAddress.city,
      postalCode: contactAddress.postalCode,
      addressCountry: 'KY',
    },
  };
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main">
        <div>
          {Content && <Content />}
          {page.kind === 'service' && <ServiceContent service={page.service} />}
          {page.kind === 'project' && <ProjectContent project={page.project} />}
        </div>
        {path === 'contact' && <AppointmentForm />}
      </main>
      <Footer />
      <SiteInteractions />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }}
      />
    </>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteInteractions from '@/components/SiteInteractions';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header path="" />
      <main id="main">
        <section className="page-hero">
          <div className="wrap">
            <p className="eyebrow">Page not found</p>
            <h1>
              Let’s get you
              <br />
              back on track.
            </h1>
            <p>Explore our services or contact the team about your project.</p>
          </div>
        </section>
        <div className="wrap section">
          <Link className="btn" href="/">
            Back to home
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </main>
      <Footer />
      <SiteInteractions />
    </>
  );
}

import Brand from './Brand';
import { TextLines } from './content';
import { services } from '@/lib/services';
import { addressLines } from '@/lib/contact';
import { recipient } from '@/lib/email';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand wordmark />
            <p>
              Design. Build. Manage.
              <br />
              Bringing your vision to life in the Cayman Islands since 2010.
            </p>
            <div className="footer-social" aria-label="Social media">
              <a href="https://www.facebook.com/profile.php?id=61551207939045" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2H7.4v3h2.7v8h3.4Z" /></svg>
              </a>
              <a href="https://www.instagram.com/blueprintgroupofcompanies/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              <a href="/about/">About Blueprint</a>
              <a href="/projects/">Our projects</a>
              <a href="/products/">Product collection</a>
              <a href="/careers/">Careers</a>
              <a href="/contact/">Contact</a>
            </div>
          </div>
          <div>
            <h3>Our expertise</h3>
            <div className="footer-links">
              {services.map((service) => (
                <a key={service.slug} href={`/services/${service.slug}/`}>
                  {service.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3>Let’s talk</h3>
            <div className="footer-links">
              <a href="/contact/#appointment-heading">{recipient}</a>
              <a href="/contact/#appointment-heading">+1 (345) 926-4546</a>
              <a href="/contact/">
                <TextLines text={addressLines.join('\n')} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Blueprint Group of Companies.</span>
          <span>Design | Build | Manage · Cayman Islands</span>
        </div>
      </div>
    </footer>
  );
}

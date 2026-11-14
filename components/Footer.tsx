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
          </div>
          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              <a href="/about/">About Blueprint</a>
              <a href="/projects/">Our projects</a>
              <a href="/products/">Product collection</a>
              <a href="/careers/">Join Our Team!</a>
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

import Brand from './Brand';
import { ActionLink } from './content';

const navigation = [
  ['About', '/about/'],
  ['Services', '/services/'],
  ['Projects', '/projects/'],
  ['Products', '/products/'],
  ['Contact', '/contact/'],
] as const;

export default function Header({ path }: { path: string }) {
  const section = path.replace(/^\/+|\/+$/g, '').split('/')[0];
  return (
    <header className="header" id="header">
      <div className="wrap header-inner">
        <Brand wordmark />
        <nav className="nav" id="navigation" aria-label="Main navigation">
          {navigation.map(([name, href]) => (
            <a
              key={href}
              href={href}
              className={section === href.split('/')[1] ? 'active' : undefined}
              aria-current={section === href.split('/')[1] ? 'page' : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <div className="header-quote">
          <ActionLink href="/contact/">Start a project</ActionLink>
        </div>
        <button
          className="menu-btn"
          aria-label="Open navigation"
          aria-controls="navigation"
          aria-expanded="false"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

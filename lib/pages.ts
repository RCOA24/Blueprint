import { services, type Service } from './services';
import { projects, type Project } from './projects';

const descriptions: Record<string, string> = {
  '': 'Blueprint Group brings design, construction, remodeling and fencing expertise to projects across the Cayman Islands.',
  about:
    'Meet Blueprint Group, a Cayman Islands construction partner since 2010, built on craftsmanship and collaboration.',
  services:
    'Explore Blueprint Group construction, architectural, remodeling and fencing services in the Cayman Islands.',
  projects:
    'View Blueprint Group construction and fencing projects across Grand Cayman and Cayman Brac.',
  products:
    'Explore Blueprint Fencing products, gates, access controls and outdoor solutions in the Cayman Islands.',
  careers:
    'Explore careers with Blueprint Group across construction, design and fencing in the Cayman Islands.',
  contact:
    'Contact Blueprint Group in Grand Cayman to discuss your project, product enquiry or appointment request.',
};
const titles = {
  '': 'Design. Build. Manage.',
  about: 'About',
  services: 'Services',
  projects: 'Projects',
  products: 'Products',
  careers: 'Careers',
  contact: 'Contact',
} as const;
export type StaticPagePath = keyof typeof titles;
type PageMetadata = { title: string; description: string };
export type PageDefinition = PageMetadata &
  (
    | { kind: 'static'; path: StaticPagePath }
    | { kind: 'service'; service: Service }
    | { kind: 'project'; project: Project }
  );

/** Shared by static route generation, metadata and the sitemap. */
export const paths = [
  ...Object.keys(titles),
  ...services.map((service) => 'services/' + service.slug),
  ...projects.map((project) => 'projects/' + project.slug),
];

export function getPage(path: string): PageDefinition | null {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (Object.hasOwn(titles, clean)) {
    const staticPath = clean as StaticPagePath;
    return {
      kind: 'static',
      path: staticPath,
      title: titles[staticPath],
      description: descriptions[staticPath],
    };
  }
  const service = services.find((item) => clean === 'services/' + item.slug);
  if (service) return { kind: 'service', service, title: service.name, description: service.intro };
  const project = projects.find((item) => clean === 'projects/' + item.slug);
  if (project) return { kind: 'project', project, title: project.name, description: project.desc };
  return null;
}

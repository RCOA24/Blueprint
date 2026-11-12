import { Fragment, type ReactNode } from 'react';
import { services } from '@/lib/services';
import type { Project } from '@/lib/projects';

export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      ↗
    </span>
  );
}

export function ActionLink({
  children,
  href,
  variant = '',
}: {
  children: ReactNode;
  href: string;
  variant?: string;
}) {
  return (
    <a className={`btn ${variant}`} href={href}>
      {children}
      <Arrow />
    </a>
  );
}

export function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a className="text-link" href={href}>
      {children}
      <Arrow />
    </a>
  );
}

/** Render intentional line breaks from content without injecting HTML. */
export function TextLines({ text }: { text: string }) {
  return text.split('\n').map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: 'Services' | 'Projects';
}) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {breadcrumb && (
          <a className="crumb" href={breadcrumb === 'Services' ? '/services/' : '/projects/'}>
            ← All {breadcrumb.toLowerCase()}
          </a>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          <TextLines text={title} />
        </h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      className="project-card"
      data-category={project.category}
      href={`/projects/${project.slug}/`}
    >
      <div className="image">
        <img
          src={`/assets/${project.cover}`}
          alt={`${project.name} — ${project.category.toLowerCase()} work`}
          loading="lazy"
        />
        <Arrow />
      </div>
      <p className="meta">
        {project.category} · {project.place}
        {project.year ? ' · ' + project.year : ''}
      </p>
      <h3>{project.name}</h3>
    </a>
  );
}

export function ServiceRows() {
  return services.map((service, index) => (
    <a key={service.slug} className="service-row" href={`/services/${service.slug}/`}>
      <span>0{index + 1}</span>
      <div>
        <h3>{service.name}</h3>
        <p>{service.short}</p>
      </div>
      <Arrow />
    </a>
  ));
}

export function CallToAction() {
  return (
    <section className="cta">
      <div className="wrap">
        <div>
          <p className="eyebrow">Your next chapter</p>
          <h2>It starts with an idea.</h2>
          <p>Let’s talk about what you’d like to build.</p>
        </div>
        <ActionLink href="/contact/">Tell us about your project</ActionLink>
      </div>
    </section>
  );
}

export function Values() {
  return (
    <div className="values">
      <div>
        <span>01</span>Quality in the details
      </div>
      <div>
        <span>02</span>Clear, personal communication
      </div>
      <div>
        <span>03</span>Solutions shaped around you
      </div>
    </div>
  );
}

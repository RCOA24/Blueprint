import { projects } from '@/lib/projects';
import { PageHero, ProjectCard, CallToAction } from '@/components/content';
export default function ProjectsContent() {
  return (
    <>
      <PageHero
        eyebrow={'Project gallery'}
        title={'The work speaks.'}
        description={
          'Explore construction, fence installation and repair, and architectural design plans from Blueprint Group.'
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="filters" aria-label="Filter projects">
            {['All projects', ...new Set(projects.map((project) => project.category))].map(
              (category, index) => (
                <button
                  key={category}
                  className={'filter ' + (index === 0 ? 'active' : '')}
                  data-filter={index === 0 ? 'all' : category}
                  aria-pressed={index === 0}
                >
                  {category}
                </button>
              ),
            )}
          </div>
          <div className="project-grid filter-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

import type { Project } from '@/lib/projects';
import { PageHero, CallToAction, Arrow } from '@/components/content';
const assetDirectory = '/assets/';
const architectureGraphics: Record<string, { label: string; thumbnail: string }> = {
  'hvacarchitecture.jpeg': { label: 'HVAC design', thumbnail: 'hvac-thumbnail.jpg' },
  'plumbingarchitecture.jpeg': { label: 'Plumbing design', thumbnail: 'plumbing-thumbnail.jpg' },
  'electricalarchitecture.jpeg': {
    label: 'Electrical design',
    thumbnail: 'electrical-thumbnail.jpg',
  },
};
export default function ProjectContent({ project }: { project: Project }) {
  return (
    <>
      <PageHero
        eyebrow={
          project.category + ' · ' + project.place + (project.year ? ' · ' + project.year : '')
        }
        title={project.name}
        description={project.desc}
        breadcrumb={'Projects'}
      />

      {project.images.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>{project.category === 'Architecture' ? 'Design plans.' : 'On site.'}</h2>
              <p>Select an image to take a closer look.</p>
            </div>
            <div className="gallery-grid">
              {project.images.map((image, index) => (
                <button
                  key={image}
                  className={`gallery-open${architectureGraphics[image] ? ' gallery-graphic' : ''}`}
                  data-image={image}
                  data-caption={project.name + ' — image ' + (index + 1)}
                  aria-label={'Enlarge ' + project.name + ' image ' + (index + 1)}
                >
                  <img
                    src={assetDirectory + (architectureGraphics[image]?.thumbnail ?? image)}
                    alt={project.name + ', image ' + (index + 1)}
                    loading="lazy"
                  />
                  {architectureGraphics[image] && (
                    <span className="gallery-graphic-label">{architectureGraphics[image].label}</span>
                  )}
                  <Arrow />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      <CallToAction />
      {project.images.length > 0 && (
        <dialog id="lightbox" aria-label={project.name + ' image gallery'}>
          <div className="lightbox-image">
            <img alt="" />
            <button type="button" className="gallery-nav gallery-prev" aria-label="Previous image">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="gallery-nav gallery-next" aria-label="Next image">
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <div className="dialog-footer">
            <span aria-live="polite" aria-atomic="true"></span>
            <button className="close-dialog">Close ×</button>
          </div>
        </dialog>
      )}
    </>
  );
}

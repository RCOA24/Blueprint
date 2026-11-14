import { projects } from '@/lib/projects';
import ClientCarousel from '@/components/ClientCarousel';
import {
  ActionLink,
  TextLink,
  ProjectCard,
  ServiceRows,
  CallToAction,
  Arrow,
  Values,
} from '@/components/content';
export default function HomeContent() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Rooted in the Cayman Islands. Built around you.</p>
              <h1>
                Your vision.
                <br />
                Our expertise.
                <br />
                <span className="accent">One blueprint.</span>
              </h1>
              <p>
                Thoughtful design. Quality construction. From the first idea to the final detail, we
                bring your project to life.
              </p>
              <div className="hero-actions">
                <ActionLink href={'/services/'}>{'Explore our services'}</ActionLink>
                <TextLink href={'/projects/'}>{'View our work'}</TextLink>
              </div>
            </div>
            <div className="hero-photo">
              <video
                id="hero-video"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                poster={'/assets/' + 'blueprint-hero-poster.jpg'}
                aria-label="Blueprint Group architectural animation"
                disablePictureInPicture
              >
                <source src={'/assets/' + 'blueprint-hero.mp4'} type="video/mp4" />
              </video>
              <button type="button" className="hero-video-toggle" aria-controls="hero-video" aria-label="Pause video" hidden>
                <span className="hero-video-play" aria-hidden="true">▶</span>
                <span className="hero-video-pause" aria-hidden="true">❚❚</span>
              </button>
              <a className="photo-tag" href="/projects/">
                <span>
                  <small>DESIGN · BUILD · MANAGE</small>A vision for island living.
                </span>
                <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-foot">
            <div>
              <strong>2010</strong>
              <span>
                Building relationships
                <br />
                since day one.
              </span>
            </div>
            <div>
              <strong>Cayman Islands</strong>
              <span>
                Local knowledge.
                <br />A personal approach.
              </span>
            </div>
            <div>
              <strong>One team.</strong>
              <span>
                From concept
                <br />
                to completion.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap service-layout">
          <div className="service-intro">
            <p className="eyebrow">Our expertise</p>
            <h2>
              Every detail.
              <br />
              Every step.
            </h2>
            <p>
              A new home, a renewed space or a secure perimeter. Find the expertise your project
              needs, all in one place.
            </p>
            <TextLink href={'/services/'}>{'Discover our services'}</TextLink>
          </div>
          <div className="service-list">
            <ServiceRows />
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>Ideas taking shape.</h2>
            </div>
            <TextLink href={'/projects/'}>{'Explore the project gallery'}</TextLink>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <img
            className="split-image"
            src={'/assets/' + 'about-us-0.jpg'}
            alt="Craftsmanship and precision in construction"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">The people behind the blueprint</p>
            <h2>
              Built on trust.
              <br />
              Grounded in the Cayman Islands.
            </h2>
            <p>
              Since 2010, Blueprint Group has brought together design, construction and project
              management in the Cayman Islands.
            </p>
            <p>
              We approach each project with local understanding, careful craftsmanship and a
              commitment to listening.
            </p>
            <Values />
            <TextLink href={'/about/'}>{'Get to know Blueprint'}</TextLink>
          </div>
        </div>
      </section>
      <ClientCarousel />
      <CallToAction />
    </>
  );
}

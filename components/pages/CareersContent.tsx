import { PageHero } from '@/components/content';
export default function CareersContent() {
  return (
    <>
      <PageHero
        eyebrow={'Careers at Blueprint'}
        title={'Be part of what we build.'}
        description={
          'Bring your skills to a team working across construction, design and fencing in the Cayman Islands.'
        }
      />

      <section className="section">
        <div className="wrap careers-layout">
          <div className="careers-card">
            <h2>Your Talent. Our Vision.</h2>
            <p>
              We believe great projects begin with talented people, creative thinking, and a shared
              commitment to quality.
            </p>
          </div>
          <div className="careers-card">
            <h2>Join our team.</h2>
            <p>
              Are you passionate about design, construction, and bringing ideas to life? Join a team
              that turns concepts into reality.
            </p>
            <p>We welcome talented, motivated individuals across different areas of our business.</p>
            <p>
              Send your CV to{' '}
              <a className="text-link" href="mailto:info@blueprint.ky">
                <strong>info@blueprint.ky</strong>
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

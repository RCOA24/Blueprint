import { PageHero } from '@/components/content';
export default function CareersContent() {
  return (
    <>
      <PageHero
        eyebrow={'Careers at Blueprint'}
        title={'Build something\nyou’re proud of.'}
        description={
          'Bring your skills to a team working across construction, design and fencing in the Cayman Islands.'
        }
      />

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Work with us</p>
          <h2>
            <strong>JOIN OUR TEAM!</strong>
          </h2>
          <p>
            We are looking for hardworking and motivated individuals to join Blueprint Group of
            Companies.
            <br />
            If you have experience or an interest in construction and related services, we would
            like to hear from you.
          </p>
          <p>
            <a className="text-link" href="/contact/">
              <strong>Apply now!</strong>
            </a>
            <br />
            Send your CV to{' '}
            <a className="text-link" href="mailto:info@blueprint.ky">
              <strong>info@blueprint.ky</strong>
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

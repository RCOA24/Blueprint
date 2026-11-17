import { PageHero, CallToAction } from '@/components/content';
export default function AboutContent() {
  return (
    <>
      <PageHero
        eyebrow={'About Blueprint'}
        title={'Good work starts\nwith good people.'}
        description={
          'A Cayman Islands construction partner since 2010. Built on craftsmanship, collaboration and an understanding of island life.'
        }
      />

      <section className="section">
        <div className="wrap split">
          <img
            className="split-image"
            src={'/assets/' + 'about-us-1.jpg'}
            alt="A construction professional reviewing project drawings"
          />
          <div>
            <p className="eyebrow">Our story</p>
            <h2>
              Local roots.
              <br />A lasting commitment.
            </h2>
            <p>
              Established in Grand Cayman in 2010, Blueprint Group works with residential,
              commercial and industrial clients across the Cayman Islands.
            </p>
            <p>
              Our team brings design and construction experience to projects of different scales. We
              listen to what matters to you, then shape our approach around the needs of your
              property and your vision.
            </p>
            <p>
              From planning to construction, our focus stays on quality, communication and the
              details that make a space work.
            </p>
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap split">
          <div>
            <h3>Our mission</h3>
            <p>
              To transform ideas into reality through thoughtful design, quality construction, and
              dependable service.
            </p>
          </div>
          <div>
            <h3>Our vision</h3>
            <p>
              To shape the future of the Cayman Islands through innovative design, exceptional
              craftsmanship, and structures built to last.
            </p>
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

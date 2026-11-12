import { PageHero, CallToAction, Values } from '@/components/content';
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
            <Values />
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our approach</p>
              <h2>Made for life here.</h2>
            </div>
            <p>
              Considered spaces begin with an understanding of their surroundings and the people who
              use them.
            </p>
          </div>
          <div className="project-grid">
            <div>
              <p className="eyebrow">01 / Place</p>
              <h3>Island understanding</h3>
              <p>
                Local experience informs our approach to the Cayman Islands’ architectural character
                and construction requirements.
              </p>
            </div>
            <div>
              <p className="eyebrow">02 / People</p>
              <h3>A shared vision</h3>
              <p>
                We work closely with clients to connect the original idea with the decisions that
                bring it to life.
              </p>
            </div>
            <div>
              <p className="eyebrow">03 / Craft</p>
              <h3>Care in the details</h3>
              <p>
                From materials to execution, we bring attention and practical experience to the
                work.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

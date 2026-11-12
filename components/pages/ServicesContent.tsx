import { services } from '@/lib/services';
import { TextLink, PageHero, CallToAction } from '@/components/content';
const assetDirectory = '/assets/';
export default function ServicesContent() {
  return (
    <>
      <PageHero
        eyebrow={'Our expertise'}
        title={'One team.\nMany possibilities.'}
        description={
          'Design, construction, remodeling and fencing. Explore the expertise that brings every part of your project together.'
        }
      />

      <section className="section">
        <div className="wrap">
          {services.map((service, index) => (
            <article key={service.slug} className="service-tile">
              <img src={assetDirectory + service.image} alt={service.name} loading="lazy" />
              <div>
                <p className="eyebrow">0{index + 1} / Our services</p>
                <h2>{service.name}</h2>
                <p>{service.intro}</p>
                <div className="chips">
                  {service.items.slice(0, 3).map((item) => (
                    <span key={item[0]}>{item[0]}</span>
                  ))}
                </div>
                <TextLink href={'/services/' + service.slug + '/'}>
                  {'Explore this service'}
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CallToAction />
    </>
  );
}

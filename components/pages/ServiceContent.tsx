import type { Service } from '@/lib/services';
import { ActionLink, TextLink, PageHero, CallToAction } from '@/components/content';
const assetDirectory = '/assets/';
export default function ServiceContent({ service }: { service: Service }) {
  return (
    <>
      <PageHero
        eyebrow={service.name}
        title={service.title}
        description={service.intro}
        breadcrumb={'Services'}
      />

      <section className="section">
        <div className="wrap detail-grid">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>
              Expertise for
              <br />
              your next step.
            </h2>
            <p>
              Tell us what you have in mind. We’ll help you explore the approach that fits your
              project.
            </p>
            <ActionLink href={'/contact/?service=' + encodeURIComponent(service.name)}>
              {'Discuss your project'}
            </ActionLink>
          </div>
          <div>
            <ul className="detail-list">
              {service.items.map((item) => (
                <li key={item[0]}>
                  <h3>{item[0]}</h3>
                  <p>{item[1]}</p>
                </li>
              ))}
            </ul>
            <img
              className="large-image"
              src={assetDirectory + service.image}
              alt={service.name}
              loading="lazy"
            />
            {service.slug === 'blueprint-fencing' ? (
              <>
                <p style={{ marginTop: 24 }}>
                  Looking for a particular fence, gate or outdoor product?
                </p>
                <TextLink href={'/products/'}>{'Browse all 12 product categories'}</TextLink>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

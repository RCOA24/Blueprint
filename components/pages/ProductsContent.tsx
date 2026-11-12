import { products } from '@/lib/products';
import { PageHero, CallToAction, Arrow } from '@/components/content';
export default function ProductsContent() {
  return (
    <>
      <PageHero
        eyebrow={'Product collection'}
        title={'The right finish.\nThe right fit.'}
        description={
          'Explore fencing, gates, access controls and outdoor solutions. Talk to our team about specifications and options for your property.'
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="filters" aria-label="Filter products">
            {['All products', 'Fencing', 'Gates & access', 'Outdoor'].map((category, index) => (
              <button
                key={category}
                className={'filter ' + (index === 0 ? 'active' : '')}
                data-filter={index === 0 ? 'all' : category}
                aria-pressed={index === 0}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="count" aria-live="polite">
            12 product categories
          </p>
          <div className="catalog filter-grid">
            {products.map(([name, category], index) => (
              <article key={name} data-category={category}>
                <a href={'/contact/?product=' + encodeURIComponent(name)}>
                  <div className="product-img">
                    <img
                      src={'/assets/' + 'our-products-' + index + '.jpg'}
                      alt={name}
                      loading="lazy"
                    />
                  </div>
                  <p className="meta">{category}</p>
                  <h3>{name}</h3>
                  <span className="text-link">
                    Enquire about this product <Arrow />
                  </span>
                </a>
              </article>
            ))}
          </div>
          <p className="note">
            Every property is different. Contact our team to confirm product specifications,
            availability and the right solution for your project.
          </p>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

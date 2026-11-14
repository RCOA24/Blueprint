import { clients } from '@/lib/clients';

export default function ClientCarousel() {
  return (
    <section className="section clients-section" aria-labelledby="clients-heading">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Bringing Visions to Life, Together.</p>
            <h2 id="clients-heading">Our clients.</h2>
          </div>
        </div>
        <div className="client-carousel">
          <div className="client-track">
            {[0, 1].map((copy) => (
              <ul className="client-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {clients.map((client) => (
                  <li className="client-logo" key={client.image}>
                    <img
                      src={'/assets/Client_Logos/' + encodeURIComponent(client.image)}
                      alt={copy === 0 ? client.name : ''}
                      width="200"
                      height="120"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

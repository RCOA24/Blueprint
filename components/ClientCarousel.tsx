'use client';

import { useEffect, useRef, useState } from 'react';
import { clients } from '@/lib/clients';

const pages = Array.from({ length: Math.ceil(clients.length / 4) }, (_, index) =>
  clients.slice(index * 4, index * 4 + 4),
);

export default function ClientCarousel() {
  const carousel = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (hovered || focused) return;

    const timer = window.setInterval(() => {
      const element = carousel.current;
      if (!element || document.hidden || motion.matches) return;
      const current = Math.round(element.scrollLeft / element.clientWidth);
      element.scrollTo({ left: ((current + 1) % pages.length) * element.clientWidth, behavior: 'smooth' });
    }, 3500);
    return () => window.clearInterval(timer);
  }, [hovered, focused]);

  return (
    <section className="section clients-section" aria-labelledby="clients-heading">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Bringing Visions to Life, Together.</p>
            <h2 id="clients-heading">Our clients.</h2>
          </div>
        </div>
        <div
          onMouseEnter={() => {
            if (window.matchMedia('(hover: hover)').matches) setHovered(true);
          }}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
        >
        <div
          className="client-carousel"
          ref={carousel}
          id="client-carousel"
          aria-label="Client logos"
          onScroll={(event) => {
            const element = event.currentTarget;
            setActivePage(Math.round(element.scrollLeft / element.clientWidth));
          }}
        >
          {pages.map((page, index) => (
            <ul className="client-group" key={index} aria-label={`Client logos ${index * 4 + 1} to ${index * 4 + page.length}`}>
              {page.map((client) => (
                <li className="client-logo" key={client.image}>
                  <img
                    src={'/assets/client-logos-optimized/' + encodeURIComponent(client.image)}
                    alt={client.name}
                    width="200"
                    height="120"
                    loading="eager"
                    decoding="async"
                    fetchPriority="low"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="client-dots" role="group" aria-label="Choose client logo page">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className="client-dot"
              aria-label={`Show client logos page ${index + 1}`}
              aria-current={activePage === index ? 'true' : undefined}
              aria-controls="client-carousel"
              onClick={() => {
                setActivePage(index);
                carousel.current?.scrollTo({
                  left: index * carousel.current.clientWidth,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                });
              }}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

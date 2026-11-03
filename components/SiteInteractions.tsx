'use client';

import { useEffect } from 'react';

export default function SiteInteractions() {
  useEffect(() => {
    const cleaners: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(element: HTMLElement, type: K, handler: (event: HTMLElementEventMap[K]) => void) => {
      element.addEventListener(type, handler as EventListener);
      cleaners.push(() => element.removeEventListener(type, handler as EventListener));
    };

    const menu = document.querySelector<HTMLButtonElement>('.menu-btn');
    const nav = document.querySelector<HTMLElement>('.nav');
    if (menu && nav) {
      on(menu, 'click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        menu.textContent = open ? '×' : '☰';
        nav.classList.toggle('open', open);
      });
      for (const link of nav.querySelectorAll<HTMLAnchorElement>('a')) on(link, 'click', () => {
        nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open navigation'); menu.textContent = '☰';
      });
    }

    const filters = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
    for (const filter of filters) on(filter, 'click', () => {
      for (const button of filters) {
        button.classList.toggle('active', button === filter);
        button.setAttribute('aria-pressed', String(button === filter));
      }
      let count = 0;
      for (const card of document.querySelectorAll<HTMLElement>('.filter-grid > [data-category]')) {
        card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
        if (!card.hidden) count++;
      }
      const counter = document.querySelector<HTMLElement>('.count');
      if (counter) counter.textContent = `${count} product ${count === 1 ? 'category' : 'categories'}`;
    });

    const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
    if (dialog) {
      const image = dialog.querySelector<HTMLImageElement>('img');
      const caption = dialog.querySelector<HTMLElement>('.dialog-footer span');
      for (const button of document.querySelectorAll<HTMLButtonElement>('.gallery-open')) on(button, 'click', () => {
        if (!image || !caption) return;
        image.src = `/assets/${button.dataset.image ?? ''}`;
        image.alt = button.dataset.caption ?? '';
        caption.textContent = button.dataset.caption ?? '';
        dialog.showModal();
      });
      const close = dialog.querySelector<HTMLButtonElement>('.close-dialog');
      if (close) on(close, 'click', () => dialog.close());
      on(dialog, 'click', event => { if (event.target === dialog) dialog.close(); });
    }

    const video = document.querySelector<HTMLVideoElement>('#hero-video');
    const toggle = document.querySelector<HTMLButtonElement>('.video-toggle');
    if (video && toggle) {
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      video.controls = false; video.muted = true; toggle.hidden = false;
      const sync = () => { toggle.textContent = video.paused ? 'Play video' : 'Pause video'; toggle.setAttribute('aria-label', toggle.textContent); };
      const motionChanged = () => { if (motion.matches) video.pause(); };
      on(video, 'play', sync); on(video, 'pause', sync);
      on(toggle, 'click', () => { if (video.paused) void video.play().catch(sync); else video.pause(); });
      motion.addEventListener('change', motionChanged); cleaners.push(() => motion.removeEventListener('change', motionChanged));
      if (!motion.matches) void video.play().catch(sync);
      sync();
    }
    return () => { for (const clean of cleaners) clean(); };
  }, []);
  return null;
}

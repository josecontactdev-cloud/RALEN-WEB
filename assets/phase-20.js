/* Phase 20 — RALEN hero image sequence
 * Pointer position selects a frame on desktop; hero scroll progress selects it on touch/mobile.
 */
(() => {
  const init = (hero) => {
    const media = hero.querySelector('[data-ralen-hero-media]');
    if (!media) return;

    const frames = [...media.querySelectorAll('[data-hero-frame]')];
    if (frames.length < 2) return;

    const count = frames.length;
    const counter = hero.querySelector('[data-ralen-frame-count]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let target = 0;
    let pointerActive = false;
    let scrollQueued = false;

    const pad = (value) => String(value).padStart(2, '0');

    const render = (index) => {
      const next = Math.max(0, Math.min(count - 1, index));
      if (next === current && frames[current]?.classList.contains('is-active')) return;
      frames[current]?.classList.remove('is-active');
      frames[next]?.classList.add('is-active');
      current = next;
      if (counter) counter.textContent = pad(current + 1) + ' / ' + pad(count);
    };

    const pointerToFrame = (event) => {
      if (reduced) return;
      const rect = media.getBoundingClientRect();
      if (!rect.width) return;
      const progress = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width));
      render(Math.floor(progress * count));
    };

    const scrollToFrame = () => {
      scrollQueued = false;
      if (reduced || pointerActive) return;
      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, hero.offsetHeight - viewport);
      const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
      render(Math.floor(progress * count));
    };

    media.addEventListener('pointerenter', () => { pointerActive = true; });
    media.addEventListener('pointerleave', () => { pointerActive = false; });
    media.addEventListener('pointermove', pointerToFrame, { passive: true });

    window.addEventListener('scroll', () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(scrollToFrame);
    }, { passive: true });

    let touchStartX = 0;
    media.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0]?.clientX || 0;
    }, { passive: true });

    media.addEventListener('touchmove', (event) => {
      if (reduced) return;
      const x = event.touches[0]?.clientX || touchStartX;
      const delta = x - touchStartX;
      if (Math.abs(delta) > 12) {
        const step = delta > 0 ? -1 : 1;
        target = Math.max(0, Math.min(count - 1, current + step));
        render(target);
        touchStartX = x;
      }
    }, { passive: true });

    render(0);
  };

  const boot = () => document.querySelectorAll('[data-ralen-hero]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

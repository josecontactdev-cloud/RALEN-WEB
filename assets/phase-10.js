/* Phase 10 — RALEN RUN card motion */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function initProductMotion() {
    const section = document.querySelector('.ralen-products');
    if (!section) return;
    const cards = [...section.querySelectorAll('[data-ralen-card]')];
    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.dataset.ralenMotion = reducedMotion ? 'visible' : 'hidden';
      card.style.setProperty('--ralen-card-delay', Math.min(index * 70, 360) + 'ms');
      if (!reducedMotion) card.style.transitionDelay = 'var(--ralen-card-delay)';
    });

    if (!reducedMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.ralenMotion = 'visible';
          observer.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
      cards.forEach((card) => observer.observe(card));
    }

    if (finePointer && !reducedMotion && window.gsap) {
      cards.forEach((card) => {
        const media = card.querySelector('.ralen-card__media');
        if (!media) return;
        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;
          window.gsap.to(media, { rotateY: x * 1.8, rotateX: y * -1.4, transformPerspective: 1100, duration: .6, overwrite: true, ease: 'power3.out' });
        }, { passive: true });
        card.addEventListener('pointerleave', () => {
          window.gsap.to(media, { rotateY: 0, rotateX: 0, duration: .7, overwrite: true, ease: 'power3.out' });
        });
      });
    }

    if (!finePointer && !reducedMotion) {
      cards.forEach((card) => {
        const secondary = card.querySelector('.ralen-card__image--secondary');
        if (!secondary) return;
        card.addEventListener('touchstart', () => {
          cards.forEach((other) => { if (other !== card) other.classList.remove('is-active'); });
          card.classList.toggle('is-active');
        }, { passive: true });
      });
    }
  }

  function init() {
    document.documentElement.classList.add('ralen-phase-10');
    initProductMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

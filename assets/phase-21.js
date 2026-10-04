/* Phase 21 — RALEN catalog/product image interaction
 * Desktop: horizontal pointer position selects product imagery.
 * Touch: horizontal swipe advances imagery without blocking vertical scroll.
 */
(() => {
  const preload = (src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  };

  const initCards = () => {
    document.querySelectorAll('[data-ralen-card-gallery]').forEach((media) => {
      const image = media.querySelector('.ralen-card__image--primary');
      if (!image) return;

      const sources = [image.currentSrc || image.src];
      for (let i = 1; i <= 4; i += 1) {
        const src = media.getAttribute('data-card-image-' + i);
        if (src) {
          sources.push(src);
          preload(src);
        }
      }
      if (sources.length < 2) return;

      let current = 0;
      let touchStartX = 0;
      let touchStartY = 0;

      const show = (index) => {
        const next = Math.max(0, Math.min(sources.length - 1, index));
        if (next === current) return;
        image.src = sources[next];
        image.removeAttribute('srcset');
        current = next;
        media.dataset.imageIndex = String(next);
      };

      media.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        const rect = media.getBoundingClientRect();
        const progress = Math.max(0, Math.min(.999, (event.clientX - rect.left) / rect.width));
        show(Math.floor(progress * sources.length));
      }, { passive: true });

      media.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch?.clientX || 0;
        touchStartY = touch?.clientY || 0;
      }, { passive: true });

      media.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const dx = (touch?.clientX || 0) - touchStartX;
        const dy = (touch?.clientY || 0) - touchStartY;
        if (Math.abs(dx) < 28 || Math.abs(dx) < Math.abs(dy)) return;
        show(current + (dx < 0 ? 1 : -1));
      }, { passive: true });
    });
  };

  const initProduct = () => {
    const stage = document.querySelector('[data-ralen-product-stage]');
    const mainImage = document.querySelector('#RalenProductMainImage');
    const thumbs = [...document.querySelectorAll('[data-ralen-thumb]')];
    if (!stage || !mainImage || thumbs.length < 2) return;

    let current = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const show = (index) => {
      const next = Math.max(0, Math.min(thumbs.length - 1, index));
      if (next === current) return;
      thumbs[next].click();
      stage.classList.add('is-changing');
      window.setTimeout(() => stage.classList.remove('is-changing'), 180);
      current = next;
    };

    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const rect = stage.getBoundingClientRect();
      const progress = Math.max(0, Math.min(.999, (event.clientX - rect.left) / rect.width));
      show(Math.floor(progress * thumbs.length));
    }, { passive: true });

    stage.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      touchStartX = touch?.clientX || 0;
      touchStartY = touch?.clientY || 0;
    }, { passive: true });

    stage.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      const dx = (touch?.clientX || 0) - touchStartX;
      const dy = (touch?.clientY || 0) - touchStartY;
      if (Math.abs(dx) < 28 || Math.abs(dx) < Math.abs(dy)) return;
      show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  };

  const boot = () => {
    initCards();
    initProduct();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

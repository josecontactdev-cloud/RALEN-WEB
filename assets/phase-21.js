/* Phase 21 — RALEN product gallery touch interaction.
 * Product cards use CSS only: hover reveals the next image with a subtle zoom.
 */
(() => {
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

  const boot = () => initProduct();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

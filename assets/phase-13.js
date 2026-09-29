/* Phase 13 — first-load stability */
(() => {
  function init() {
    document.querySelectorAll('.ralen-products .ralen-card').forEach((card) => {
      card.dataset.ralenMotion = 'visible';
      card.style.opacity = '1';
      card.style.transform = 'none';
      card.style.transitionDelay = '0ms';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* Phase 14 — RALEN launch newsletter popup */
(() => {
  const KEY = 'ralen-newsletter-popup-seen';
  const modal = document.querySelector('[data-ralen-newsletter-modal]');
  if (!modal) return;
  const closeButtons = modal.querySelectorAll('[data-newsletter-close]');
  const emailInput = modal.querySelector('#RalenLaunchNewsletterEmail');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove('ralen-newsletter-open');
  };

  const open = () => {
    if (opened) return;
    opened = true;
    modal.hidden = false;
    document.body.classList.add('ralen-newsletter-open');
    window.setTimeout(() => emailInput?.focus(), reducedMotion ? 0 : 250);
  };

  const scheduleOpen = () => {
    if (sessionStorage.getItem(KEY) === '1') return;
    sessionStorage.setItem(KEY, '1');
    window.setTimeout(open, 450);
  };

  closeButtons.forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });

  if (document.body.classList.contains('is-intro-active')) {
    document.addEventListener('ralen:intro-complete', scheduleOpen, { once: true });
  } else {
    window.setTimeout(scheduleOpen, 900);
  }
})();
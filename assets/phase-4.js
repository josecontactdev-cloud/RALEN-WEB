(() => {
  function initMobileMenu() {
    const toggle = document.querySelector('[data-ralen-menu-toggle]');
    const menu = document.querySelector('[data-ralen-mobile-menu]');
    const closeButton = document.querySelector('[data-ralen-menu-close]');
    if (!toggle || !menu) return;

    let lastFocused = null;

    const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')];

    const close = ({ restoreFocus = true } = {}) => {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('is-menu-open');
      if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    const open = () => {
      lastFocused = document.activeElement;
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('is-menu-open');
      requestAnimationFrame(() => focusables()[0]?.focus());
    };

    toggle.addEventListener('click', () => {
      if (menu.hidden) open();
      else close();
    });
    closeButton?.addEventListener('click', () => close());
    menu.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', () => close({ restoreFocus: false })));

    document.addEventListener('keydown', (event) => {
      if (menu.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktop = window.matchMedia('(min-width: 990px)');
    const onDesktop = (event) => {
      if (event.matches) close({ restoreFocus: false });
    };
    desktop.addEventListener?.('change', onDesktop);
  }

  function initTouchState() {
    const setViewportUnit = () => {
      document.documentElement.style.setProperty('--ralen-vh', `${window.innerHeight * 0.01}px`);
    };
    setViewportUnit();
    window.addEventListener('resize', setViewportUnit, { passive: true });
  }

  function init() {
    initMobileMenu();
    initTouchState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

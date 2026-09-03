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

    toggle.addEventListener('click', () => menu.hidden ? open() : close());
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
    desktop.addEventListener?.('change', (event) => {
      if (event.matches) close({ restoreFocus: false });
    });
  }

  function initMobileBuyBar() {
    const bar = document.querySelector('[data-ralen-mobile-buy-bar]');
    const form = document.querySelector('.ralen-product-form');
    const mainButton = document.querySelector('[data-ralen-add-button]');
    const stickyButton = document.querySelector('[data-ralen-sticky-add]');
    const stickyLabel = document.querySelector('[data-ralen-sticky-label]');
    const stickyPrice = document.querySelector('[data-ralen-sticky-price]');
    const mainPrice = document.querySelector('[data-ralen-product-current-price]');
    const variantSelect = document.querySelector('[data-ralen-variant-select]');
    if (!bar || !form || !mainButton || !stickyButton) return;

    const sync = () => {
      stickyButton.disabled = mainButton.disabled;
      if (stickyLabel) stickyLabel.textContent = mainButton.disabled ? 'AGOTADO' : 'AÑADIR';
      if (stickyPrice && mainPrice) stickyPrice.textContent = mainPrice.textContent;
    };

    const updateVisibility = () => {
      if (window.innerWidth >= 990) {
        bar.classList.remove('is-visible');
        bar.setAttribute('aria-hidden', 'true');
        return;
      }
      const rect = mainButton.getBoundingClientRect();
      const buttonVisible = rect.top < window.innerHeight && rect.bottom > 0;
      const shouldShow = window.scrollY > 160 && !buttonVisible;
      bar.classList.toggle('is-visible', shouldShow);
      bar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    };

    stickyButton.addEventListener('click', () => {
      sync();
      if (!stickyButton.disabled) form.requestSubmit(mainButton);
    });

    variantSelect?.addEventListener('change', () => requestAnimationFrame(sync));
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });

    sync();
    updateVisibility();
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
    initMobileBuyBar();
    initTouchState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

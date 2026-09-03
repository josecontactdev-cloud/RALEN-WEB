(() => {
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  const cartEndpoint = `${root}cart.js`;
  const addEndpoint = `${root}cart/add.js`;
  const changeEndpoint = `${root}cart/change.js`;

  const drawer = document.querySelector('[data-ralen-cart-drawer]');
  const drawerItems = drawer?.querySelector('[data-ralen-cart-drawer-items]');
  const drawerFooter = drawer?.querySelector('[data-ralen-cart-drawer-footer]');
  const drawerSubtotal = drawer?.querySelector('[data-ralen-cart-drawer-subtotal]');
  const currency = drawer?.dataset.currency || 'MXN';
  let lastFocused = null;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const money = (cents = 0) => {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'es-MX', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
      }).format(Number(cents) / 100);
    } catch (_) {
      return `${(Number(cents) / 100).toFixed(2)} ${currency}`;
    }
  };

  function updateCartCounts(count) {
    document.querySelectorAll('[data-ralen-cart-count]').forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count < 1;
    });
    document.querySelectorAll('[data-ralen-cart-menu-count]').forEach((node) => {
      node.textContent = count;
    });
  }

  function itemMarkup(item) {
    const variant = item.variant_title && item.variant_title !== 'Default Title'
      ? `<p>${escapeHTML(item.variant_title)}</p>`
      : '';
    const image = item.image
      ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.product_title)}" loading="lazy">`
      : '';

    return `
      <article class="ralen-drawer-item" data-cart-key="${escapeHTML(item.key)}" data-cart-quantity="${item.quantity}">
        <a href="${escapeHTML(item.url)}" class="ralen-drawer-item__media">${image}</a>
        <div class="ralen-drawer-item__info">
          <div>
            <h3><a href="${escapeHTML(item.url)}">${escapeHTML(item.product_title)}</a></h3>
            ${variant}
          </div>
          <strong>${money(item.final_line_price)}</strong>
          <div class="ralen-drawer-item__controls">
            <button type="button" data-cart-change="minus" aria-label="Reducir cantidad">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-change="plus" aria-label="Aumentar cantidad">＋</button>
            <button type="button" class="ralen-drawer-item__remove" data-cart-remove>ELIMINAR</button>
          </div>
        </div>
      </article>`;
  }

  function renderCart(cart) {
    updateCartCounts(cart.item_count || 0);
    if (!drawerItems || !drawerFooter || !drawerSubtotal) return;

    if (!cart.item_count) {
      drawerItems.innerHTML = `
        <div class="ralen-cart-drawer__empty" data-ralen-cart-empty>
          <span>00</span>
          <p>Nada aquí, todavía.</p>
          <a href="${root}collections/all">EXPLORAR OBJETOS →</a>
        </div>`;
      drawerFooter.hidden = true;
      return;
    }

    drawerItems.innerHTML = cart.items.map(itemMarkup).join('');
    drawerSubtotal.textContent = money(cart.total_price);
    drawerFooter.hidden = false;
  }

  async function getCart() {
    const response = await fetch(cartEndpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('No se pudo cargar el carrito');
    const cart = await response.json();
    renderCart(cart);
    return cart;
  }

  function drawerFocusables() {
    return drawer ? [...drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')] : [];
  }

  async function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-cart-drawer-open');
    try { await getCart(); } catch (_) {}
    requestAnimationFrame(() => drawerFocusables()[0]?.focus());
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-cart-drawer-open');
    if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  async function addForm(form, button) {
    const label = button?.querySelector('[data-ralen-quick-add-label]');
    const initialLabel = label?.textContent;
    if (button) button.disabled = true;
    if (label) label.textContent = 'AÑADIENDO…';

    try {
      const response = await fetch(addEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error('No se pudo añadir el producto');
      if (label) label.textContent = 'AÑADIDO';
      button?.classList.add('is-added');
      await getCart();
      await openDrawer();
    } catch (_) {
      if (label) label.textContent = 'INTENTA DE NUEVO';
    } finally {
      window.setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.classList.remove('is-added');
        }
        if (label) label.textContent = initialLabel || 'AÑADIR';
      }, 1200);
    }
  }

  function initQuickAdd() {
    document.addEventListener('submit', (event) => {
      const form = event.target.closest('[data-ralen-quick-add]');
      if (!form) return;
      event.preventDefault();
      addForm(form, form.querySelector('[data-ralen-quick-add-button]'));
    });

    const productForm = document.querySelector('.ralen-product-form');
    if (productForm) {
      productForm.addEventListener('submit', (event) => {
        const submitter = event.submitter;
        if (submitter && submitter.name !== 'add') return;
        event.preventDefault();
        addForm(productForm, productForm.querySelector('[data-ralen-add-button]'));
      });
    }
  }

  function initCartDrawer() {
    if (!drawer) return;

    document.querySelectorAll('[data-ralen-cart-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openDrawer();
      });
    });
    drawer.querySelectorAll('[data-ralen-cart-drawer-close]').forEach((button) => button.addEventListener('click', () => closeDrawer()));

    drawer.addEventListener('click', async (event) => {
      const item = event.target.closest('[data-cart-key]');
      if (!item) return;
      const key = item.dataset.cartKey;
      const current = Number(item.dataset.cartQuantity || 1);
      let quantity = null;

      if (event.target.closest('[data-cart-remove]')) quantity = 0;
      if (event.target.closest('[data-cart-change="minus"]')) quantity = Math.max(0, current - 1);
      if (event.target.closest('[data-cart-change="plus"]')) quantity = current + 1;
      if (quantity === null) return;

      item.style.pointerEvents = 'none';
      item.style.opacity = '.55';
      try {
        const response = await fetch(changeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: key, quantity })
        });
        if (!response.ok) throw new Error('No se pudo actualizar el carrito');
        renderCart(await response.json());
      } catch (_) {
        item.style.pointerEvents = '';
        item.style.opacity = '';
      }
    });

    document.addEventListener('keydown', (event) => {
      if (drawer.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = drawerFocusables();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initRecommendations() {
    document.querySelectorAll('[data-ralen-recommendations][data-url]').forEach(async (section) => {
      try {
        const response = await fetch(section.dataset.url);
        if (!response.ok) return;
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const incoming = doc.querySelector('[data-ralen-recommendations]');
        if (!incoming || incoming.hidden) return;
        section.replaceWith(incoming);
      } catch (_) {}
    });
  }

  function init() {
    initQuickAdd();
    initCartDrawer();
    initRecommendations();
    getCart().catch(() => {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

(() => {
  const drawer = document.querySelector('[data-ralen-cart-drawer]');
  let latestCart = null;

  function pushCommerceEvent(event, ecommerce = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ecommerce });
  }

  function updateShippingProgress(cart) {
    if (!drawer) return;
    const wrap = drawer.querySelector('[data-ralen-shipping-progress]');
    if (!wrap) return;

    const threshold = Number(wrap.dataset.threshold || 0);
    if (!threshold) {
      wrap.hidden = true;
      return;
    }

    const total = Number(cart?.total_price || 0);
    const remaining = Math.max(0, threshold - total);
    const ratio = Math.max(0, Math.min(1, total / threshold));
    const message = wrap.querySelector('[data-ralen-shipping-message]');
    const bar = wrap.querySelector('[data-ralen-shipping-bar]');
    const currency = drawer.dataset.currency || 'MXN';
    const locale = document.documentElement.lang || 'es-MX';
    const money = (value) => new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(value / 100);

    wrap.hidden = false;
    if (message) {
      message.textContent = remaining > 0
        ? `TE FALTAN ${money(remaining)} PARA ENVÍO GRATIS`
        : 'YA TIENES ENVÍO GRATIS';
    }
    if (bar) bar.style.transform = `scaleX(${ratio})`;
  }

  const cartToEcommerce = (cart) => ({
    currency: drawer?.dataset.currency || 'MXN',
    value: Number(cart?.total_price || 0) / 100,
    items: (cart?.items || []).map((item) => ({
      item_id: String(item.product_id || item.variant_id || ''),
      item_name: item.product_title || item.title || '',
      item_variant: item.variant_title || '',
      price: Number(item.final_price || item.price || 0) / 100,
      quantity: Number(item.quantity || 1)
    }))
  });

  function initCommerceEvents() {
    const product = document.querySelector('[data-ralen-product][data-product-id]');
    if (product) {
      pushCommerceEvent('view_item', {
        currency: drawer?.dataset.currency || 'MXN',
        value: Number(product.dataset.productPrice || 0) / 100,
        items: [{
          item_id: product.dataset.productId,
          item_name: product.dataset.productTitle,
          item_brand: product.dataset.productVendor || 'RALEN',
          price: Number(product.dataset.productPrice || 0) / 100,
          quantity: 1
        }]
      });
    }

    document.addEventListener('ralen:item-added', (event) => {
      const item = event.detail?.item;
      if (!item) return;
      pushCommerceEvent('add_to_cart', {
        currency: drawer?.dataset.currency || 'MXN',
        value: Number(item.final_price || item.price || 0) / 100,
        items: [{
          item_id: String(item.product_id || item.variant_id || ''),
          item_name: item.product_title || item.title || '',
          item_variant: item.variant_title || '',
          price: Number(item.final_price || item.price || 0) / 100,
          quantity: Number(item.quantity || 1)
        }]
      });
    });

    document.addEventListener('ralen:cart-updated', (event) => {
      latestCart = event.detail?.cart || null;
      if (latestCart) updateShippingProgress(latestCart);
    });

    document.addEventListener('click', (event) => {
      const cartTrigger = event.target.closest('[data-ralen-cart-trigger]');
      if (cartTrigger && latestCart) pushCommerceEvent('view_cart', cartToEcommerce(latestCart));

      const checkout = event.target.closest('[name="checkout"], .ralen-cart-drawer__checkout');
      if (checkout && latestCart) pushCommerceEvent('begin_checkout', cartToEcommerce(latestCart));
    });

    const newsletter = document.querySelector('#RalenNewsletter');
    newsletter?.addEventListener('submit', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', lead_source: 'newsletter' });
    });
  }

  function init() {
    initCommerceEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

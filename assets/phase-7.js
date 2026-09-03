(() => {
  function initMerchandisingState() {
    const node = document.querySelector('[data-ralen-merchandising-state]');
    if (!node) return;

    try {
      const state = JSON.parse(node.textContent || '{}');
      const frozenState = Object.freeze({ ...state });

      Object.defineProperty(window, 'RalenMerchandising', {
        value: frozenState,
        configurable: true,
        enumerable: false,
        writable: false
      });

      document.dispatchEvent(new CustomEvent('ralen:merchandising-ready', { detail: frozenState }));

      if (state.product_id && state.mode && state.mode !== 'manual') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'view_promotion',
          ecommerce: {
            creative_slot: `hero_${state.mode}`,
            promotion_name: 'RALEN dynamic hero',
            items: [{
              item_id: String(state.product_id),
              item_name: state.product_title || '',
              item_list_name: state.collection_handle || state.source || 'dynamic_source'
            }]
          }
        });
      }
    } catch (_) {
      // The storefront remains fully functional if the optional state payload cannot be parsed.
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMerchandisingState, { once: true });
  } else {
    initMerchandisingState();
  }
})();

(() => {
  function initProductGallery() {
    const mainImage = document.querySelector('#RalenProductMainImage');
    const thumbs = document.querySelectorAll('[data-ralen-thumb]');
    if (!mainImage || !thumbs.length) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.imageUrl;
        const alt = thumb.dataset.imageAlt || '';
        if (!src) return;

        mainImage.src = src;
        mainImage.removeAttribute('srcset');
        mainImage.alt = alt;
        thumbs.forEach((item) => item.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  }

  function initProductVariants() {
    const select = document.querySelector('[data-ralen-variant-select]');
    if (!select) return;

    const currentPrice = document.querySelector('[data-ralen-product-current-price]');
    const comparePrice = document.querySelector('[data-ralen-product-compare]');
    const addButton = document.querySelector('[data-ralen-add-button]');
    const addLabel = document.querySelector('[data-ralen-add-label]');

    const sync = () => {
      const option = select.options[select.selectedIndex];
      const available = option.dataset.available === 'true';
      const compare = option.dataset.compare || '';

      if (currentPrice) currentPrice.textContent = option.dataset.price || '';
      if (comparePrice) {
        comparePrice.textContent = compare;
        comparePrice.hidden = !compare;
      }
      if (addButton) addButton.disabled = !available;
      if (addLabel) addLabel.textContent = available ? 'AGREGAR AL CARRITO' : 'AGOTADO';
    };

    select.addEventListener('change', sync);
    sync();
  }

  function init() {
    initProductGallery();
    initProductVariants();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

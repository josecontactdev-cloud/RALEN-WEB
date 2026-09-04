(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function splitWords(element) {
    if (!element || element.dataset.ralenSplit === '1') return [];

    const text = (element.textContent || '').trim();
    if (!text) return [];

    element.dataset.ralenSplit = '1';
    element.setAttribute('aria-label', text);
    element.textContent = '';

    const words = text.split(/\s+/);
    const nodes = [];

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'ralen-reveal-word';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      element.appendChild(span);
      nodes.push(span);
      if (index < words.length - 1) element.append(' ');
    });

    return nodes;
  }

  function initHeaderState() {
    const header = document.querySelector('[data-ralen-header]');
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };

    update();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  function initHeroMotion() {
    const hero = document.querySelector('.ralen-hero--tech');
    if (!hero) return;

    const title = hero.querySelector('[data-hero-split]');
    const titleWords = splitWords(title);
    const media = hero.querySelector('.ralen-hero__media');
    const image = hero.querySelector('.ralen-hero__image');
    const frame = hero.querySelector('.ralen-hero__frame');
    const staged = hero.querySelectorAll('.ralen-eyebrow, .ralen-hero__copy, .ralen-hero__systems, .ralen-hero__actions, .ralen-product-chip');

    if (!reducedMotion && window.gsap) {
      const gsap = window.gsap;

      gsap.set(titleWords, { yPercent: 120, opacity: 0 });
      gsap.set(staged, { y: 18, opacity: 0 });
      if (media) gsap.set(media, { clipPath: 'inset(0 0 100% 0)' });
      if (frame) gsap.set(frame, { opacity: 0 });

      let revealed = false;
      const runReveal = () => {
        if (revealed) return;
        revealed = true;

        const tl = gsap.timeline({ delay: .08, defaults: { ease: 'power3.out' } });
        tl.to(titleWords, {
          yPercent: 0,
          opacity: 1,
          duration: .82,
          stagger: .055
        })
        .to(staged, {
          y: 0,
          opacity: 1,
          duration: .7,
          stagger: .065
        }, '-=.5');

        if (media) {
          tl.to(media, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.05,
            ease: 'power4.inOut'
          }, '-=.72');
        }

        if (frame) {
          tl.to(frame, { opacity: 1, duration: .6 }, '-=.45');
        }

        if (image) {
          gsap.fromTo(image,
            { scale: 1.1 },
            { scale: 1.035, duration: 1.35, ease: 'power3.out', delay: .43 }
          );
        }
      };

      if (document.body.classList.contains('is-intro-active')) {
        document.addEventListener('ralen:intro-complete', runReveal, { once: true });
      } else {
        runReveal();
      }
    }

    if (!finePointer || reducedMotion) return;

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

      hero.style.setProperty('--pointer-x', `${px * 100}%`);
      hero.style.setProperty('--pointer-y', `${py * 100}%`);

      if (image && window.gsap) {
        window.gsap.to(image, {
          x: (px - .5) * 16,
          y: (py - .5) * 12,
          duration: .8,
          overwrite: true,
          ease: 'power3.out'
        });
      }
    };

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  function initSplitReveals() {
    const targets = [...document.querySelectorAll('[data-ralen-split-reveal]')];
    if (!targets.length) return;

    targets.forEach((element) => {
      const words = splitWords(element);
      if (!words.length) return;

      if (reducedMotion || !window.gsap || !('IntersectionObserver' in window)) return;

      window.gsap.set(words, { yPercent: 110, opacity: 0 });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          window.gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: .78,
            stagger: .045,
            ease: 'power3.out'
          });

          observer.disconnect();
        });
      }, { threshold: .2, rootMargin: '0px 0px -10% 0px' });

      observer.observe(element);
    });
  }

  function initSystemCards() {
    if (!finePointer || reducedMotion) return;

    document.querySelectorAll('[data-ralen-system-card]').forEach((card) => {
      const arrow = card.querySelector('.ralen-system-card__arrow');
      if (!arrow) return;

      card.addEventListener('pointermove', (event) => {
        if (!window.gsap) return;
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
        window.gsap.to(arrow, { x, y, duration: .35, overwrite: true, ease: 'power2.out' });
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        if (!window.gsap) return;
        window.gsap.to(arrow, { x: 0, y: 0, duration: .45, overwrite: true, ease: 'power3.out' });
      });
    });
  }

  function initDepthPanel() {
    const panel = document.querySelector('[data-ralen-depth]');
    if (!panel || !finePointer || reducedMotion) return;

    panel.addEventListener('pointermove', (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;

      if (window.gsap) {
        window.gsap.to(panel, {
          rotateY: x * 1.5,
          rotateX: y * -1.25,
          transformPerspective: 1200,
          transformOrigin: 'center',
          duration: .7,
          overwrite: true,
          ease: 'power3.out'
        });
      }
    }, { passive: true });

    panel.addEventListener('pointerleave', () => {
      if (!window.gsap) return;
      window.gsap.to(panel, {
        rotateY: 0,
        rotateX: 0,
        duration: .8,
        overwrite: true,
        ease: 'power3.out'
      });
    });
  }

  function init() {
    document.documentElement.classList.add('ralen-phase-8');
    initHeaderState();
    initHeroMotion();
    initSplitReveals();
    initSystemCards();
    initDepthPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

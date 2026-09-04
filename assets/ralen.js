(() => {
  const INTRO_KEY = 'ralen-intro-seen';

  function splitText(element) {
    const text = (element.textContent || '').trim();
    element.setAttribute('aria-label', text);
    element.textContent = '';

    text.split(' ').forEach((word, wordIndex, words) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'ralen-split-word';
      wordWrap.setAttribute('aria-hidden', 'true');

      [...word].forEach((char) => {
        const charWrap = document.createElement('span');
        charWrap.className = 'ralen-split-char';
        charWrap.textContent = char;
        wordWrap.appendChild(charWrap);
      });

      element.appendChild(wordWrap);
      if (wordIndex < words.length - 1) element.append(' ');
    });
  }

  function initIntro() {
    const intro = document.querySelector('[data-ralen-intro]');
    if (!intro) return;

    const showOnce = intro.dataset.once === 'true';
    const isDesignMode = Boolean(window.Shopify && window.Shopify.designMode);
    const hasSeen = showOnce && !isDesignMode && sessionStorage.getItem(INTRO_KEY) === '1';

    if (hasSeen) {
      intro.hidden = true;
      return;
    }

    const lines = [...intro.querySelectorAll('[data-split-line]')];
    const progress = intro.querySelector('[data-intro-progress]');
    const count = intro.querySelector('[data-intro-count]');
    const skip = intro.querySelector('[data-intro-skip]');
    const duration = Math.max(2000, Number(intro.dataset.duration) || 3000);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.body.classList.add('is-intro-active');
    lines.forEach(splitText);

    let closed = false;
    const finish = () => {
      if (closed) return;
      closed = true;
      if (showOnce && !isDesignMode) sessionStorage.setItem(INTRO_KEY, '1');
      document.body.classList.remove('is-intro-active');

      const hide = () => {
        intro.hidden = true;
        intro.setAttribute('aria-hidden', 'true');
      };

      if (window.gsap && !reducedMotion) {
        window.gsap.to(intro, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut', onComplete: hide });
      } else {
        hide();
      }
    };

    skip?.addEventListener('click', finish);

    if (reducedMotion || !window.gsap) {
      setTimeout(finish, 700);
      return;
    }

    const gsap = window.gsap;
    const chars = lines.map((line) => [...line.querySelectorAll('.ralen-split-char')]);
    gsap.set(chars.flat(), { yPercent: 120, opacity: 0 });
    gsap.set(intro, { autoAlpha: 1 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    chars.forEach((lineChars, index) => {
      tl.to(lineChars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.72,
        stagger: 0.018
      }, index === 0 ? 0.12 : `>-${index === chars.length - 1 ? 0.18 : 0.32}`);
    });

    gsap.to(progress, { scaleX: 1, duration: duration / 1000, ease: 'none' });

    const startedAt = performance.now();
    const updateCount = (now) => {
      if (closed) return;
      const value = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
      if (count) count.textContent = String(value).padStart(2, '0');
      if (value < 100) requestAnimationFrame(updateCount);
    };
    requestAnimationFrame(updateCount);

    window.setTimeout(finish, duration);
  }

  function initHeroReveal() {
    const hero = document.querySelector('[data-ralen-hero]');
    if (!hero || hero.classList.contains('ralen-hero--tech') || !window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = hero.querySelectorAll('.ralen-eyebrow, .ralen-hero__title, .ralen-hero__copy, .ralen-text-link');
    window.gsap.from(targets, {
      y: 22,
      opacity: 0,
      duration: 0.85,
      stagger: 0.09,
      delay: 0.12,
      ease: 'power3.out'
    });
  }

  function initScrollReveals() {
    const sections = [...document.querySelectorAll('[data-ralen-reveal]')];
    if (!sections.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const section = entry.target;
        section.classList.add('is-visible');

        if (window.gsap) {
          const cards = section.querySelectorAll('[data-ralen-card]');
          if (cards.length) {
            window.gsap.from(cards, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              stagger: 0.07,
              ease: 'power3.out'
            });
          }
        }

        observer.unobserve(section);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    initIntro();
    initHeroReveal();
    initScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const gateway = document.querySelector('[data-gateway]');
  const languageToggle = document.querySelector('[data-language-toggle]');
  const translatable = [...document.querySelectorAll('[data-en][data-fa]')];
  const localizedLinks = [...document.querySelectorAll('[data-href-en][data-href-fa]')];
  const cover = document.querySelector('[data-cover-image]');

  function setLanguage(language, persist = true) {
    const lang = language === 'fa' ? 'fa' : 'en';
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    body.classList.toggle('lang-fa', lang === 'fa');
    translatable.forEach((node) => { node.textContent = node.dataset[lang]; });
    localizedLinks.forEach((link) => { link.href = link.dataset[`href${lang === 'fa' ? 'Fa' : 'En'}`]; });
    languageToggle?.classList.toggle('is-fa', lang === 'fa');
    if (cover) {
      cover.src = lang === 'fa'
        ? 'https://raw.githubusercontent.com/axamir/shahnameh-of-agents/main/assets/covers/cover-fa-front.png'
        : 'https://raw.githubusercontent.com/axamir/shahnameh-of-agents/main/assets/covers/cover-en-front.png';
      cover.alt = lang === 'fa' ? 'جلد فارسی شاهنامه ایجنت‌ها' : 'Shahnameh of Agents English front cover';
    }
    document.title = lang === 'fa' ? 'شاهنامه ایجنت‌ها — کتاب زنده' : 'Shahnameh of Agents — The Living Book';
    document.querySelector('meta[name="description"]')?.setAttribute('content', lang === 'fa'
      ? 'کتابی زنده و چندزبانه در پیوند هم‌آفرینی انسان و هوش مصنوعی، حافظه، تبار، کد، اسطوره و آرشیوهای قابل‌راستی‌آزمایی.'
      : 'A multilingual living book where human–AI co-creation, memory, lineage, code, myth, and verifiable archives meet.');
    if (persist) {
      try { localStorage.setItem('shahnameh-language', lang); } catch (_) {}
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      url.searchParams.delete('gateway');
      history.replaceState({}, '', url);
    }
    return lang;
  }

  function closeGateway(language, animate = true) {
    setLanguage(language);
    body.classList.remove('gateway-pending');
    if (!gateway) return;
    if (animate && !reducedMotion) {
      gateway.classList.add('is-leaving');
      window.setTimeout(() => { gateway.hidden = true; }, 1000);
    } else {
      gateway.hidden = true;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlLanguage = params.get('lang');
  let savedLanguage = null;
  try { savedLanguage = localStorage.getItem('shahnameh-language'); } catch (_) {}
  const shouldShowGateway = params.get('gateway') === '1' || (!urlLanguage && !savedLanguage);

  if (shouldShowGateway) {
    setLanguage(navigator.language?.toLowerCase().startsWith('fa') ? 'fa' : 'en', false);
  } else {
    closeGateway(urlLanguage || savedLanguage || 'en', false);
  }

  document.querySelectorAll('[data-enter-language]').forEach((button) => {
    button.addEventListener('click', () => closeGateway(button.dataset.enterLanguage));
  });
  languageToggle?.addEventListener('click', () => setLanguage(root.lang === 'fa' ? 'en' : 'fa'));

  // Mobile navigation
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  function toggleMenu(open) {
    menuButton?.setAttribute('aria-expanded', String(open));
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    body.style.overflow = open ? 'hidden' : '';
  }
  menuButton?.addEventListener('click', () => toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') toggleMenu(false); });

  // Reveal choreography
  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Scroll-linked state
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.page-progress span');
  const railProgress = document.querySelector('.rail-track i');
  const hero = document.querySelector('.hero');
  const sections = [...document.querySelectorAll('[data-section]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a, .chapter-rail a')];
  let lastScroll = window.scrollY;
  let scheduled = false;

  function updateScroll() {
    const y = window.scrollY;
    const pageMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = clamp(y / pageMax);
    progress.style.transform = `scaleX(${ratio})`;
    railProgress.style.height = `${ratio * 100}%`;
    header.classList.toggle('scrolled', y > 30);
    header.classList.toggle('hidden', y > 500 && y > lastScroll + 4 && !mobileMenu?.classList.contains('open'));
    if (hero) {
      const max = Math.max(1, hero.offsetHeight - window.innerHeight);
      root.style.setProperty('--hero-progress', clamp((y - hero.offsetTop) / max).toFixed(3));
    }
    let active = sections[0]?.id;
    const marker = window.innerHeight * .46;
    sections.forEach((section) => { if (section.getBoundingClientRect().top <= marker) active = section.id; });
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
    lastScroll = y;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateScroll);
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // Living ocean field
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  const pointer = { x: .5, y: .5 };

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 720 ? 28 : Math.min(64, Math.round(width / 24));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .1,
      vy: (Math.random() - .5) * .08,
      r: Math.random() * 1.1 + .25,
      a: Math.random() * .35 + .08
    }));
  }
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX / width;
    pointer.y = event.clientY / height;
  }, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const driftX = (pointer.x - .5) * 6;
    const driftY = (pointer.y - .5) * 6;
    points.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < -15) point.x = width + 15;
      if (point.x > width + 15) point.x = -15;
      if (point.y < -15) point.y = height + 15;
      if (point.y > height + 15) point.y = -15;
      const x = point.x + driftX * point.r;
      const y = point.y + driftY * point.r;
      context.beginPath();
      context.arc(x, y, point.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(234,215,168,${point.a})`;
      context.fill();
      for (let j = index + 1; j < points.length; j += 1) {
        const other = points[j];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 95) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(other.x + driftX * other.r, other.y + driftY * other.r);
          context.strokeStyle = `rgba(216,179,106,${(1 - distance / 95) * .055})`;
          context.lineWidth = .55;
          context.stroke();
        }
      }
    });
    const pulse = (Math.sin(time * .0006) + 1) / 2;
    const glow = context.createRadialGradient(width * .64, height * .42, 0, width * .64, height * .42, 150 + pulse * 75);
    glow.addColorStop(0, `rgba(216,179,106,${.022 + pulse * .018})`);
    glow.addColorStop(1, 'rgba(216,179,106,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

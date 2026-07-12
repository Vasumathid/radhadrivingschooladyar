// Radha Driving School — shared interactions
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.nav-backdrop');
  const closeMenu = () => {
    if (!links) return;
    links.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
    if (toggle) { toggle.textContent = '☰'; toggle.setAttribute('aria-expanded', 'false'); }
  };
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      backdrop && backdrop.classList.toggle('open', open);
      toggle.textContent = open ? '✕' : '☰';
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    backdrop && backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Scroll progress bar (road-line)
  const bar = document.querySelector('.road-progress-bar');
  const updateProgress = () => {
    if (!bar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1);
    bar.style.width = Math.min(scrolled * 100, 100) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Hero road path draw-in
  const roadPath = document.querySelector('.road-path');
  if (roadPath) {
    requestAnimationFrame(() => {
      setTimeout(() => roadPath.classList.add('drawn'), 150);
    });
  }

  // Animated stat counters
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.count.includes('.');
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countIO.observe(el));

});

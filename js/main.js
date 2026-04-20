/* BSTrauma Clinic Solutions — main.js v3 */

/* ---- Navbar scroll + active link ---- */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
navMenu.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => navMenu.classList.remove('open'))
);

/* ---- Scroll animations ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

/* ---- Auto-tag animated elements on load ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* Hero entrance */
  setTimeout(() => {
    document.querySelectorAll('.hero-animate').forEach(el => el.classList.add('active'));
  }, 80);

  /* Tag animated elements */
  const selectors = [
    { sel: '.statsbar__item',  delay: true },
    { sel: '.spec-card',       delay: true },
    { sel: '.prod-card',       delay: true },
    { sel: '.why-card',        delay: true },
    { sel: '.gallery__item',   delay: true },
    { sel: '.contact-card',    delay: true },
    { sel: '.section-header',  delay: false },
    { sel: '.about__content',  delay: false },
    { sel: '.contact__left',   delay: false },
    { sel: '.contact__right',  delay: false },
  ];

  selectors.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-anim', '');
      if (delay) el.setAttribute('data-delay', String(Math.min(i + 1, 6)));
      io.observe(el);
    });
  });

  /* ---- Counter animation for stats ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        counterIO.unobserve(e.target);
        animateCount(e.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterIO.observe(el));
  }
});

function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const isFloat  = String(el.dataset.count).includes('.');
  const decimals = isFloat ? (String(el.dataset.count).split('.')[1] || '').length : 0;
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value    = eased * target;
    el.textContent = prefix + (isFloat ? value.toFixed(decimals) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isFloat ? target.toFixed(decimals) : target) + suffix;
  }
  requestAnimationFrame(step);
}

/* ---- Contact form ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn   = form.querySelector('button[type=submit]');
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const spec  = form.specialty.value;

    if (!name || !email || !phone || !spec) {
      showMsg('Por favor completa todos los campos obligatorios.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Ingresa un correo electrónico válido.', 'error'); return;
    }

    const orig = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Replace with Formspree endpoint or EmailJS
    setTimeout(() => {
      showMsg('¡Gracias! Tu solicitud fue enviada. Te contactaremos muy pronto.', 'success');
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 1200);
  });
}

function showMsg(text, type) {
  document.getElementById('form-msg')?.remove();
  const el = document.createElement('div');
  el.id = 'form-msg';
  el.textContent = text;
  Object.assign(el.style, {
    padding: '14px 18px', borderRadius: '10px',
    marginBottom: '18px', fontSize: '.9rem', fontWeight: '500',
    background: type === 'success' ? '#dcfce7' : '#fee2e2',
    color:      type === 'success' ? '#166534' : '#991b1b',
    border:     type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
  });
  form.insertBefore(el, form.firstChild);
  setTimeout(() => el.remove(), 6000);
}

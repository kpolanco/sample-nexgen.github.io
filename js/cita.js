/* BSTrauma — cita.js */

/* ---- Hero entrance ---- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-animate').forEach(el => el.classList.add('active'));
  }, 80);

  /* ---- Scroll animations ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

  /* ---- Min date = today ---- */
  const today = new Date().toISOString().split('T')[0];
  ['cita-date', 'alt-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });

  /* ---- Show/hide virtual platform selector ---- */
  document.querySelectorAll('input[name="modality"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const pg = document.getElementById('platform-group');
      if (!pg) return;
      pg.style.display = radio.value === 'virtual' ? 'block' : 'none';
    });
  });

  /* ---- Form submit ---- */
  const form = document.getElementById('citaForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name   = document.getElementById('cita-name').value.trim();
    const phone  = document.getElementById('cita-phone').value.trim();
    const email  = document.getElementById('cita-email').value.trim();
    const role   = document.getElementById('cita-role').value;
    const topic  = document.getElementById('cita-topic').value;
    const date   = document.getElementById('cita-date').value;
    const time   = document.getElementById('cita-time').value;

    if (!name || !phone || !email || !role || !topic || !date || !time) {
      showCitaMsg('Por favor completa todos los campos obligatorios.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showCitaMsg('Ingresa un correo electrónico válido.', 'error'); return;
    }

    const btn = document.getElementById('citaSubmitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Enviando solicitud...';
    btn.disabled = true;

    // Replace with Formspree endpoint or EmailJS
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      form.reset();
      document.getElementById('platform-group').style.display = 'none';
      const overlay = document.getElementById('citaSuccess');
      if (overlay) {
        overlay.classList.add('show');
        overlay.removeAttribute('aria-hidden');
      }
    }, 1200);
  });

  /* ---- Close success overlay on background click ---- */
  document.getElementById('citaSuccess')?.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
      this.setAttribute('aria-hidden', 'true');
    }
  });
});

function showCitaMsg(text, type) {
  document.getElementById('cita-msg')?.remove();
  const el = document.createElement('div');
  el.id = 'cita-msg';
  el.textContent = text;
  Object.assign(el.style, {
    padding: '14px 18px', borderRadius: '10px',
    marginBottom: '18px', fontSize: '.9rem', fontWeight: '500',
    background: type === 'success' ? '#dcfce7' : '#fee2e2',
    color:      type === 'success' ? '#166534' : '#991b1b',
    border:     type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
  });
  const form = document.getElementById('citaForm');
  form.insertBefore(el, form.firstChild);
  setTimeout(() => el.remove(), 6000);
}

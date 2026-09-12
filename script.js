/* ═══════════════════════════════════════════════════════════════
   VIFIT — script.js
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   CONFIGURACIÓN GLOBAL
   Cambiar a false cuando no se acepten nuevos clientes
═══════════════════════════════════════════════════════════════ */
const VIFIT_ACCEPTING_NEW_ATHLETES = true;

/* ─── Status badge (estado de plazas) ───────────────────────── */
(() => {
  const badge = document.querySelector('.status-badge');
  if (!badge) return;
  if (VIFIT_ACCEPTING_NEW_ATHLETES) return;

  badge.classList.add('status-badge--closed');
  badge.querySelector('.status-text').textContent = 'Plazas completas · Lista de espera';
  badge.setAttribute('href', 'mailto:vicentesanz.coach@gmail.com?subject=Lista%20de%20espera%20VIFIT');
})();

/* ─── Smooth scroll for anchor links ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });

    // Close mobile menu if open
    closeMenu();
  });
});

/* ─── Nav: scrolled state ────────────────────────────────────── */
const nav = document.getElementById('nav');

function onScroll() {
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── Mobile burger menu ─────────────────────────────────────── */
const burger  = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
  burger.classList.remove('is-open');
  navMenu.classList.remove('is-open');
  nav.classList.remove('nav--menu-open');
  burger.setAttribute('aria-label', 'Abrir menú');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  nav.classList.toggle('nav--menu-open', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Si se pasa a escritorio con el menú abierto, restaurar el estado normal
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) closeMenu();
});

/* ─── FAQ Accordion ──────────────────────────────────────────── */
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen    = btn.getAttribute('aria-expanded') === 'true';
    const answer    = btn.nextElementSibling;
    const allBtns   = document.querySelectorAll('.faq__q');
    const allAns    = document.querySelectorAll('.faq__a');

    // Close all
    allBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    allAns.forEach(a => { a.style.maxHeight = '0'; });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ─── Reveal on scroll (Intersection Observer) ───────────────── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Lightbox ───────────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox.classList.contains('is-open')) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Clear src after the exit transition to free memory
  setTimeout(() => {
    if (!lightbox.classList.contains('is-open')) lightboxImg.src = '';
  }, 350);
}

document.querySelectorAll('.espacio__img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

lightboxClose.addEventListener('click', closeLightbox);

// Close when clicking the dim backdrop (but not the image itself)
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Close with Escape (lightbox y menú móvil)
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeLightbox();
  if (navMenu.classList.contains('is-open')) closeMenu();
});

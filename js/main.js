import { translations } from './i18n.js';

const CONTACT_EMAIL = 'souhabre@gmail.com';
// Service d'envoi du formulaire (site statique). Voir README : activation au 1er envoi.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const MAP_SRC = 'https://maps.google.com/maps?q=Route%20de%20Chancy%2059C%2C%201213%20Petit-Lancy%2C%20Suisse&z=16&output=embed';

const root = document.documentElement;
root.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const smallScreen = window.matchMedia('(max-width: 899px)');

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* ignoré */ } }
};

document.getElementById('year').textContent = new Date().getFullYear();

/* ------------------------------------------------------------------ i18n */

const LANGS = ['fr', 'en', 'ar'];
const source = { 'meta.title': document.title, 'meta.description': document.querySelector('meta[name="description"]').content };
const textNodes = [...document.querySelectorAll('[data-i18n]')];
const attrNodes = [...document.querySelectorAll('[data-i18n-attr]')].map((el) => ({
  el,
  pairs: el.dataset.i18nAttr.split(';').map((p) => {
    const [attr, key] = p.split(':');
    source[key] ??= el.getAttribute(attr);
    return { attr, key };
  })
}));
textNodes.forEach((el) => { source[el.dataset.i18n] ??= el.innerHTML; });

let currentLang = 'fr';

function t(key) {
  return translations[currentLang]?.[key] ?? translations.fr[key] ?? source[key] ?? key;
}

function setLang(lang) {
  if (!LANGS.includes(lang)) lang = 'fr';
  currentLang = lang;
  const dict = lang === 'fr' ? {} : translations[lang];
  const pick = (key) => dict[key] ?? source[key];

  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = pick('meta.title');
  document.querySelector('meta[name="description"]').content = pick('meta.description');

  textNodes.forEach((el) => { el.innerHTML = pick(el.dataset.i18n); });
  attrNodes.forEach(({ el, pairs }) => pairs.forEach(({ attr, key }) => el.setAttribute(attr, pick(key))));

  document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  const frame = document.querySelector('#map iframe');
  if (frame) frame.title = t('map.title');

  storage.set('lang', lang);
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

const urlLang = new URLSearchParams(location.search).get('lang');
const initialLang = urlLang || storage.get('lang');
if (initialLang && initialLang !== 'fr') setLang(initialLang);

/* ------------------------------------------------------------ navigation */

const header = document.querySelector('.site-header');
const nav = document.getElementById('site-nav');
const toggle = document.querySelector('.nav-toggle');

function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  if (open) nav.querySelector('a')?.focus();
});
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
});

const navLinks = new Map([...nav.querySelectorAll('ul a')].map((a) => [a.hash.slice(1), a]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.removeAttribute('aria-current'));
    navLinks.get(entry.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

/* ------------------------------------------------ apparitions & timeline */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 5) * 0.08}s`);
  revealObserver.observe(el);
});

const timeline = document.querySelector('.timeline');
let ticking = false;
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
  const rect = timeline.getBoundingClientRect();
  const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
  timeline.style.setProperty('--progress', Math.max(0, Math.min(1, progress)).toFixed(3));
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

/* ------------------------------------------------- cartes (effet tilt) */

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    if (!finePointer.matches || reduceMotion.matches) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.classList.add('is-tilting');
    card.style.setProperty('--ry', `${(px - 0.5) * 8}deg`);
    card.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
  });
  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-tilting');
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
  });
});

/* ------------------------------------------------- carte (consentement) */

document.getElementById('map-load').addEventListener('click', () => {
  const map = document.getElementById('map');
  const iframe = document.createElement('iframe');
  iframe.src = MAP_SRC;
  iframe.title = t('map.title');
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  map.replaceChildren(iframe);
  iframe.focus();
});

/* ---------------------------------------------------------- formulaire */

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function setStatus(html, type) {
  status.innerHTML = html;
  status.className = `form-status${type ? ` is-${type}` : ''}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  let firstInvalid = null;
  fields.forEach((f) => {
    const valid = f.value.trim() !== '' && f.checkValidity();
    f.setAttribute('aria-invalid', String(!valid));
    if (!valid && !firstInvalid) firstInvalid = f;
  });
  if (firstInvalid) {
    setStatus(t('form.invalid'), 'error');
    firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  if (data._honey) return; // robot
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Contact – site web')}&body=${encodeURIComponent(`${data.message}\n\n${data.name} <${data.email}>`)}`;

  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  setStatus(t('form.sending'));

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _replyto: data.email,
        _subject: `Nouveau message du site – ${data.name}`,
        _template: 'table',
        _captcha: 'false'
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || res.statusText);
    form.reset();
    fields.forEach((f) => f.removeAttribute('aria-invalid'));
    setStatus(t('form.success'), 'success');
  } catch (err) {
    console.warn('Envoi du formulaire impossible :', err);
    setStatus(t('form.error').replace('{mailto}', mailto), 'error');
  } finally {
    button.disabled = false;
  }
});

form.addEventListener('input', (e) => {
  if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity() && e.target.value.trim()) {
    e.target.setAttribute('aria-invalid', 'false');
  }
});

/* ----------------------------------------------------- mentions légales */

const legal = document.getElementById('legal');
document.getElementById('legal-open').addEventListener('click', () => legal.showModal());
legal.addEventListener('click', (e) => { if (e.target === legal) legal.close(); });

/* ------------------------------------------------------------- scène 3D */

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

let scene = null;
let loading = false;

function useFallback() {
  scene?.destroy();
  scene = null;
  root.classList.remove('has-3d');
  root.classList.add('no-3d');
}

async function startScene() {
  if (reduceMotion.matches || smallScreen.matches || !webglAvailable()) return useFallback();
  if (scene || loading) return;
  loading = true;
  root.classList.remove('no-3d');
  root.classList.add('has-3d');
  try {
    const { createScene } = await import('./scene.js');
    if (reduceMotion.matches || smallScreen.matches) return useFallback();
    scene = createScene(document.getElementById('scene'), {
      sections: [...document.querySelectorAll('[data-scene]')],
      isRTL: () => root.dir === 'rtl',
      onError: useFallback
    });
  } catch (err) {
    console.warn('Scène 3D indisponible, affichage statique :', err);
    useFallback();
  } finally {
    loading = false;
  }
}

startScene();
reduceMotion.addEventListener('change', startScene);
smallScreen.addEventListener('change', () => (smallScreen.matches ? useFallback() : startScene()));

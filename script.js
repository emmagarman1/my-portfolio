// ── Fade-in on scroll ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ── Nav active link highlight (single-page scroll) ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if (sections.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.classList.toggle('active', href === `#${current}`);
      }
    });
  });
}

// ── Lightbox ──
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbTitle  = document.getElementById('lbTitle');
const lbMeta   = document.getElementById('lbMeta');
const lbDesc   = document.getElementById('lbDesc');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
const lbDots   = document.getElementById('lbDots');

let lbImages = [];
let lbCurrentIndex = 0;

function showSlide(i) {
  if (!lbImages.length) return;
  lbCurrentIndex = ((i % lbImages.length) + lbImages.length) % lbImages.length;
  lbImg.src = lbImages[lbCurrentIndex];
  if (lbDots) {
    lbDots.querySelectorAll('.lb-dot').forEach((d, j) =>
      d.classList.toggle('active', j === lbCurrentIndex)
    );
  }
}

function openLightbox(card) {
  const main    = card.dataset.img;
  const gallery = card.dataset.gallery ? card.dataset.gallery.split(',').map(s => s.trim()) : [];
  lbImages = [main, ...gallery];
  lbCurrentIndex = 0;

  lbImg.src           = lbImages[0];
  lbImg.alt           = card.dataset.title;
  lbTitle.textContent = card.dataset.title;
  lbMeta.textContent  = card.dataset.meta;

  const rawDesc = card.dataset.desc || '';
  lbDesc.innerHTML = rawDesc
    ? rawDesc.split(/\n\n+/).map(p => '<p>' + p.trim().replace(/\n/g, '<br>') + '</p>').join('')
    : '';

  if (lbDots) {
    lbDots.innerHTML = '';
    if (lbImages.length > 1) {
      lbImages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => showSlide(i));
        lbDots.appendChild(dot);
      });
    }
  }

  const hasMultiple = lbImages.length > 1;
  if (lbPrev) lbPrev.style.display = hasMultiple ? '' : 'none';
  if (lbNext) lbNext.style.display = hasMultiple ? '' : 'none';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}

document.querySelectorAll('.work-card').forEach((card) => {
  const imgWrap = card.querySelector('.work-card-img');
  if (imgWrap && card.dataset.title) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    const t = document.createElement('span');
    t.className = 'card-overlay-title';
    t.textContent = card.dataset.title;
    const m = document.createElement('span');
    m.className = 'card-overlay-meta';
    m.textContent = card.dataset.meta || '';
    overlay.appendChild(t);
    overlay.appendChild(m);
    imgWrap.appendChild(overlay);
  }
});

function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 220);
}

document.querySelectorAll('.work-card, .featured-card').forEach((card) => {
  if (card.dataset.img) {
    card.addEventListener('click', () => {
      const slug = card.dataset.img.replace(/^images\//, '').replace(/\.[^.]+$/, '');
      const currentPage = (window.location.pathname.split('/').pop() || 'index.html') + window.location.hash;
      navigateTo('artwork.html?work=' + slug + '&from=' + encodeURIComponent(currentPage));
    });
  }
});

if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showSlide(lbCurrentIndex - 1); });
if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); showSlide(lbCurrentIndex + 1); });

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'ArrowLeft')  showSlide(lbCurrentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(lbCurrentIndex + 1);
  }
});

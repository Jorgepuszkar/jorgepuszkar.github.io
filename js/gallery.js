/* ── Gallery + Lightbox ── */

(function () {
  const overlay  = document.getElementById('gallery-overlay');
  const closeBtn = document.getElementById('gallery-close');
  const grid     = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbLoc    = document.getElementById('lb-location');
  const lbDate   = document.getElementById('lb-date');
  const lbText   = document.getElementById('lb-text');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');

  let currentIndex = 0;

  // ── Build gallery grid ──
  function buildGrid() {
    grid.innerHTML = '';
    GALLERY.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <img src="${photo.thumb}" alt="${photo.caption}" loading="lazy" />
        <div class="gallery-card-overlay">
          <div class="gallery-card-loc">📍 ${photo.location}</div>
          <div class="gallery-card-date">${photo.date}</div>
        </div>`;
      card.addEventListener('click', () => openLightbox(i));
      grid.appendChild(card);
    });
  }

  // ── Lightbox ──
  function openLightbox(index) {
    currentIndex = index;
    showPhoto(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function showPhoto(index) {
    const p = GALLERY[index];
    lbImg.src      = p.src;
    lbImg.alt      = p.caption;
    lbLoc.textContent  = '📍 ' + p.location;
    lbDate.textContent = p.date;
    lbText.textContent = p.caption;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + GALLERY.length) % GALLERY.length;
    showPhoto(currentIndex);
  }
  function next() {
    currentIndex = (currentIndex + 1) % GALLERY.length;
    showPhoto(currentIndex);
  }

  // ── Gallery open/close ──
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  });

  // ── Lightbox controls ──
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Also close gallery overlay on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open') && !lightbox.classList.contains('open')) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });

  // Boot
  document.addEventListener('DOMContentLoaded', buildGrid);
})();

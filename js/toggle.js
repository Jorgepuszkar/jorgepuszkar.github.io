/* ── View toggle: Map Mode ↔ Classic Mode ── */

(function () {
  let isClassic = false;

  function closeGallery() {
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  function getEls() {
    return {
      btn:         document.getElementById('view-toggle'),
      badge:       document.getElementById('mode-badge'),
      classicView: document.getElementById('classic-view'),
    };
  }

  function toClassic() {
    isClassic = true;
    closeGallery();
    const { btn, badge, classicView } = getEls();
    document.body.classList.add('classic-mode');
    classicView.setAttribute('aria-hidden', 'false');
    badge.textContent = 'CLASSIC MODE';
    btn.querySelector('.toggle-icon').textContent  = '🌍';
    btn.querySelector('.toggle-label').textContent = 'Map View';
    if (window.mapAPI) window.mapAPI.closeSidePanel();
    classicView.scrollTop = 0;
  }

  function toMap() {
    isClassic = false;
    closeGallery();
    const { btn, badge, classicView } = getEls();
    document.body.classList.remove('classic-mode');
    classicView.setAttribute('aria-hidden', 'true');
    badge.textContent = 'MAP MODE';
    btn.querySelector('.toggle-icon').textContent  = '📋';
    btn.querySelector('.toggle-label').textContent = 'Classic View';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { btn } = getEls();
    btn.addEventListener('click', () => {
      if (isClassic) toMap(); else toClassic();
    });

    // Gallery button (must be inside DOMContentLoaded)
    const galleryBtn = document.getElementById('nav-gallery-btn');
    if (galleryBtn) {
      galleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = document.getElementById('gallery-overlay');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
      });
    }
  });
})();

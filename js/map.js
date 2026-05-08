/* ── Leaflet map initialisation & marker interactions ── */

(function () {
  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const TILE_OPTS = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  };

  // Centred so both Mexico City and Israel are comfortably in view
  const MAP_CENTER = [28, -32];
  const MAP_ZOOM   = 3;

  let map, activeMarkerId = null;

  function init() {
    map = L.map('map', {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      attributionControl: true,
      minZoom: 2,
    });

    L.tileLayer(TILE_URL, TILE_OPTS).addTo(map);

    // Move zoom control to bottom-left (away from toggle button)
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Render all pins and collect latlngs for fitBounds
    const latlngs = [];
    PINS.forEach((pin, i) => {
      addMarker(pin, i);
      latlngs.push([pin.lat, pin.lng]);
    });

    // Auto-fit the view so every pin is comfortably visible
    if (latlngs.length) {
      map.fitBounds(L.latLngBounds(latlngs).pad(0.25));
    }

    // Click on map background → close panel
    map.on('click', closeSidePanel);

    // Dismiss intro on first map interaction
    const intro = document.getElementById('map-intro');
    map.once('click', () => intro.classList.add('hidden'));
    map.once('movestart', () => intro.classList.add('hidden'));
  }

  function addMarker(pin, index) {
    const color = pin.color || '#39d353';

    const iconHtml = `
      <div class="map-pin" style="--pin-color:${color}" data-id="${pin.id}">
        <div class="pin-pulse"></div>
        <div class="pin-pulse"></div>
        <div class="pin-photo">
          <img src="${pin.thumb}" alt="${pin.role}" loading="lazy" />
        </div>
        <div class="pin-tip">${pin.org}</div>
      </div>`;

    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [60, 60],
      iconAnchor: [30, 30],
      popupAnchor: [0, -34],
    });

    const marker = L.marker([pin.lat, pin.lng], { icon })
      .addTo(map)
      .on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        openSidePanel(pin);
      });

    // Stagger entrance animation
    const el = marker.getElement();
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = `opacity 0.5s ${index * 80}ms ease, transform 0.5s ${index * 80}ms ease`;
      requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }
  }

  function openSidePanel(pin) {
    const panel = document.getElementById('side-panel');
    document.getElementById('panel-photo').src = pin.photo;
    document.getElementById('panel-photo').alt = pin.role;
    document.getElementById('panel-location').textContent = pin.location;
    document.getElementById('panel-year').textContent = pin.year;
    document.getElementById('panel-role').textContent = pin.role;
    document.getElementById('panel-org').textContent = pin.org;
    document.getElementById('panel-desc').textContent = pin.description;

    const detailsEl = document.getElementById('panel-details');
    detailsEl.innerHTML = (pin.details || []).map(d =>
      `<div class="panel-detail-item">
        <div class="panel-detail-label">${d.label}</div>
        <div class="panel-detail-text">${d.text}</div>
      </div>`
    ).join('');

    const skillsEl = document.getElementById('panel-skills');
    skillsEl.innerHTML = pin.skills.map(s => `<span class="pill">${s}</span>`).join('');

    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    activeMarkerId = pin.id;
  }

  function closeSidePanel() {
    const panel = document.getElementById('side-panel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    activeMarkerId = null;
  }

  document.getElementById('panel-close').addEventListener('click', closeSidePanel);

  // Expose for toggle.js and debugging
  window.mapAPI = { init, closeSidePanel, getMap: () => map };

  // Boot
  document.addEventListener('DOMContentLoaded', init);
})();

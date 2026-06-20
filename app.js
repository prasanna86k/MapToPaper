
// =========================
// LEAFLET INIT
// =========================

const map = L.map("map", {
  zoomControl: true
}).setView([20, 0], 2);

// =========================
// TILE STYLE LIBRARY
// =========================

const styles = {
  osm: {
    name: "OpenStreetMap",
    layer: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    })
  },

  carto_light: {
    name: "Light Minimal",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution: "&copy; CARTO"
    })
  },

  carto_dark: {
    name: "Dark Mode",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      attribution: "&copy; CARTO"
    })
  },

  voyager: {
    name: "Voyager",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
      attribution: "&copy; CARTO Voyager"
    })
  },

  positron: {
    name: "Positron Clean",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      attribution: "&copy; CARTO"
    })
  },

  topo: {
    name: "Topographic",
    layer: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenTopoMap"
    })
  },

  terrain: {
    name: "Terrain Classic",
    layer: L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
      attribution: "&copy; Stamen"
    })
  },

  satellite: {
    name: "Satellite",
    layer: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "&copy; Esri"
    })
  }
};

// =========================
// ACTIVE LAYER
// =========================

let activeLayer = styles.carto_light.layer.addTo(map);

// =========================
// SAFE REFRESH
// =========================

function refreshMap() {
  setTimeout(() => map.invalidateSize(), 200);
}

// =========================
// STYLE SWITCH
// =========================

function setStyle(key) {
  if (!styles[key]) return;

  if (activeLayer) map.removeLayer(activeLayer);

  activeLayer = styles[key].layer;
  activeLayer.addTo(map);

  refreshMap();
}

// =========================
// THEME DROPDOWN
// =========================

const themeSelect = document.getElementById("themeSelect");

Object.keys(styles).forEach(key => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.innerText = styles[key].name;
  themeSelect.appendChild(opt);
});

themeSelect.value = "carto_light";

themeSelect.onchange = () => {
  setStyle(themeSelect.value);
};

// =========================
// SEARCH
// =========================

document.getElementById("searchBox").addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const q = e.target.value.trim();
  if (!q) return;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
  );

  const data = await res.json();
  if (!data.length) return;

  map.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 12);
});

// =========================
// MARKER SYSTEM
// =========================

let marker = null;

document.getElementById("addMarker").onclick = () => {
  const c = map.getCenter();

  if (marker) map.removeLayer(marker);

  marker = L.marker([c.lat, c.lng]).addTo(map);

  refreshMap();
};

// =========================
// POSTER TEXT
// =========================

const titleInput = document.getElementById("titleText");
const subtitleInput = document.getElementById("subtitleText");

const titleEl = document.getElementById("posterTitle");
const subtitleEl = document.getElementById("posterSubtitle");

titleEl.innerText = "My Place";
subtitleEl.innerText = "Coordinates or memory";

titleInput.oninput = () => {
  titleEl.innerText = titleInput.value;
};

subtitleInput.oninput = () => {
  subtitleEl.innerText = subtitleInput.value;
};

// =========================
// LABEL TOGGLE (SAFE FIX)
// =========================

const labelToggle = document.getElementById("labelToggle");

labelToggle.onchange = () => {
  // SAFE fallback (no crash even if ignored)
  if (labelToggle.checked) {
    map.addLayer(activeLayer);
  } else {
    map.removeLayer(activeLayer);
  }
  refreshMap();
};

// =========================
// PAPER + ORIENTATION
// =========================

const paperSizeSelect = document.getElementById("paperSize");
const orientationSelect = document.getElementById("orientation");

const paperSizes = {
  A4: { w: 210, h: 297, scale: 2 },
  A3: { w: 297, h: 420, scale: 2.5 },
  A2: { w: 420, h: 594, scale: 3 }
};

let currentPaper = "A4";
let currentOrientation = "portrait";

paperSizeSelect.addEventListener("change", () => {
  currentPaper = paperSizeSelect.value;
  updatePreviewFrame();
});

orientationSelect.addEventListener("change", () => {
  currentOrientation = orientationSelect.value;
  updatePreviewFrame();
});

// =========================
// LIVE PREVIEW ENGINE
// =========================

function updatePreviewFrame() {
  const frame = document.getElementById("mapWrap");
  if (!frame) return;

  frame.classList.remove("A4", "A3", "A2", "portrait", "landscape");

  frame.classList.add(currentPaper);
  frame.classList.add(currentOrientation);

  refreshMap();
}

// =========================
// SAFE INIT
// =========================

setTimeout(() => {
  map.invalidateSize();
  updatePreviewFrame();
}, 500);
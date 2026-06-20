mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [0, 20],
  zoom: 2
});

// ---------------------
// THEMES
// ---------------------
import themes from "./themes/themes.js";

const themeSelect = document.getElementById("themeSelect");

Object.keys(themes).forEach(t => {
  const opt = document.createElement("option");
  opt.value = t;
  opt.innerText = t;
  themeSelect.appendChild(opt);
});

themeSelect.onchange = () => {
  map.setStyle(themes[themeSelect.value]);
};

// ---------------------
// SEARCH LOCATION
// ---------------------
document.getElementById("searchBox").addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const query = e.target.value;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
    );

    const data = await res.json();
    const loc = data.features[0];

    map.flyTo({
      center: loc.center,
      zoom: 12
    });
  }
});

// ---------------------
// MARKERS
// ---------------------
document.getElementById("addMarker").onclick = () => {
  new mapboxgl.Marker({ color: "#ff0000" })
    .setLngLat(map.getCenter())
    .addTo(map);
};

// ---------------------
// POSTER TEXT
// ---------------------
const title = document.getElementById("titleText");
const subtitle = document.getElementById("subtitleText");

title.oninput = () => {
  document.getElementById("posterTitle").innerText = title.value;
};

subtitle.oninput = () => {
  document.getElementById("posterSubtitle").innerText = subtitle.value;
};
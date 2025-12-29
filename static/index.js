/* <---------------- MAP ----------------> */
const map = L.map("map").setView([22.5, 78.9], 5);

/* <---------------- PANES ----------------> */
map.createPane("areasPane");
map.getPane("areasPane").style.zIndex = 400;

map.createPane("citiesPane");
map.getPane("citiesPane").style.zIndex = 650;

/* <---------------- TILE ----------------> */
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

/* <---------------- LEGEND ----------------> */
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend-card");
  div.innerHTML = `
    <h4>Risk Levels</h4>
    <div><span class="low"></span> Low Risk</div>
    <div><span class="moderate"></span> Moderate Risk</div>
    <div><span class="high"></span> High Risk</div>
    <div><span class="very-high"></span> Very High Risk</div>
  `;
  return div;
};

legend.addTo(map);

/* <---------------- LAYERS ----------------> */
let pointLayer = L.layerGroup([], { pane: "citiesPane" }).addTo(map);
let stateLayer = null;
let utLayer = null;

/* <---------------- HELPERS ----------------> */
function riskColor(cat) {
  if (cat === "Very High Risk") return "#dc2626";
  if (cat === "High Risk") return "#f97316";
  if (cat === "Moderate Risk") return "#facc15";
  return "#16a34a";
}

function getCityColor(cat) {
  if (cat === "Very High Risk") return "#991b1b";
  if (cat === "High Risk") return "#ea580c";
  if (cat === "Moderate Risk") return "#eab308";
  return "#16a34a";
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/nicoabr/g, "nicobar")
    .replace(/uttaranchal/g, "uttarakhand")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/* <---------------- SIDEBAR ----------------> */
function openPanel(title, html) {
  document.querySelector("#info-title .title-text").innerText = title;
  document.getElementById("info-content").innerHTML = html;
  document.getElementById("info-panel").classList.remove("hidden");
}


function closePanel() {
  document.getElementById("info-panel").classList.add("hidden");
}

/* <---------------- CLEAR ----------------> */
function clearLayers() {
  pointLayer.clearLayers();

  if (stateLayer) {
    map.removeLayer(stateLayer);
    stateLayer = null;
  }

  if (utLayer) {
    map.removeLayer(utLayer);
    utLayer = null;
  }
}

/* <---------------- CITY MARKERS ----------------> */
function loadCities() {
  if (stateLayer) map.removeLayer(stateLayer);
  if (utLayer) map.removeLayer(utLayer);

  stateLayer = null;
  utLayer = null;
  pointLayer.clearLayers();

  fetch("/api/locations?type=City")
    .then(r => r.json())
    .then(data => {
      data.forEach(d => {
        if (!d.latitude || !d.longitude) return;

        const radius = Math.min(Math.max(d.severity_score / 200, 6), 18);

        const marker = L.circleMarker(
          [d.latitude, d.longitude],
          {
            pane: "citiesPane",
            radius,
            color: getCityColor(d.risk_category),
            fillColor: getCityColor(d.risk_category),
            fillOpacity: 0.8,
            weight: 1
          }
        ).addTo(pointLayer);

        // CITY → SIDEBAR
        marker.on("click", () => {
          openPanel(
            titleCase(d["State/UT/City"]),
            `
              <p><b>Accidents:</b> ${d["Total Traffic Accidents - Cases"]}</p>
              <p><b>Injured:</b> ${d["Total Traffic Accidents - Injured"]}</p>
              <p><b>Deaths:</b> ${d["Total Traffic Accidents - Died"]}</p>
              <p><b>Risk:</b> ${d.risk_category}</p>
              <p><b>Risk Score:</b> ${(d.risk_score).toFixed(2)}</p>
            `
          );
        });
      });

    });
}

/* <---------------- AREA LOADER ----------------> */
function loadAreas(type) {
  Promise.all([
    fetch(`/api/locations?type=${type}`).then(r => r.json()),
    fetch("/static/india_state_geo.json").then(r => r.json())
  ]).then(([csv, geo]) => {

    const mapData = {};
    csv.forEach(s => {
      mapData[normalizeName(s["State/UT/City"])] = s;
    });

    const layer = L.geoJSON(geo, {
      pane: "areasPane",
      filter: f => mapData[normalizeName(f.properties.NAME_1)],
      style: f => {
        const d = mapData[normalizeName(f.properties.NAME_1)];
        return {
          fillColor: riskColor(d.risk_category),
          color: "#333",
          weight: 1,
          fillOpacity: 0.7
        };
      },
      onEachFeature: (f, l) => {
        const d = mapData[normalizeName(f.properties.NAME_1)];

        // STATE / UT → SIDEBAR
        l.on("click", () => {
          openPanel(
            titleCase(f.properties.NAME_1),
            `
              <p><b>Accidents:</b> ${d["Total Traffic Accidents - Cases"]}</p>
              <p><b>Injured:</b> ${d["Total Traffic Accidents - Injured"]}</p>
              <p><b>Deaths:</b> ${d["Total Traffic Accidents - Died"]}</p>
              <p><b>Risk:</b> ${d.risk_category}</p>
              <p><b>Risk Score:</b> ${(d.risk_score).toFixed(2)}</p>
            `
          );
        });
      }
    }).addTo(map);

    if (type === "State") stateLayer = layer;
    if (type === "UT") utLayer = layer;

  });
}

/* <---------------- BUTTON ACTIONS ----------------> */
function loadStates() {
  clearLayers();
  loadAreas("State");
}

function loadUTs() {
  clearLayers();
  loadAreas("UT");
}

function loadAll() {
  clearLayers();
  loadAreas("State");
  loadAreas("UT");
  loadCities();
}



/* <---------------- DEFAULT ----------------> */
loadAll();

setTimeout(() => {
  map.invalidateSize();
}, 300);

window.addEventListener("resize", () => {
  map.invalidateSize();
});


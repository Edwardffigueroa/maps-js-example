// Variables globales
let map;
let googleMapsApiKey = "";
let currentBaseLayer;
let markersLayer;
let zonesLayer;

// Definir capas base de mapas
const baseLayers = {};

// Función para cargar Google Maps API dinámicamente
function loadGoogleMapsAPI(apiKey) {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Crear script tag
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Maps API cargada");
      resolve();
    };

    script.onerror = () => {
      console.error("Error al cargar Google Maps API");
      reject(new Error("No se pudo cargar Google Maps API"));
    };

    document.head.appendChild(script);
  });
}

// Iconos personalizados para diferentes tipos de ubicaciones
const customIcons = {
  university: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #FF6B6B; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">🎓</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  landmark: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #4ECDC4; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">🏛️</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  park: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #45B7D1; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">🌳</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  monument: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #FFA07A; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">⛪</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  zoo: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #96CEB4; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">🦁</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  custom: L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #9B59B6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">📍</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
};

// Inicializar mapa
async function initMap() {
  // Obtener configuración del servidor (Google Maps API Key)
  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    googleMapsApiKey = config.googleMapsApiKey;
  } catch (error) {
    console.error("Error al obtener configuración:", error);
  }

  // Definir las capas base
  baseLayers.osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }
  );

  // Configurar Google Maps si hay API key
  if (googleMapsApiKey && typeof L.gridLayer.googleMutant !== "undefined") {
    // Cargar Google Maps API primero
    await loadGoogleMapsAPI(googleMapsApiKey);

    baseLayers.googleRoadmap = L.gridLayer.googleMutant({
      type: "roadmap",
    });

    baseLayers.googleSatellite = L.gridLayer.googleMutant({
      type: "satellite",
    });

    baseLayers.googleHybrid = L.gridLayer.googleMutant({
      type: "hybrid",
    });

    baseLayers.googleTerrain = L.gridLayer.googleMutant({
      type: "terrain",
    });

    console.log("Google Maps capas configuradas");
  }

  // Inicializar el mapa centrado en Cali, Colombia
  map = L.map("map").setView([3.4516, -76.532], 12);

  // Agregar capa base inicial (OpenStreetMap)
  currentBaseLayer = baseLayers.osm;
  currentBaseLayer.addTo(map);

  // Inicializar grupos de capas
  markersLayer = L.layerGroup().addTo(map);
  zonesLayer = L.layerGroup().addTo(map);

  // Agregar control de escala
  L.control.scale({ imperial: false, metric: true }).addTo(map);

  // Event listener para clics en el mapa
  map.on("click", (e) => {
    updateInfo(`
      <p><strong>Coordenadas del clic:</strong></p>
      <p>Latitud: ${e.latlng.lat.toFixed(6)}</p>
      <p>Longitud: ${e.latlng.lng.toFixed(6)}</p>
    `);
  });

  console.log("Mapa inicializado correctamente");
}

// Cambiar capa base del mapa
function changeBaseLayer(layerType) {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer);
  }

  switch (layerType) {
    case "osm":
      currentBaseLayer = baseLayers.osm;
      break;
    case "google-roadmap":
      currentBaseLayer = baseLayers.googleRoadmap;
      break;
    case "google-satellite":
      currentBaseLayer = baseLayers.googleSatellite;
      break;
    case "google-hybrid":
      currentBaseLayer = baseLayers.googleHybrid;
      break;
    case "google-terrain":
      currentBaseLayer = baseLayers.googleTerrain;
      break;
  }

  if (currentBaseLayer) {
    currentBaseLayer.addTo(map);
  } else {
    updateInfo(
      "<p>⚠️ Este mapa no está disponible. Verifica tu configuración de API keys.</p>"
    );
  }
}

// Cargar ubicaciones desde el servidor
async function loadLocations() {
  try {
    const response = await fetch("/api/locations");
    const locations = await response.json();

    locations.forEach((location) => {
      const icon = customIcons[location.type] || customIcons.custom;

      const marker = L.marker([location.lat, location.lng], { icon })
        .bindPopup(
          `
          <div class="popup-title">${location.name}</div>
          <div class="popup-description">${location.description}</div>
          <div class="popup-coords">Lat: ${location.lat}, Lng: ${location.lng}</div>
        `
        )
        .on("click", () => {
          updateInfo(`
            <p><strong>${location.name}</strong></p>
            <p>${location.description}</p>
            <p>Tipo: ${location.type}</p>
            <p>Coordenadas: ${location.lat}, ${location.lng}</p>
          `);
        });

      markersLayer.addLayer(marker);
    });

    updateInfo(
      `<p>✅ Se cargaron ${locations.length} ubicaciones en el mapa.</p>`
    );
  } catch (error) {
    console.error("Error al cargar ubicaciones:", error);
    updateInfo("<p>❌ Error al cargar las ubicaciones.</p>");
  }
}

// Cargar zonas/polígonos desde el servidor
async function loadZones() {
  try {
    const response = await fetch("/api/zones");
    const zones = await response.json();

    zones.forEach((zone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.3,
        weight: 2,
      })
        .bindPopup(
          `
        <div class="popup-title">${zone.name}</div>
        <div class="popup-description">${zone.description}</div>
      `
        )
        .on("click", () => {
          updateInfo(`
          <p><strong>Zona: ${zone.name}</strong></p>
          <p>${zone.description}</p>
          <p>Color: ${zone.color}</p>
        `);
        });

      zonesLayer.addLayer(polygon);
    });

    updateInfo(`<p>✅ Se cargaron ${zones.length} zonas en el mapa.</p>`);
  } catch (error) {
    console.error("Error al cargar zonas:", error);
    updateInfo("<p>❌ Error al cargar las zonas.</p>");
  }
}

// Agregar marcador personalizado
function addCustomMarker() {
  const center = map.getCenter();
  const randomLat = center.lat + (Math.random() - 0.5) * 0.02;
  const randomLng = center.lng + (Math.random() - 0.5) * 0.02;

  const marker = L.marker([randomLat, randomLng], { icon: customIcons.custom })
    .bindPopup(
      `
      <div class="popup-title">Marcador Personalizado</div>
      <div class="popup-description">Este es un marcador creado manualmente</div>
      <div class="popup-coords">Lat: ${randomLat.toFixed(
        6
      )}, Lng: ${randomLng.toFixed(6)}</div>
    `
    )
    .on("click", () => {
      updateInfo(`
        <p><strong>Marcador Personalizado</strong></p>
        <p>Ubicación: ${randomLat.toFixed(6)}, ${randomLng.toFixed(6)}</p>
        <p>Este marcador fue creado manualmente.</p>
      `);
    });

  markersLayer.addLayer(marker);
  updateInfo(
    `<p>✅ Marcador personalizado agregado en: ${randomLat.toFixed(
      6
    )}, ${randomLng.toFixed(6)}</p>`
  );
}

// Limpiar todos los marcadores y zonas
function clearMap() {
  markersLayer.clearLayers();
  zonesLayer.clearLayers();
  updateInfo(
    "<p>🗑️ Mapa limpiado. Todos los marcadores y zonas han sido eliminados.</p>"
  );
}

// Actualizar panel de información
function updateInfo(html) {
  document.getElementById("infoContent").innerHTML = html;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initMap();

  // Botones de selección de mapa
  document.querySelectorAll(".map-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".map-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      changeBaseLayer(e.target.dataset.map);
    });
  });

  // Botones de acción
  document
    .getElementById("loadLocations")
    .addEventListener("click", loadLocations);
  document.getElementById("loadZones").addEventListener("click", loadZones);
  document
    .getElementById("addCustomMarker")
    .addEventListener("click", addCustomMarker);
  document.getElementById("clearMap").addEventListener("click", clearMap);
});

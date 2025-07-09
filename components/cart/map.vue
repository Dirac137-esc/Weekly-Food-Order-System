<template>
  <!-- Хаяг сонгох газар -->
  <v-card class="pa-4 mb-4" outlined>
    <div class="text-subtitle-1 font-weight-bold mb-2">Байршлаа сонгох</div>
    <div
      v-if="isMounted"
      ref="mapRef"
      id="map"
      style="width: 100%; height: 300px; border-radius: 10px"
    ></div>
    <div
      v-else
      class="map-loading d-flex align-center justify-center"
      style="height: 300px; background-color: #f5f5f5; border-radius: 10px"
    >
      <v-progress-circular indeterminate color="primary" size="40" />
      <span class="ml-2">Газрын зураг ачааллаж байна...</span>
    </div>
    <div class="mt-3">
      <div class="d-flex align-center">
        <v-icon color="success" class="mr-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
            /></svg
        ></v-icon>
        <div>
          <div v-if="locationStore.loading" class="d-flex align-center">
            <v-progress-circular
              size="16"
              indeterminate
              color="primary"
              class="mr-2"
            />
            <span class="text-body-2">Байршил тодорхойлж байна...</span>
          </div>
          <div
            v-else-if="locationStore.name"
            class="text-body-2 font-weight-medium"
          >
            {{ locationStore.name }}
          </div>
          <div v-else class="text-body-2 grey--text">
            Газрын зураг дээр дарж байршлаа сонгоно уу
          </div>
        </div>
      </div>
      <div class="text-body-2 font-weight-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
          />
        </svg>
        Координат: {{ locationStore.lat.toFixed(5) }},
        {{ locationStore.lng.toFixed(5) }}
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useLocationStore } from "#imports";
import { ref, computed, onMounted, nextTick } from "vue";
// Track if component is mounted (client-side only)
const isMounted = ref(false);
const locationStore = useLocationStore();

const mapRef = ref<HTMLDivElement | null>(null);

// Leaflet variables
let L: any = null;
let map: any = null;
let marker: any = null;

// Динамик Leaflet ачаалах функц
async function loadLeaflet() {
  if (typeof window === "undefined") return null;

  try {
    // Dynamic import for Leaflet
    L = await import("leaflet");

    // Import CSS if needed
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    return L;
  } catch (error) {
    console.error("Failed to load Leaflet:", error);
    return null;
  }
}

// Байршлын нэрийг авах функц
async function getLocationName(lat: any, lng: any) {
  try {
    locationStore.loading = true;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await response.json();

    if (data && data.display_name) {
      locationStore.name = data.display_name;
      locationStore.details = `${data.locationStore?.road || ""} ${
        data.locationStore?.house_number || ""
      }`.trim();
    } else {
      locationStore.name = `Координат: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    locationStore.name = `Координат: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } finally {
    locationStore.loading = false;
  }
}

// Газрын зурагтай ажиллах функц
async function initializeMap() {
  if (!mapRef.value || !L) return;

  try {
    map = L.map(mapRef.value).setView(
      [locationStore.lat, locationStore.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    marker = L.marker([locationStore.lat, locationStore.lng], {
      draggable: true,
    }).addTo(map);

    marker.bindPopup("Хүргэлтийн байршил").openPopup();

    // Анхны байршлын нэрийг авах
    await getLocationName(locationStore.lat, locationStore.lng);

    marker.on("moveend", async (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      locationStore.lat = lat;
      locationStore.lng = lng;
      await getLocationName(lat, lng);
    });

    map.on("click", async (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      locationStore.lat = lat;
      locationStore.lng = lng;
      await getLocationName(lat, lng);
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// Компонент ачаалагдахад
onMounted(async () => {
  // Mark as mounted for client-side only rendering
  isMounted.value = true;

  // Wait for next tick to ensure DOM is ready
  await nextTick();

  // Load Leaflet dynamically
  await loadLeaflet();

  // Initialize map after Leaflet is loaded
  if (L) {
    await initializeMap();
  }
});
</script>

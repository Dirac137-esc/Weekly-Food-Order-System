<template>
  <v-app>
    <v-main>
      <v-container class="pt-10" style="max-width: 1200px">
        <v-row dense>
          <!-- ЗАХИАЛГЫН ТАЛ -->
          <v-col cols="12" md="7">
            <!-- Захиалгын төрөл -->
            <v-btn-toggle v-model="orderType" class="mb-4" rounded group>
              <v-btn value="delivery">Хүргэлтээр</v-btn>
              <v-btn value="pickup">Очиж авах</v-btn>
            </v-btn-toggle>

            <!-- Хаяг сонгох газар -->
            <v-card class="pa-4 mb-4" outlined>
              <div class="text-subtitle-1 font-weight-bold mb-2">
                Байршлаа сонгох
              </div>
              <div
                v-if="isMounted"
                ref="mapRef"
                id="map"
                style="width: 100%; height: 300px; border-radius: 10px"
              ></div>
              <div
                v-else
                class="map-loading d-flex align-center justify-center"
                style="
                  height: 300px;
                  background-color: #f5f5f5;
                  border-radius: 10px;
                "
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
                    <div v-if="address.loading" class="d-flex align-center">
                      <v-progress-circular
                        size="16"
                        indeterminate
                        color="primary"
                        class="mr-2"
                      />
                      <span class="text-body-2"
                        >Байршил тодорхойлж байна...</span
                      >
                    </div>
                    <div
                      v-else-if="address.name"
                      class="text-body-2 font-weight-medium"
                    >
                      {{ address.name }}
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
                  Координат: {{ address.lat.toFixed(5) }},
                  {{ address.lng.toFixed(5) }}
                </div>
              </div>
            </v-card>

            <!-- Захиалах цаг -->
            <v-btn-toggle v-model="orderTime" class="mb-4" rounded group>
              <v-btn value="now">Яг одоо</v-btn>
              <v-btn value="schedule">Урьдчилж авах</v-btn>
            </v-btn-toggle>

            <!-- Сагс -->
            <v-card class="pa-4 mb-4" outlined>
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-cart</v-icon>
                <span class="font-weight-bold text-h6">Миний сагс</span>
                <v-chip color="primary" small class="ml-2"
                  >{{ cartItemCount }} ширхэг</v-chip
                >
              </div>
              <div v-if="cartStore.cart.size === 0" class="text-center py-4">
                <v-icon size="48" color="grey-lighten-2">mdi-cart-off</v-icon>
                <div class="text-subtitle-1 grey--text mt-2">
                  Сагс хоосон байна
                </div>
              </div>
              <div v-else>
                <div
                  v-for="[day, items] in Array.from(cartStore.cart.entries())"
                  :key="day"
                >
                  <div
                    v-for="({ item, quantity }, index) in items"
                    :key="item.id || index"
                    class="food-item-card mb-4 pa-3"
                  >
                    <v-row
                      no-gutters
                      class="cart-item py-3 px-2 align-center hover:bg-grey-lighten-4 rounded-lg mb-2"
                    >
                      <!-- Image -->
                      <v-col cols="3">
                        <v-img
                          :src="item.imageUrl"
                          height="70"
                          class="rounded-lg"
                          cover
                        >
                          <template #error>
                            <div
                              class="image-placeholder d-flex align-center justify-center grey-lighten-3 rounded-lg"
                              style="height: 70px"
                            >
                              <v-icon size="40" color="grey-lighten-1"
                                >mdi-food</v-icon
                              >
                            </div>
                          </template>
                          <template #placeholder>
                            <div
                              class="image-placeholder d-flex align-center justify-center"
                              style="height: 70px"
                            >
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              />
                            </div>
                          </template>
                        </v-img>
                      </v-col>

                      <!-- Info -->
                      <v-col cols="6" class="pl-3">
                        <div class="text-body-1 font-weight-bold">
                          {{ item.name }}
                        </div>
                        <div class="text-caption text-grey-darken-1">
                          {{ item.ingredients?.join(", ") }}
                        </div>
                        <div class="text-caption">Ширхэг: {{ quantity }}</div>
                      </v-col>

                      <!-- Controls -->
                      <v-col cols="3" class="text-right">
                        <div class="d-flex justify-end align-center mb-1">
                          <span class="mx-2 text-body-2">{{ quantity }}</span>
                        </div>
                        <div class="font-weight-bold text-body-2 mb-1">
                          {{ (item.price * quantity).toLocaleString() }}₮
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-card>

            <!-- Купон -->
            <v-card class="pa-4 mb-4" outlined>
              <div class="font-weight-bold mb-2">Хөнгөлөлт</div>
              <div v-for="coupon in coupons" :key="coupon.id" class="mb-3">
                <v-card
                  outlined
                  class="coupon-card"
                  :class="{
                    'coupon-selected': selectedCoupons.includes(coupon.id),
                  }"
                  @click="toggleCoupon(coupon.id)"
                >
                  <v-card-text class="d-flex align-center">
                    <v-icon
                      v-if="selectedCoupons.includes(coupon.id)"
                      color="error"
                      class="mr-2"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="icon icon-tabler icons-tabler-filled icon-tabler-square-check"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                        /></svg
                    ></v-icon>
                    <v-icon v-else
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-square"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"
                        /></svg
                    ></v-icon>
                    <div>
                      <div class="font-weight-bold" style="padding-left: 6px">
                        {{ coupon.label }}
                      </div>
                      <div class="text-caption" style="padding-left: 6px">
                        {{ coupon.description }}
                      </div>
                    </div>
                    <v-spacer />
                    <v-chip
                      small
                      color="error"
                      variant="tonal"
                      prepend-icon="mdi-tag"
                    >
                      -{{ coupon.amount.toLocaleString() }}₮
                    </v-chip>
                  </v-card-text>
                </v-card>
              </div>
              <v-divider v-if="totalDiscount > 0" class="my-3" />
              <v-row v-if="totalDiscount > 0" justify="space-between">
                <span class="font-weight-medium">Нийт хөнгөлөлт</span>
                <span class="font-weight-bold text-primary"
                  >-{{ totalDiscount.toLocaleString() }}₮</span
                >
              </v-row>
            </v-card>

            <!-- НӨАТ төрөл -->
            <v-radio-group v-model="vatType" class="mb-4">
              <v-radio label="Хувь хүн" value="person" />
              <v-radio label="Байгууллага" value="company" />
            </v-radio-group>

            <!-- Нэмэлт тэмдэглэл -->
            <v-textarea
              v-model="orderNotes"
              label="Нэмэлт тэмдэглэл"
              rows="2"
              outlined
              class="mb-4"
            />

            <!-- Төлбөрийн Дүн -->
            <v-card class="pa-4 mb-4" outlined>
              <v-row v-for="(t, k) in totals" :key="k" justify="space-between">
                <span>{{ t.label }}</span>
                <span
                  ><strong>{{ t.amount.toLocaleString() }}₮</strong></span
                >
              </v-row>
              <v-divider class="my-2" />
              <v-row justify="space-between">
                <span class="font-weight-bold">ТӨЛӨХ НИЙТ ДҮН</span>
                <span class="font-weight-bold"
                  >{{ totalAmount.toLocaleString() }}₮</span
                >
              </v-row>
            </v-card>
          </v-col>

          <!-- ТӨЛБӨРИЙН ТАЛ -->
          <v-col cols="12" md="5" class="sticky-payment">
            <v-card class="pa-6" outlined>
              <div class="font-weight-bold mb-4">Төлбөр төлөх</div>
              <div class="d-flex align-center mb-4">
                <v-img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                  height="28"
                  width="45"
                  class="mr-2"
                />
                <v-img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  height="28"
                  width="45"
                  class="mr-2"
                />
                <v-img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  height="28"
                  width="45"
                />
              </div>
              <v-text-field
                label="Карт эзэмшигчийн нэр"
                outlined
                class="mb-3"
              />
              <v-text-field label="Картын дугаар" outlined class="mb-3" />
              <v-row>
                <v-col cols="6"
                  ><v-text-field label="Дуусах огноо" outlined
                /></v-col>
                <v-col cols="6"><v-text-field label="CVC" outlined /></v-col>
              </v-row>
              <v-btn
                block
                color="primary"
                class="mt-4"
                :disabled="cartStore.cart.size === 0"
                @click="order"
              >
                Төлбөр төлөх
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

// Track if component is mounted (client-side only)
const isMounted = ref(false);

// Хувируулах утгууд
const orderType = ref<"delivery" | "pickup">("delivery");
const orderTime = ref<"now" | "schedule">("now");
const vatType = ref<"person" | "company">("person");

// Байршлын мэдээлэл
const address = ref({
  lat: 47.9185,
  lng: 106.917,
  name: "",
  details: "",
  loading: false,
});

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

// Купон болон захиалгын мэдээлэл
const coupons = ref([
  {
    id: "coupon1",
    label: "Шинэ хэрэглэгчийн купон",
    description: "Анхны захиалгад зориулсан гавьяа",
    amount: 5000,
  },
  {
    id: "coupon2",
    label: "Амралтын өдрийн хөнгөлөлт",
    description: "Бямба, ням",
    amount: 3000,
  },
  {
    id: "coupon3",
    label: "Төрсөн өдрийн урамшуулал",
    description: "Төрсөн өдөр",
    amount: 7000,
  },
]);
const selectedCoupons = ref<string[]>([]);
const orderNotes = ref("");
async function order() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No authentication token found");
    return;
  }

  try {
    const thisWeek = await useApi("/menus/this-week", "GET", "");

    if (!thisWeek?.weekDates) {
      throw new Error("Invalid week dates data from API");
    }

    const orderPromises = [];
    const weekdays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const [weekday, cartItems] of cartStore.cart.entries()) {
      // Validate weekday
      console.log("weekday : " + weekday);
      const dateStr = thisWeek.weekDates[weekdays[+weekday]];
      console.log(dateStr);
      // Parse and validate date
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) {
        console.error(`Invalid date for ${weekday}: ${dateStr}`);
        continue;
      }

      // Format date to YYYY-MM-DD (backend might expect this format)
      const formattedDate = dateObj.toISOString();

      const dayTotal = cartItems.reduce(
        (sum, { item, quantity }) => sum + item.price * quantity,
        0
      );

      const itemsPayload = cartItems.map(({ item, quantity }) => ({
        food: item.id,
        qty: quantity,
      }));

      const orderPromise = fetch(
        `https://backend-production-25f11.up.railway.app/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: formattedDate,
            items: itemsPayload,
            totalCost: dayTotal,
            location: {
              latitude: parseFloat(address.value.lat.toFixed(6)),
              longitude: parseFloat(address.value.lng.toFixed(6)),
              address: `${address.value.details || ""} ${
                address.value.name || ""
              }`.trim(),
              additionalNote: orderNotes.value || "No additional notes",
            },
          }),
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to create order");
          }
          return res.json();
        })
        .then((data) => ({
          weekday,
          success: true,
          data,
        }))
        .catch((error) => {
          console.error(`Order failed for ${weekday}:`, error);
          return {
            weekday,
            success: false,
            error: error.message,
          };
        });

      orderPromises.push(orderPromise);
    }

    const results = await Promise.all(orderPromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (successful.length > 0) {
      cartStore.clearCart();
      console.log("BOlson shv bro");
    }

    if (failed.length > 0) {
      // Show error notification
      console.error("Some orders failed:", failed);
    }

    return results;
  } catch (error) {
    console.error("Order processing error:", error);
    // Show error notification to user
    throw error;
  }
}

// Байршлын нэрийг авах функц
async function getLocationName(lat: number, lng: number) {
  try {
    address.value.loading = true;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await response.json();

    if (data && data.display_name) {
      address.value.name = data.display_name;
      address.value.details = `${data.address?.road || ""} ${
        data.address?.house_number || ""
      }`.trim();
    } else {
      address.value.name = `Координат: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    address.value.name = `Координат: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } finally {
    address.value.loading = false;
  }
}

// Газрын зурагтай ажиллах функц
async function initializeMap() {
  if (!mapRef.value || !L) return;

  try {
    map = L.map(mapRef.value).setView(
      [address.value.lat, address.value.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    marker = L.marker([address.value.lat, address.value.lng], {
      draggable: true,
    }).addTo(map);

    marker.bindPopup("Хүргэлтийн байршил").openPopup();

    // Анхны байршлын нэрийг авах
    await getLocationName(address.value.lat, address.value.lng);

    marker.on("moveend", async (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      address.value.lat = lat;
      address.value.lng = lng;
      await getLocationName(lat, lng);
    });

    map.on("click", async (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      address.value.lat = lat;
      address.value.lng = lng;
      await getLocationName(lat, lng);
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// Купон тогтоох функц
function toggleCoupon(id: string) {
  const index = selectedCoupons.value.indexOf(id);
  if (index >= 0) {
    selectedCoupons.value.splice(index, 1);
  } else {
    selectedCoupons.value.push(id);
  }
}

// Computed утгууд
const totalDiscount = computed(() =>
  coupons.value
    .filter((c) => selectedCoupons.value.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0)
);

const cartItemCount = computed(() =>
  Array.from(cartStore.cart.values()).reduce((sum, dayItems) => {
    // dayItems is an array of {item, quantity}
    return sum + dayItems.reduce((daySum, entry) => daySum + entry.quantity, 0);
  }, 0)
);

const totals = computed(() => {
  const subtotal = cartStore.total;
  const minFee = subtotal < 0 ? 0 : 0;
  const deliveryFee = orderType.value === "delivery" ? 0 : 0;
  const discount = totalDiscount.value;
  const vat = vatType.value === "company" ? Math.round(subtotal * 0.1) : 0;

  return {
    subtotal: { label: "Захиалгын дүн", amount: subtotal },
    minfee: { label: "Бага үнэтэй", amount: minFee },
    delivery: { label: "Хүргэлтийн үнэ", amount: deliveryFee },
    discount: { label: "Хөнгөлөлт", amount: -discount },
    vat: { label: "НӨАТ", amount: vat },
  };
});

const totalAmount = computed(() =>
  Object.values(totals.value).reduce((sum, t) => sum + t.amount, 0)
);

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

<style scoped>
.cart-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 8px;
}

.coupon-card {
  border: 1px solid #e3e7ee;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coupon-selected {
  background: #e8f0ff;
  border-color: #325eaf !important;
}

.sticky-payment {
  position: sticky;
  top: 40px;
  z-index: 10;
}
</style>

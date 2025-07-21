<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useCartStore } from "~/stores/cart";
import { useLocationStore } from "../stores/location";
import { useRouter } from "vue-router";
import Payment from "~/components/cart/payment.vue";
const locationStore = useLocationStore();
const cartStore = useCartStore();
const router = useRouter();
definePageMeta({
  middleware: "auth",
});
const formData = ref({
  cardHolder: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
});

const showSuccess = ref(false);
const totalItems = computed(() => {
  let total = 0;
  for (const dayItems of cartStore.cart.values()) {
    for (const { quantity } of dayItems) {
      total += quantity;
    }
  }
  return total;
});
let searchTimeout = null;
const formatPrice = (price) => {
  return new Intl.NumberFormat("mn-MN").format(price);
};

const possiblePlace = ref([]);
const formatCardNumber = (value) => {
  return value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const onCardNumberInput = (event) => {
  const target = event.target;
  target.value = formatCardNumber(target.value);
  formData.value.cardNumber = target.value;
};

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
const selectedCoupons = ref([]);

function toggleCoupon(id) {
  const index = selectedCoupons.value.indexOf(id);
  if (index >= 0) {
    selectedCoupons.value.splice(index, 1);
  } else {
    selectedCoupons.value.push(id);
  }
}
const totalDiscount = computed(() =>
  coupons.value
    .filter((c) => selectedCoupons.value.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0)
);

const totalWithDiscount = computed(() => {
  return Math.max(0, cartStore.total - totalDiscount.value);
});
const searchInput = ref("");
const location = ref("");
// Watch for search input changes with debouncing
watch(searchInput, (newValue) => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Set new timeout for 300ms delay
  searchTimeout = setTimeout(() => {
    if (newValue && newValue.length >= 1) {
      onSearch(newValue);
    } else {
      possiblePlace.value = [];
    }
  }, 300);
});
async function onSearch(searchValue) {
  if (!searchValue || searchValue.trim() === "") {
    possiblePlace.value = [];
    return;
  }

  possiblePlace.value = [];
  console.log("Searching for:", searchValue);

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      "https://backend-production-25f11.up.railway.app/api/search-address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: searchValue,
        }),
      }
    );

    const wholeData = await res.json();

    for (let i = 0; i < wholeData.data.length; i++) {
      possiblePlace.value.push(wholeData.data[i].full_address);
    }

    console.log("Search results:", possiblePlace.value);
  } catch (error) {
    console.error("Network error:", error);
  }
}
</script>

<template>
  <v-app>
    <v-main class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" lg="11" xl="10">
            <v-card
              class="elevation-12 rounded-xl overflow-hidden"
              color="surface"
            >
              <v-card-text class="pa-8">
                <Stepper />

                <v-row class="mt-8 align-start">
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Байршилийн дэлгэрэнгүй мэдээлэл"
                      :items="possiblePlace"
                      v-model="location"
                      v-model:search="searchInput"
                      no-filter
                      clearable
                    />

                    <!-- Order Summary -->
                    <v-card
                      class="elevation-8 rounded-xl"
                      color="primary-lighten-5"
                    >
                      <v-card-title class="d-flex align-center pa-6">
                        <v-icon color="primary" size="24" class="me-2"
                          >mdi-receipt</v-icon
                        >
                        <span class="text-h6 font-weight-bold text-primary">
                          Захиалгын хураангуй
                        </span>
                      </v-card-title>

                      <v-divider class="mx-6"></v-divider>

                      <v-card-text class="pa-6">
                        <v-row class="mb-2">
                          <v-col cols="7">
                            <span class="text-body-1 text-grey">Нийлбэр</span>
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span class="text-body-1 font-weight-medium">
                              {{ formatPrice(cartStore.total) }}₮
                            </span>
                          </v-col>
                        </v-row>

                        <v-row v-if="totalDiscount > 0" class="mb-2">
                          <v-col cols="7">
                            <span class="text-body-1 text-grey">Хөнгөлөлт</span>
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span
                              class="text-body-1 font-weight-medium text-success"
                            >
                              -{{ formatPrice(totalDiscount) }}₮
                            </span>
                          </v-col>
                        </v-row>

                        <v-row class="mb-2">
                          <v-col cols="7">
                            <span class="text-body-1 text-grey">Хүргэлт</span>
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span
                              class="text-body-1 font-weight-medium text-success"
                            >
                              Үнэгүй
                            </span>
                          </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-row>
                          <v-col cols="7">
                            <span class="text-h6 font-weight-bold"
                              >Нийт үнэ</span
                            >
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span class="text-h6 font-weight-bold text-primary">
                              {{ formatPrice(totalWithDiscount) }}₮
                            </span>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <Payment />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccess" persistent width="400">
      <v-card class="text-center pa-8 rounded-xl" color="surface">
        <v-avatar color="success" size="80" class="mb-4 mx-auto elevation-8">
          <v-icon color="white" size="40">mdi-check</v-icon>
        </v-avatar>

        <v-card-title class="text-h5 font-weight-bold text-success mb-2">
          Амжилттай!
        </v-card-title>

        <v-card-text class="text-body-1 text-grey mb-4">
          Таны төлбөр амжилттай төлөгдлөө
        </v-card-text>

        <v-progress-circular indeterminate color="primary" size="32" />
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
.animate-pulse {
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

@media (max-width: 960px) {
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

.map-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.map-container {
  width: 100% !important;
  height: 100% !important;
  position: relative;
  z-index: 1;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .map-wrapper {
    height: 250px;
  }
}
</style>

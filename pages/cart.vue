<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useCartStore } from "~/stores/cart";
import { useRouter } from "vue-router";
import Map from "~/components/cart/map.vue";

const locationStore = useLocationStore();
const cartStore = useCartStore();
const step = ref(1);
const router = useRouter();

const formData = ref({
  cardHolder: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
});

const animateAdd = ref<string | null>(null);
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("mn-MN").format(price);
};

const formatCardNumber = (value: string) => {
  return value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const onCardNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.value = formatCardNumber(target.value);
  formData.value.cardNumber = target.value;
};

function toStatus() {
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    router.push("./status");
  }, 1000);
}
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

function toggleCoupon(id: string) {
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
                <v-stepper
                  v-model="step"
                  class="mb-8 elevation-0 bg-transparent"
                  hide-actions
                >
                  <v-stepper-header class="elevation-0 bg-transparent">
                    <v-stepper-item
                      :complete="step > 1"
                      step="1"
                      color="primary"
                      class="pa-4"
                    >
                      <template #icon>
                        <v-avatar
                          :color="step >= 1 ? 'primary' : 'grey-lighten-2'"
                          size="48"
                          class="elevation-4"
                        >
                          <v-icon v-if="step > 1" color="white" size="20">
                            mdi-check
                          </v-icon>
                          <span
                            v-else
                            class="text-h6 font-weight-bold"
                            :class="step >= 1 ? 'text-white' : 'text-grey'"
                          >
                            1
                          </span>
                        </v-avatar>
                      </template>
                      <div class="text-center mt-2">
                        <div class="text-subtitle-1 font-weight-bold">
                          Захиалга
                        </div>
                        <div class="text-caption text-grey">Order Items</div>
                      </div>
                    </v-stepper-item>

                    <v-divider class="mx-4"></v-divider>

                    <v-stepper-item
                      :complete="step > 2"
                      step="2"
                      color="primary"
                      class="pa-4"
                    >
                      <template #icon>
                        <v-avatar
                          :color="step >= 2 ? 'primary' : 'grey-lighten-2'"
                          size="48"
                          class="elevation-4"
                        >
                          <v-icon v-if="step > 2" color="white" size="20">
                            mdi-check
                          </v-icon>
                          <span
                            v-else
                            class="text-h6 font-weight-bold"
                            :class="step >= 2 ? 'text-white' : 'text-grey'"
                          >
                            2
                          </span>
                        </v-avatar>
                      </template>
                      <div class="text-center mt-2">
                        <div class="text-subtitle-1 font-weight-bold">
                          Төлбөр
                        </div>
                        <div class="text-caption text-grey">Payment</div>
                      </div>
                    </v-stepper-item>

                    <v-divider class="mx-4"></v-divider>

                    <v-stepper-item step="3" color="primary" class="pa-4">
                      <template #icon>
                        <v-avatar
                          :color="step >= 3 ? 'primary' : 'grey-lighten-2'"
                          size="48"
                          class="elevation-4"
                        >
                          <v-icon v-if="step > 3" color="white" size="20">
                            mdi-check
                          </v-icon>
                          <span
                            v-else
                            class="text-h6 font-weight-bold"
                            :class="step >= 3 ? 'text-white' : 'text-grey'"
                          >
                            3
                          </span>
                        </v-avatar>
                      </template>
                      <div class="text-center mt-2">
                        <div class="text-subtitle-1 font-weight-bold">
                          Хянах
                        </div>
                        <div class="text-caption text-grey">Review</div>
                      </div>
                    </v-stepper-item>
                  </v-stepper-header>
                </v-stepper>

                <v-row class="mt-8 align-center">
                  <v-col cols="12" md="8">
                    <Map />

                    <!-- <v-card class="elevation-8 rounded-xl mb-6" color="surface">
                      <v-card-title class="d-flex align-center pa-6">
                        <v-icon color="primary" size="24" class="me-2"
                          >mdi-tag</v-icon
                        >
                        <span class="text-h6 font-weight-bold text-primary">
                          Хөнгөлөлт
                        </span>
                      </v-card-title>

                      <v-divider class="mx-6"></v-divider>

                      <v-card-text class="pa-6">
                        <div
                          v-for="coupon in coupons"
                          :key="coupon.id"
                          class="mb-3"
                        >
                          <v-card   
                            outlined
                            class="coupon-card"
                            :class="{
                              'coupon-selected': selectedCoupons.includes(
                                coupon.id
                              ),
                            }"
                            @click="toggleCoupon(coupon.id)"
                          >
                            <v-card-text class="d-flex align-center">
                              <v-icon
                                v-if="selectedCoupons.includes(coupon.id)"
                                color="success"
                                class="mr-2"
                              >
                                mdi-check-circle
                              </v-icon>
                              <v-icon v-else color="grey" class="mr-2">
                                mdi-circle-outline
                              </v-icon>
                              <div>
                                <div
                                  class="font-weight-bold"
                                  style="padding-left: 6px"
                                >
                                  {{ coupon.label }}
                                </div>
                                <div
                                  class="text-caption"
                                  style="padding-left: 6px"
                                >
                                  {{ coupon.description }}
                                </div>
                              </div>
                              <v-spacer />
                              <v-chip
                                size="small"
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
                          <span class="font-weight-bold text-success"
                            >-{{ totalDiscount.toLocaleString() }}₮</span
                          >
                        </v-row>
                      </v-card-text>
                    </v-card> -->

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

                  <!-- Payment -->
                  <v-col cols="12" md="4">
                    <v-card class="elevation-8 rounded-xl" color="surface">
                      <v-card-title class="d-flex align-center pa-6">
                        <v-icon color="secondary" size="24" class="me-2"
                          >mdi-credit-card</v-icon
                        >
                        <span class="text-h6 font-weight-bold text-secondary">
                          Төлбөр төлөх
                        </span>
                      </v-card-title>

                      <v-card-text class="pa-6">
                        <!-- Payment Methods -->
                        <v-card
                          class="elevation-2 rounded-lg pa-4 mb-6"
                          color="grey-lighten-5"
                        >
                          <v-row align="center" justify="space-around">
                            <v-col cols="4" class="text-center">
                              <v-img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                height="24"
                                contain
                              />
                            </v-col>
                            <v-col cols="4" class="text-center">
                              <v-img
                                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                                height="24"
                                contain
                              />
                            </v-col>
                            <v-col cols="4" class="text-center">
                              <v-img
                                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                height="24"
                                contain
                              />
                            </v-col>
                          </v-row>
                        </v-card>

                        <!-- Payment Form -->
                        <v-form>
                          <v-text-field
                            v-model="formData.cardHolder"
                            label="Карт эзэмшигчийн нэр"
                            placeholder="Таны нэр"
                            prepend-inner-icon="mdi-account"
                            variant="outlined"
                            color="primary"
                            class="mb-4"
                            rounded="lg"
                          />

                          <v-text-field
                            v-model="formData.cardNumber"
                            label="Картын дугаар"
                            placeholder="xxxx xxxx xxxx xxxx"
                            prepend-inner-icon="mdi-credit-card"
                            variant="outlined"
                            color="primary"
                            class="mb-4"
                            rounded="lg"
                            @input="onCardNumberInput"
                          />

                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                v-model="formData.expiryDate"
                                label="Дуусах огноо"
                                type="month"
                                prepend-inner-icon="mdi-calendar"
                                variant="outlined"
                                color="primary"
                                rounded="lg"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="formData.cvc"
                                label="CVC"
                                placeholder="000"
                                prepend-inner-icon="mdi-shield-lock"
                                variant="outlined"
                                color="primary"
                                maxlength="3"
                                rounded="lg"
                              />
                            </v-col>
                          </v-row>

                          <v-btn
                            block
                            color="primary"
                            variant="elevated"
                            class="mt-6 text-none font-weight-bold"
                            rounded="xl"
                            @click="toStatus"
                          >
                            <v-icon class="me-2">mdi-credit-card</v-icon>
                            Төлбөр төлөх - {{ formatPrice(totalWithDiscount) }}₮
                          </v-btn>
                        </v-form>

                        <!-- Security Notice -->
                        <v-alert
                          type="success"
                          variant="tonal"
                          class="mt-6"
                          rounded="lg"
                          icon="mdi-shield-check"
                          title="Аюулгүй төлбөр"
                          text="Таны мэдээлэл 256-bit SSL шифрлэлтээр хамгаалагдсан"
                        />
                      </v-card-text>
                    </v-card>
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
* {
  font-family: "JetBrains Mono", sans-serif;
}

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

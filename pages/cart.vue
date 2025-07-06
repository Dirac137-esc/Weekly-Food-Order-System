<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const step = ref(1);
const router = useRouter();

const formData = ref({
  cardHolder: '',
  cardNumber: '',
  expiryDate: '',
  cvc: ''
});

const animateAdd = ref(null);
const showSuccess = ref(false);

const totalItems = computed(() => {
  let total = 0;
  for (const [_, {quantity}] of cartStore.cart) {
    total += quantity;
  }
  return total;
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('mn-MN').format(price);
};

const formatCardNumber = (value: string) => {
  return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim();
};

const onCardNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.value = formatCardNumber(target.value);
  formData.value.cardNumber = target.value;
};

const addItem = (id: string, item: any) => {
  cartStore.addItem(id, item);
};

function toStatus() {
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    router.push('./status');
  }, 1000);
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

                <v-stepper
                  v-model="step"
                  class="mb-8 elevation-0 bg-transparent"
                  hide-actions
                >
                  <v-stepper-header class="elevation-0 bg-transparent">
                    <v-stepper-step
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
                          <v-icon
                            v-if="step > 1"
                            color="white"
                            size="20"
                          >
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
                        <div class="text-subtitle-1 font-weight-bold">Захиалга</div>
                        <div class="text-caption text-grey">Order Items</div>
                      </div>
                    </v-stepper-step>

                    <v-divider class="mx-4"></v-divider>

                    <v-stepper-step
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
                          <v-icon
                            v-if="step > 2"
                            color="white"
                            size="20"
                          >
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
                        <div class="text-subtitle-1 font-weight-bold">Төлбөр</div>
                        <div class="text-caption text-grey">Payment</div>
                      </div>
                    </v-stepper-step>

                    <v-divider class="mx-4"></v-divider>

                    <v-stepper-step
                      step="3"
                      color="primary"
                      class="pa-4"
                    >
                      <template #icon>
                        <v-avatar
                          :color="step >= 3 ? 'primary' : 'grey-lighten-2'"
                          size="48"
                          class="elevation-4"
                        >
                          <v-icon
                            v-if="step > 3"
                            color="white"
                            size="20"
                          >
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
                        <div class="text-subtitle-1 font-weight-bold">Хянах</div>
                        <div class="text-caption text-grey">Review</div>
                      </div>
                    </v-stepper-step>
                  </v-stepper-header>
                </v-stepper>

                <!-- Main Content -->
                <v-row class="mt-8">
                  <!-- Cart Items -->
                  <v-col cols="12" md="8">
                    <v-card
                      class="elevation-8 rounded-xl"
                      color="surface"
                    >
                      <v-card-title class="d-flex align-center justify-space-between pa-6">
                        <div class="d-flex align-center">
                          <v-avatar color="primary" size="40" class="me-3">
                            <v-icon color="white" size="20">mdi-cart</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-h5 font-weight-bold text-primary">
                              Сагсан дахь хоолнууд
                            </div>
                            <div class="text-body-2 text-grey">
                              {{ totalItems }} нэр төрөл
                            </div>
                          </div>
                        </div>
                        <v-btn
                          color="error"
                          variant="outlined"
                          prepend-icon="mdi-delete"
                          @click="cartStore.cart.clear()"
                          rounded="xl"
                          class="text-none"
                        >
                          Бүгдийг устгах
                        </v-btn>
                      </v-card-title>

                      <v-divider class="mx-6"></v-divider>

                      <v-card-text class="pa-6">
                        <v-row>
                          <v-col
                            v-for="[_id, {item, quantity}] in cartStore.cart"
                            :key="_id"
                            cols="12"
                          >
                            <v-card
                              class="elevation-4 rounded-lg transition-all duration-300"
                              :class="{ 'animate-pulse bg-success-lighten-5': animateAdd === _id }"
                              color="surface"
                              hover
                            >
                              <v-card-text class="pa-4">
                                <v-row align="center" no-gutters>
                                  <v-col cols="12" sm="3" class="text-center">
                                    <div class="position-relative d-inline-block">
                                      <v-img
                                        :src="item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'"
                                        height="100"
                                        width="100"
                                        class="rounded-lg elevation-3"
                                        cover
                                      />
                                      <v-chip
                                        color="amber"
                                        size="small"
                                        class="position-absolute"
                                        style="top: -8px; right: -8px;"
                                        prepend-icon="mdi-star"
                                      >
                                        4.8
                                      </v-chip>
                                    </div>
                                  </v-col>

                                  <v-col cols="12" sm="5" class="pa-4">
                                    <div class="text-h6 font-weight-bold mb-2">
                                      {{ item.name }}
                                    </div>
                                    <div class="text-body-2 text-grey mb-2">
                                      <v-icon size="small" class="me-1">mdi-leaf</v-icon>
                                      Орц: {{ item.ingredients?.join(", ") || "Органик найрлага" }}
                                    </div>
                                    <v-chip
                                      color="primary"
                                      size="small"
                                      variant="outlined"
                                      class="mt-1"
                                    >
                                      {{ quantity }} ширхэг
                                    </v-chip>
                                  </v-col>

                                  <v-col cols="12" sm="4" class="pa-4">
                                    <div class="d-flex flex-column align-end">
                                      <!-- Quantity Controls -->
                                      <v-card
                                        class="d-flex align-center pa-2 mb-3 elevation-2"
                                        color="grey-lighten-4"
                                        rounded="xl"
                                      >
                                        <v-btn
                                          icon="mdi-minus"
                                          size="small"
                                          color="error"
                                          variant="text"
                                          @click="cartStore.decreaseItem(_id)"
                                        />
                                        <v-chip
                                          class="mx-2 font-weight-bold"
                                          color="primary"
                                          size="small"
                                        >
                                          {{ quantity }}
                                        </v-chip>
                                        <v-btn
                                          icon="mdi-plus"
                                          size="small"
                                          color="success"
                                          variant="text"
                                          @click="addItem(_id, item)"
                                        />
                                      </v-card>

                                      <!-- Price -->
                                      <div class="text-end mb-3">
                                        <div class="text-h6 font-weight-bold text-primary">
                                          {{ formatPrice(item.price * quantity) }}₮
                                        </div>
                                        <div class="text-caption text-grey">
                                          {{ formatPrice(item.price) }}₮ each
                                        </div>
                                      </div>

                                      <!-- Remove Button -->
                                      <v-btn
                                        icon="mdi-close"
                                        size="small"
                                        color="error"
                                        variant="text"
                                        @click="cartStore.removeItem(_id)"
                                        class="elevation-2"
                                      />
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <!-- Order Summary -->
                    <v-card
                      class="elevation-8 rounded-xl mt-6"
                      color="primary-lighten-5"
                    >
                      <v-card-title class="d-flex align-center pa-6">
                        <v-icon color="primary" size="24" class="me-2">mdi-receipt</v-icon>
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

                        <v-row class="mb-2">
                          <v-col cols="7">
                            <span class="text-body-1 text-grey">Хүргэлт</span>
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span class="text-body-1 font-weight-medium text-success">
                              Үнэгүй
                            </span>
                          </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-row>
                          <v-col cols="7">
                            <span class="text-h6 font-weight-bold">Нийт үнэ</span>
                          </v-col>
                          <v-col cols="5" class="text-end">
                            <span class="text-h6 font-weight-bold text-primary">
                              {{ formatPrice(cartStore.total) }}₮
                            </span>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Payment -->
                  <v-col cols="12" md="4">
                    <v-card
                      class="elevation-8 rounded-xl"
                      color="surface"
                    >
                      <v-card-title class="d-flex align-center pa-6">
                        <v-icon color="secondary" size="24" class="me-2">mdi-credit-card</v-icon>
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
                            size="large"
                            color="primary"
                            variant="elevated"
                            class="mt-6 text-none font-weight-bold"
                            rounded="xl"
                            @click="toStatus"
                          >
                            <v-icon class="me-2">mdi-credit-card</v-icon>
                            Төлбөр төлөх - {{ formatPrice(cartStore.total) }}₮
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
    <v-dialog
      v-model="showSuccess"
      persistent
      width="400"
    >
      <v-card
        class="text-center pa-8 rounded-xl"
        color="surface"
      >
        <v-avatar
          color="success"
          size="80"
          class="mb-4 mx-auto elevation-8"
        >
          <v-icon color="white" size="40">mdi-check</v-icon>
        </v-avatar>
        
        <v-card-title class="text-h5 font-weight-bold text-success mb-2">
          Амжилттай!
        </v-card-title>
        
        <v-card-text class="text-body-1 text-grey mb-4">
          Таны төлбөр амжилттай төлөгдлөө
        </v-card-text>
        
        <v-progress-circular
          indeterminate
          color="primary"
          size="32"
        />
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
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

/* Custom hover effects */
.v-card:hover {
  transform: translateY(-2px);
}

.v-btn:hover {
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .v-stepper-step {
    padding: 8px !important;
  }
}
</style>

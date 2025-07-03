<script setup lang="ts">
import { ref, computed } from "vue";
import { useCartStore } from "../stores/cart";
import { useRouter } from 'vue-router';
const cartStore = useCartStore();
const step = ref(1);

const router = useRouter();
function toStatus()
{
    router.push('./status')
}
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="8" class="pa-6 cart-main-card">
          <!-- Stepper -->
          <v-stepper v-model="step" class="mb-8 mt-6 rounded-lg elevation-1" flat>
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1" color="primary">Захиалга</v-stepper-step>
              <v-divider />
              <v-stepper-step :complete="step > 2" step="2" color="primary">Төлбөр</v-stepper-step>
              <v-divider />
              <v-stepper-step step="3" color="primary">Хянах</v-stepper-step>
            </v-stepper-header>
          </v-stepper>

          <!-- Main Content -->
          <v-row>
            <!-- Cart items -->
            <v-col cols="12" md="7">
              <v-card class="pa-6 mb-6 elevation-2 rounded-xl bg-white" outlined>
                <div class="d-flex justify-space-between align-center mb-4">
                  <span class="text-lg font-weight-bold">
                    Сагсан дахь хоолнууд ({{ cartStore.cart.size }} нэр төрөл)
                  </span>
                  <v-btn variant="text" color="error" class="text-caption font-weight-medium" @click="cartStore.cart.clear()">
                    Бүгдийг устгах
                  </v-btn>
                </div>

                <v-divider class="mb-4" />

                <div v-for="[_id, {item, quantity}] in cartStore.cart" :key="_id" class="mb-5 pa-3 rounded-lg food-item-card">
                  <v-row align="center" class="gy-2">
                    <v-col cols="3">
                      <v-img :src="item.imageUrl" height="70" class="rounded-lg" cover />
                    </v-col>

                    <v-col cols="6">
                      <div class="text-base font-weight-bold mb-1">{{ item.name }}</div>
                      <div class="text-sm text-grey-darken-1 mb-1">
                        Орц: {{ item.ingredients?.join(", ") }}
                      </div>
                      <div class="text-sm text-grey-darken-1">Ширхэг: {{ quantity }}</div>
                    </v-col>

                    <v-col cols="3" class="d-flex flex-column align-end">
                      <div class="d-flex align-center mb-2">
                        <v-btn icon color="grey-darken-1" size="x-small" @click="cartStore.decreaseItem(_id)">
                          <v-icon size="16">mdi-minus</v-icon>
                        </v-btn>
                        <span class="mx-2 text-sm font-weight-medium">{{ quantity }}</span>
                        <v-btn icon color="green" size="x-small" @click="cartStore.addItem(_id, item)">
                          <v-icon size="16">mdi-plus</v-icon>
                        </v-btn>
                      </div>
                      <div class="font-weight-bold mb-1">{{ item.price * quantity }}₮</div>
                      <v-btn icon color="red-darken-2" size="x-small" variant="text" @click="cartStore.removeItem(_id)">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>

              <!-- Order Summary -->
              <v-card class="pa-4" outlined>
                <div class="font-weight-bold mb-2">Захиалгын хураангуй</div>
                <v-divider class="mb-2" />
                <v-row>
                  <v-col cols="7" class="text-caption">Нийлбэр</v-col>
                  <v-col cols="5" class="text-right">{{ cartStore.total }}₮</v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-row>
                  <v-col cols="7" class="font-weight-bold">Нийт үнэ</v-col>
                  <v-col cols="5" class="text-right font-weight-bold">{{ cartStore.total }}₮</v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Payment -->
            <v-col cols="12" md="5">
              <v-card class="pa-6" outlined>
                <div class="font-weight-bold mb-4">Төлбөр төлөх</div>
                <div class="d-flex align-center mb-4">
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" height="28" width="10" class="mr-2" />
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="28" width="45" class="mr-2" />
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="28" width="44" />
                </div>
                <v-text-field label="Карт эзэмшигчийн нэр" type="text" maxlength="25" placeholder="Таны нэр" autocomplete="name" variant="outlined" color="primary" class="mb-3" />
                <v-text-field label="Картын дугаар" type="tel" inputmode="numeric" pattern="[0-9\s]{13,19}" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" variant="outlined" color="primary" class="mb-3" />
                <v-row>
                  <v-col cols="6">
                    <v-text-field label="Дуусах огноо" type="month" variant="outlined" color="primary" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="CVC" maxlength="3" placeholder="000" variant="outlined" color="primary" />
                  </v-col>
                </v-row>
                <v-btn block class="pay-btn mt-4" large @click="toStatus">Төлбөр төлөх</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.cart-main-card {
  border-radius: 1.5rem;
  background: #f7fafd;
}
.food-item-card {
  border: 1px solid #e3e7ee;
  border-radius: 1rem;
  padding: 12px 8px;
  background: #fff;
  transition: box-shadow 0.2s;
}
.food-item-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}
.pay-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white !important;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 0.8rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  text-transform: none;
}
.v-stepper {
  border-radius: 1rem;
  background-color: #fff;
  padding: 1rem 1.5rem;
}
.v-stepper-step {
  font-size: 1rem;
  font-weight: 600;
}
.text-sm {
  font-size: 0.85rem;
  color: #606a80;
}
.text-base {
  font-size: 1rem;
}
.v-text-field input {
  font-weight: 500;
  font-size: 0.95rem;
}
</style>

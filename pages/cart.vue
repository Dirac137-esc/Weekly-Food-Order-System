<script setup lang="ts">
import { ref, computed } from 'vue'

const step = ref(3) 

const items = ref([
  {
    id: 1,
    name: 'Будаатай хуурга',
    desc: 'Үхрийн мах, ногоо',
    size: 'Том',
    price: 12000,
    qty: 1,
    img: 'zurag/1.jpg'
  },
  {
    id: 2,
    name: 'Гоймон',
    desc: 'Тахианы мах, ногоо',
    size: 'Дунд',
    price: 9000,
    qty: 2,
    img: 'zurag/2.jpg'
  }
])

const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))
const delivery = ref(5000)
const total = computed(() => subtotal.value + delivery.value)

function increment(idx: number) {
  items.value[idx].qty++
}
function decrement(idx: number) {
  if (items.value[idx].qty > 1) items.value[idx].qty--
}
function remove(idx: number) {
  items.value.splice(idx, 1)
}
function removeAll() {
  items.value = []
}
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="8" class="pa-6 cart-main-card">
          <!-- Stepper -->
          <v-row>
            <v-col cols="12">
              <v-stepper v-model="step" class="mb-8" flat>
                <v-stepper-header>
                  <v-stepper-step :complete="step > 1" step="1">Захиалга</v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step :complete="step > 2" step="2">Төлбөр</v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step step="4">Хянах</v-stepper-step>
                </v-stepper-header>
              </v-stepper>
            </v-col>
          </v-row>
          <!-- Main Content -->
          <v-row>
            <!-- Items (хоол) -->
            <v-col cols="12" md="7">
              <v-card class="pa-4 mb-4" outlined>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="font-weight-bold">Хоолнууд ({{ items.length }} нэр төрөл)</span>
                  <v-btn text color="error" @click="removeAll" class="text-caption">Бүгдийг устгах</v-btn>
                </div>
                <v-divider class="mb-3"/>
                <div v-for="(item, idx) in items" :key="item.id" class="food-item-card mb-3">
                  <v-row align="center" no-gutters>
                    <v-col cols="3" class="pr-2">
                      <v-img :src="item.img" height="60" contain class="rounded-lg"></v-img>
                    </v-col>
                    <v-col cols="6">
                      <div class="font-weight-bold">{{ item.name }}</div>
                      <div class="text-caption grey--text">{{ item.desc }}</div>
                      <div class="text-caption grey--text">Хэмжээ: {{ item.size }}</div>
                    </v-col>
                    <v-col cols="3" class="d-flex flex-column align-end">
                      <div class="d-flex align-center mb-1">
                        <v-btn icon size="small" @click="decrement(idx)">
                          <v-icon>mdi-minus</v-icon>
                          </v-btn>
                        <span class="mx-2">{{ item.qty }}</span>
                        <v-btn icon size="small" @click="increment(idx)">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                      <div class="font-weight-bold">{{ item.price * item.qty }}₮</div>
                      <v-btn icon color="error" size="x-small" @click="remove(idx)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
              <!-- Захиалах хэсэг -->
              <v-card class="pa-4" outlined>
                <div class="font-weight-bold mb-2">Захиалгын хураангуй</div>
                <v-divider class="mb-2"/>
                <v-row>
                  <v-col cols="7" class="text-caption">Нийлбэр</v-col>
                  <v-col cols="5" class="text-right">{{ subtotal }}₮</v-col>
                  <v-col cols="7" class="text-caption">Хүргэлт</v-col>
                  <v-col cols="5" class="text-right">5000₮</v-col>
                </v-row>
                <v-divider class="my-2"/>
                <v-row>
                  <v-col cols="7" class="font-weight-bold">Нийт үнэ</v-col>
                  <v-col cols="5" class="text-right font-weight-bold">{{ total }}₮</v-col>
                </v-row>
              </v-card>
            </v-col>
            <!-- Төлбөрийн хэсэг -->
            <v-col cols="12" md="5">
              <v-card class="pa-6" outlined>
                <div class="font-weight-bold mb-4">Төлбөр төлөх</div>
                <div class="d-flex align-center mb-4">
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" height="28" width="10" class="mr-2"/>
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="28" width="45" class="mr-2"/>
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="28" width="44"/>
                </div>
                <v-text-field label="Карт эзэмшигчийн нэр" type="text" maxlength="25" placeholder="Таны нэр" autocomplete="name" dense outlined class="mb-2"/>
                <v-text-field label="Картын дугаар" type="tel" inputmode="numeric" pattern="[0-9\s]{13,19}" autocomplete="cc-number" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" required dense outlined class="mb-2"/>
                <v-row>
                  <v-col cols="6">
                    <v-text-field label="Дуусах огноо" type="month" dense outlined/>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="CVC" maxlength="3" placeholder="000" dense outlined/>
                  </v-col>
                </v-row>
                <v-btn block color="primary" href="" class="pay-btn mt-4" large>Төлбөр төлөх</v-btn>
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
  background: #f9fbfd;
}
.food-item-card {
  border: 1px solid #e3e7ee;
  border-radius: 1rem;
  padding: 12px 8px;
  background: #fff;
  transition: box-shadow 0.2s;
}
.food-item-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.pay-btn {
  background: linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eac9 100%);
  color: #fff !important;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  text-transform: none;
}
</style>
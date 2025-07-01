<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container class="pt-10 py-6" style="max-width: 600px">
        <v-btn-toggle v-model="orderType" class="mb-4" rounded group>
          <v-btn value="delivery">Хүргэлтээр</v-btn>
          <v-btn value="pickup">Очиж авах</v-btn>
        </v-btn-toggle>

        <v-card class="pa-3 mb-4" outlined>
          <v-row>
            <v-col>
              <div class="text-subtitle-1">
                <strong>{{ address.name }}</strong>
              </div>
              <div class="text-caption grey--text">Хаяг: {{ address.details }}</div>
            </v-col>
          </v-row>
        </v-card>

        <v-btn-toggle v-model="orderTime" class="mb-4" rounded group>
          <v-btn value="now">Яг одоо</v-btn>
          <v-btn value="schedule">Урьдчилж захиалах</v-btn>
        </v-btn-toggle>

        <v-card class="pa-4 mb-4" outlined elevation="2">
          <div class="mb-3 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-cart</v-icon>
            <span class="font-weight-bold text-h6">Миний сагс</span>
            <v-chip color="primary" size="small" class="ml-2">{{ item.qty }} ширхэг</v-chip>
          </div>

          <v-row align="center" no-gutters class="cart-item">
            <v-col cols="auto" class="mr-4">
              <div class="item-image-container">
                <v-img 
                  :src="item.photo" 
                  max-width="80" 
                  max-height="80" 
                  class="rounded-lg elevation-2"
                  cover
                  :alt="item.name"
                >
                  <template v-slot:error>
                    <div class="image-placeholder d-flex align-center justify-center">
                      <v-icon size="40" color="grey-lighten-1">mdi-food</v-icon>
                    </div>
                  </template>
                  <template v-slot:placeholder>
                    <div class="image-placeholder d-flex align-center justify-center">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>

            <v-col>
              <div class="mb-2">
                <div class="font-weight-bold text-subtitle-1 mb-1">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">Нэгж үнэ: {{ item.price.toLocaleString() }}₮</div>
              </div>
              
              <div class="quantity-controls d-flex align-center">
                <v-btn 
                  icon 
                  size="small"
                  variant="outlined"
                  color="error"
                  :disabled="item.qty <= 1"
                  @click="decrement"
                  class="quantity-btn"
                >
                  <v-icon size="18">mdi-minus</v-icon>
                </v-btn>
                
                <div class="quantity-display mx-3 px-3 py-1 text-center font-weight-bold">
                  {{ item.qty }}
                </div>
                
                <v-btn 
                  icon 
                  size="small"
                  variant="outlined"
                  style="color: #325EAF"
                  @click="increment"
                  class="quantity-btn"
                >
                  <v-icon size="18">mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col cols="auto" class="text-right">
              <div class="item-total">
                <div class="text-caption text-medium-emphasis mb-1">Нийт дүн</div>
                <div class="font-weight-bold text-h6 text-primary">
                  {{ (item.price * item.qty).toLocaleString() }}₮
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="pa-4 mb-4" outlined>
          <div class="mb-3 d-flex align-center">
            <v-icon color="orange" class="mr-2">mdi-gift</v-icon>
            <span class="font-weight-bold text-h6">Хөнгөлөлт сонгох</span>
            <v-chip 
              v-if="selectedCoupons.length > 0" 
              style="color: #325EAF"
              size="small" 
              class="ml-2"
            >
              {{ selectedCoupons.length }} сонгосон
            </v-chip>
          </div>

          <div class="coupon-list">
            <v-card
              v-for="coupon in coupons"
              :key="coupon.id"
              class="mb-3 coupon-card"
              :class="{ 'coupon-selected': selectedCoupons.includes(coupon.id) }"
              :color="selectedCoupons.includes(coupon.id) ? 'success' : 'default'"
              :variant="selectedCoupons.includes(coupon.id) ? 'tonal' : 'outlined'"
              @click="toggleCoupon(coupon.id)"
              style="cursor: pointer; transition: all 0.3s ease;"
            >
              <v-card-text class="py-3">
                <v-row align="center" no-gutters>
                  <v-col cols="auto" class="mr-3">
                    <v-icon 
                      :color="selectedCoupons.includes(coupon.id) ? 'success' : '#325EAF'" 
                      size="24"
                    >
                      {{ selectedCoupons.includes(coupon.id) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                  </v-col>
                  
                  <v-col>
                    <div class="font-weight-bold mb-1">{{ coupon.label }}</div>
                    <div class="text-caption text-medium-emphasis mb-1">{{ coupon.description }}</div>
                    <v-chip 
                      color="error" 
                      size="small" 
                      variant="tonal"
                      prepend-icon="mdi-tag"
                    >
                      -{{ coupon.amount.toLocaleString() }}₮
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>

          <v-divider v-if="totalDiscount > 0" class="my-3"></v-divider>
          <v-row v-if="totalDiscount > 0" justify="space-between" align="center">
            <v-col>
              <span class="font-weight-medium" style="color: #325EAF">
                <v-icon style="color: #325EAF" size="small" class="mr-1">mdi-tag-check</v-icon>
                Нийт хөнгөлөлт
              </span>
            </v-col>
            <v-col cols="auto">
              <span class="font-weight-bold" style="color: #325EAF" text-h6>
                -{{ totalDiscount.toLocaleString() }}₮
              </span>
            </v-col>
          </v-row>
        </v-card>

        <v-radio-group v-model="vatType" class="mb-4">
          <v-radio label="Хувь хүн" value="person" />
          <v-radio label="Байгууллага" value="company" />
        </v-radio-group>

        <v-textarea label="Захиалгатай холбоотой нэмэлт тэмдэглэл бичих" variant="outlined" rows="2" class="mb-4" />

        <v-card class="pa-4 mb-4" outlined>
          <v-row v-for="(label, key) in totals" :key="key" justify="space-between" class="mb-1">
            <span>{{ label.label }}</span>
            <span><strong>{{ label.amount.toLocaleString() }} ₮</strong></span>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <v-row justify="space-between">
            <span class="font-weight-bold">ТӨЛӨХ НИЙТ ДҮН</span>
            <span class="font-weight-bold">{{ totalAmount.toLocaleString() }} ₮</span>
          </v-row>
        </v-card>

        <v-btn color="primary" block large>Төлбөр төлөх</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/navbar.vue'

const orderType = ref('delivery')
const orderTime = ref('now')
const vatType = ref('person')

const item = ref({
  name: 'Бекон криспи чикен',
  qty: 1,
  price: 11900,
  photo: '/zurag/1.jpg'
})

const increment = () => item.value.qty++
const decrement = () => {
  if (item.value.qty > 1) item.value.qty--
}

const address = ref({
  name: 'БЗД, 1-р хороо, Оршил лаунж',
  details: 'Нэмэлт мэдээлэл: -'
})

const coupons = ref([
  { 
    id: 'coupon1', 
    label: 'Шинэ хэрэглэгчийн купон', 
    description: 'Анхны захиалгад зориулсан тусгай хөнгөлөлт',
    amount: 5000 
  },
  { 
    id: 'coupon2', 
    label: 'Амралтын өдрийн хөнгөлөлт', 
    description: 'Бямба, ням гарагт хүчинтэй',
    amount: 3000 
  },
  { 
    id: 'coupon3', 
    label: 'Төрсөн өдрийн урамшуулал', 
    description: 'Төрсөн өдөр хүчинтэй',
    amount: 7000 
  }
])

const selectedCoupons = ref([]) 

const toggleCoupon = (couponId) => {
  const index = selectedCoupons.value.indexOf(couponId)
  if (index > -1) {
    selectedCoupons.value.splice(index, 1)
  } else {
    selectedCoupons.value.push(couponId)
  }
}

const totalDiscount = computed(() => {
  return coupons.value
    .filter(coupon => selectedCoupons.value.includes(coupon.id))
    .reduce((acc, cur) => acc + cur.amount, 0)
})

const totals = computed(() => ({
  subtotal: {
    label: 'Захиалгын дүн',
    amount: item.value.price * item.value.qty
  },
  minfee: {
    label: 'Бага үнийн дүнтэй захиалгын төлбөр',
    amount: 1500
  },
  delivery: {
    label: 'Хүргэлтийн төлбөр',
    amount: 1100
  },
  discount: {
    label: 'Хөнгөлөлтийн дүн',
    amount: -totalDiscount.value
  },
  vat: {
    label: 'НӨАТ',
    amount: 0
  }
}))

const totalAmount = computed(() => {
  return Object.values(totals.value).reduce((acc, cur) => acc + cur.amount, 0)
})
</script>

<style scoped>
.coupon-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coupon-selected {
  border-color: #325EAF !important;
}

.coupon-list {
  max-height: 300px;
  overflow-y: auto;
}

.cart-item {
  padding: 8px 0;
}

.item-image-container {
  position: relative;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.quantity-controls {
  background-color: #fafafa;
  border-radius: 25px;
  padding: 4px;
  width: fit-content;
}

.quantity-btn {
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  transform: scale(1.1);
}

.quantity-display {
  background-color: white;
  border-radius: 15px;
  min-width: 40px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
}

.item-total {
  text-align: right;
  min-width: 100px;
}

.delivery-info {
  background-color: #f8fffe;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0 -4px;
}
</style>
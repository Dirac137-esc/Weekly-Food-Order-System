<template>
  <v-container class="pt-16 premium-container">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap"
      rel="stylesheet"
    />
    
    <!-- Your original title with premium styling -->
    <div class="title-section">
      <h1 class="main-title">
        Таны сонгосон өдөр :
        <span class="gradient-text">{{ daysMn[sliderday] }}</span>
      </h1>
    </div>

    <!-- Your original carousel with premium styling -->
    <div class="carousel-container">
      <v-carousel hide-delimiters class="premium-carousel">
        <v-carousel-item v-for="item in menu[days[sliderday]]" :key="item._id">
          <v-img :src="item.imageUrl" cover class="carousel-image"></v-img>
        </v-carousel-item>
      </v-carousel>
    </div>

    <!-- Your original slider with premium styling -->
    <div class="slider-container">
      <v-slider
        v-model="sliderday"
        :max="6"
        :step="1"
        :ticks="daysMn"
        :color="sliderday == today ? '#10B981' : '#6366F1'"
        :track-color="sliderday == today ? '#D1FAE5' : '#E0E7FF'"
        density="compact"
        show-ticks="always"
        thumb-size="15"
        class="premium-slider"
      >
      </v-slider>
    </div>

    <!-- Your original food grid with premium styling -->
    <v-row>
      <v-col
        v-for="item in menu[days[sliderday]]"
        :key="item._id"
        cols="12"
        md="4"
      >
        <v-card 
          class="premium-card"
          :class="{ 'today-special': sliderday === today }"
          :style="sliderday === today ? 'box-shadow: 0px 0px 20px rgba(16, 185, 129, 0.4);' : ''"
        >
          <v-img :src="item.imageUrl" height="200px" cover class="card-image"></v-img>
          <v-card-title class="card-title-section">
            <v-icon :color="today === sliderday ? `#10B981` : `#6366F1`" size="20" class="food-icon"
              >mdi-food</v-icon
            >
            {{ item.name }}
          </v-card-title>
          <v-card-subtitle class="card-subtitle">
            {{ item.ingredients?.join(", ") }}
          </v-card-subtitle>
          <v-card-text class="card-price">Үнэ: {{ item?.price }}₮</v-card-text>
          <v-card-actions class="justify-center card-actions">
            <v-btn
              :disabled="sliderday < today"
              color="white"
              class="add-btn"
              @click="cartStore.addItem(item._id, item)"
            >
              <v-icon icon="mdi-plus"></v-icon>
            </v-btn>
            <v-btn
              class="remove-btn"
              :disabled="sliderday < today"
              color="white"
              @click="cartStore.decreaseItem(item._id)"
            >
              <v-icon icon="mdi-minus"></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Your original divider -->
    <v-divider class="my-4 premium-divider" />

    <!-- Your original total section with premium styling -->
    <v-row>
      <v-col class="d-flex justify-space-between mb-5">
        <h2 class="section-title">Нийт</h2>
        <h2 class="total-amount">{{ cartStore.total }} төгрөг</h2>
      </v-col>
    </v-row>

    <!-- Your original table with premium styling -->
    <v-table class="premium-table">
      <thead>
        <tr class="table-header">
          <th class="text-center">Нэр</th>
          <th class="text-center">Үнэ</th>
          <th class="text-center">Ширхэг</th>
          <th class="text-center">Тус хоолны нийт үнийн дүн</th>
          <th class="text-center">Устгах уу ?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[_id, { item, quantity }] in cartStore.cart" :key="_id" class="table-row">
          <td class="text-center item-name">
            {{ item?.name.charAt(0).toUpperCase() + item?.name.slice(1) }}
          </td>
          <td class="text-center item-price">{{ item?.price }}</td>
          <td class="text-center item-quantity">{{ quantity }}</td>
          <td class="text-center item-total">{{ item?.price * quantity }}</td>
          <td class="text-center">
            <v-btn color="red" @click="cartStore.removeItem(_id)" class="remove-btn-table">Устгах</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Your original continue button with premium styling -->
    <v-row class="justify-end">
      <v-col cols="auto" class="mt-5">
        <v-btn class="continue-btn" @click="goCart"
          >Үргэлжлүүлэх</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useCartStore } from "../stores/cart.ts";
import { onMounted, ref } from "vue";
import { useRouter } from "#imports";

const cartStore = useCartStore();
const router = useRouter();
const sliderday = ref((new Date().getDay() + 6) % 7);
const today = ref((new Date().getDay() + 6) % 7);
const days = {
  0: "monday",
  1: "tuesday",
  2: "wednesday",
  3: "thursday",
  4: "friday",
  5: "saturday",
  6: "sunday",
};

const daysMn = {
    0 : "Даваа ",
    1 : "Мягмар",
    2 : "Лхагва",
    3 : "Пүрэв",
    4 : "Баасан",
    5 : "Бямба",
    6 : "Ням"
}
let menu = ref([]);

async function fetchData() {
  // console.log(`Bearer ${localStorage.getItem("token")}`);
  try {
    const res = await fetch(
      "https://backend-production-88df.up.railway.app/menus",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    menu.value = json[0].days;
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  fetchData();
});

function goCart() {
  router.push("/cart");
}
</script>

<style>
/* Import premium fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');

/* Base font - keeping your JetBrains preference but with Inter fallback */
* {
  font-family: 'JetBrains Mono', 'Inter', sans-serif;
}


/* Title section - your original with premium styling */
.title-section {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.main-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 600;
  color: white;
  padding: 2rem 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Carousel - your original with premium styling */
.carousel-container {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.premium-carousel {
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.carousel-image {
  transition: transform 0.3s ease;
  filter: brightness(0.9) contrast(1.1);
}

/* Slider - your original with premium styling */
.slider-container {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.premium-slider {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.v-slider-thumb {
  transition: 0.5s ease !important;
  transition-property: left, transform !important;
}

.v-slider-track__fill {
  transition: 0.5s ease !important;
  transition-property: width, transform !important;
}

/* Cards - your original structure with premium styling */
.premium-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  margin-bottom: 1.5rem;
}

.premium-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.today-special {
  border: 2px solid #10B981;
}

.card-image {
  transition: transform 0.3s ease;
}

.premium-card:hover .card-image {
  transform: scale(1.05);
}

.card-title-section {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #1F2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.food-icon {
  transition: transform 0.3s ease;
}

.premium-card:hover .food-icon {
  transform: rotate(360deg);
}

.card-subtitle {
  color: #6B7280;
  font-size: 0.9rem;
}

.card-price {
  font-weight: 600;
  color: #059669;
  font-size: 1.1rem;
}

.card-actions {
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.add-btn {
  background: linear-gradient(135deg, #10B981, #059669) !important;
  color: white !important;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-2px);
}

.remove-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626) !important;
  color: white !important;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: linear-gradient(135deg, #DC2626, #B91C1C) !important;
  transform: translateY(-2px);
}

/* Divider */
.premium-divider {
  border-color: rgba(255, 255, 255, 0.3);
  margin: 2rem 0;
}

/* Section titles */
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.total-amount {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Table - your original with premium styling */
.premium-table {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.table-header {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
}

.table-header th {
  color: white !important;
  font-weight: 600;
  padding: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.table-row {
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: rgba(99, 102, 241, 0.05);
}

.table-row td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.item-name {
  font-weight: 600;
  color: #1F2937;
}

.item-price, .item-total {
  font-weight: 500;
  color: #059669;
}

.item-quantity {
  font-weight: 600;
  color: #6366F1;
}

.remove-btn-table {
  background: linear-gradient(135deg, #EF4444, #DC2626) !important;
  color: white !important;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.remove-btn-table:hover {
  background: linear-gradient(135deg, #DC2626, #B91C1C) !important;
  transform: translateY(-2px);
}

/* Continue button - your original with premium styling */
.continue-btn {
  background: linear-gradient(135deg, #10B981, #059669) !important;
  color: white !important;
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.continue-btn:hover {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .premium-container {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .premium-table {
    font-size: 0.9rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
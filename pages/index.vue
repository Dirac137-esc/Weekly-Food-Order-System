<template>
  <v-container class="pt-16">
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <h1 class="py-3">Өнөөдөр : {{ days[sliderday].charAt(0).toUpperCase() + days[sliderday].slice(1) }}</h1>

    <v-slider
      v-model="sliderday"
      :max="6"
      :step="1"
      :ticks="days"
      :color="sliderday == today ? 'success' : 'primary'"
      density="compact"
      show-ticks="always"
      thumb-size="15"
    >
    </v-slider>

    <v-row>
      <v-col v-for="item in menu[days[sliderday]]" :key="item._id" cols="12" md="4">
        <!-- Тухайн ямарваа нэгэн барааг тодосгохыг хүсвэл v-card дээр нэмэх css -->
        <!-- :style="sliderday === today ? 'box-shadow: 0px 0px 10px rgba(10, 255, 10, 0.5);' : ''" -->
        <v-card>
          <v-img :src="item.imageUrl" height="200px" cover></v-img>
          <v-card-title>
            <v-icon
              :color="today === sliderday ? `green` : `primary`"
              size="20"
            >mdi-food</v-icon>
            {{ item.name }}</v-card-title
          >
          <v-card-subtitle>
            {{ item.ingredients?.join(", ") }}
          </v-card-subtitle>
          <v-card-text>Үнэ: {{ item.price }}₮</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              :disabled="sliderday < today"
              color="white"
              class="bg-success"
              @click="cartStore.addItem(item._id, item)"
            >
              <v-icon icon="mdi-plus"></v-icon>
            </v-btn>
            <v-btn
              class="bg-red"
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

    <v-divider class="my-4" />

    <v-row>
      <v-col class="d-flex justify-space-between mb-5">
        <h2>Нийт</h2>
        <h2>{{ cartStore.total }} төгрөг</h2>
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr class="bg-primary">
          <th class="text-center">Нэр</th>
          <th class="text-center">Үнэ</th>
          <th class="text-center">Ширхэг</th>
          <th class="text-center">Тус хоолны нийт үнийн дүн</th>
          <th class="text-center">Устгах уу ?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[_id, { item, quantity }] in cartStore.cart" :key="_id">
          <td class="text-center">
            {{ item?.name.charAt(0).toUpperCase() + item?.name.slice(1) }}
          </td>
          <td class="text-center">{{ item?.price }}</td>
          <td class="text-center">{{ quantity }}</td>
          <td class="text-center">{{ item?.price * quantity }}</td>
          <td class="text-center">
            <v-btn color="red" @click="cartStore.removeItem(_id)">Устгах</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-row class="justify-end">
      <v-col cols="auto" class="mt-5">
        <v-btn class="justify-end" color="success" @click="goCart"
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
.v-slider-thumb {
  transition: 0.5s ease !important;
  transition-property: left, transform !important;
}

.v-slider-track__fill {
  transition: 0.5s ease !important;
  transition-property: width, transform !important;
}
</style>

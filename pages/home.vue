<template>
  <v-container class="pt-16">
    <v-row>
      <v-col>
        <v-tabs v-model="sliderday" class="my-5" grow>
          <v-tab
            class="font-weight-bold text-body-1"
            v-for="(label, i) in daysMn"
            :key="i"
            :value="i"
          >
            {{ label }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="item in menu[days[sliderday]]"
        :key="item._id"
        cols="12"
        md="3"
      >
        <v-card rounded="lg">
          <v-img :src="item.imageUrl" height="180px" cover />

          <v-card-title class="d-flex ga-2 text-body-1 font-weight-bold">
            <v-icon
              :color="today === sliderday ? 'green' : 'primary'"
              size="20"
            >
              mdi-food
            </v-icon>
            {{ item.name }}
          </v-card-title>

          <v-card-subtitle>
            <div class="d-flex">
              <v-chip
                v-for="ingredient in item.ingredients"
                class="rounded-xl mr-1 text-caption"
                style="width: fit-content"
              >
                {{ ingredient }}
              </v-chip>
            </div>
          </v-card-subtitle>

          <div class="d-flex">
            <v-card-text class="text-h6 font-weight-bold">
              {{ item.price }}₮
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                :disabled="sliderday < today"
                color="white"
                class="bg-success"
                @click="cartStore.addItem(days[sliderday], item, sliderday)"
              >
                <v-icon icon="mdi-plus" />
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col class="d-flex justify-space-between mb-5">
        <h2 class="text-h6 font-weight-bold">Нийт</h2>
        <h2 class="text-h6 font-weight-bold">{{ cartStore.total }} төгрөг</h2>
      </v-col>
    </v-row>

    <v-table>
      <thead>
        <tr class="bg-primary text-white">
          <th class="text-center text-body-2 font-weight-bold">Өдөр</th>
          <th class="text-center text-body-2 font-weight-bold">Нэр</th>
          <th class="text-center text-body-2 font-weight-bold">Үнэ</th>
          <th class="text-center text-body-2 font-weight-bold">Ширхэг</th>
          <th class="text-center text-body-2 font-weight-bold">
            Тус хоолны нийт үнийн дүн
          </th>
          <th class="text-center text-body-2 font-weight-bold">Устгах уу ?</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ day, item, quantity, sliderDay } in cartStore.cartItems"
          :key="`${day}-${item.id}`"
        >
          <td class="text-center text-body-2">{{ daysMn[sliderDay] }}</td>
          <td class="text-center text-body-2">
            {{ item?.name.charAt(0).toUpperCase() + item?.name.slice(1) }}
          </td>
          <td class="text-center text-body-2">{{ item?.price }}</td>
          <td class="text-center text-body-2">{{ quantity }}</td>
          <td class="text-center text-body-2">{{ item?.price * quantity }}</td>
          <td class="text-center">
            <v-btn color="red" @click="cartStore.removeItem(day, item.id)">
              Устгах
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-row class="justify-end">
      <v-col cols="auto" class="mt-5">
        <v-btn class="justify-end" color="success" @click="goCart">
          Үргэлжлүүлэх
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { useCartStore } from "../stores/cart";
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
  0: "Даваа ",
  1: "Мягмар",
  2: "Лхагва",
  3: "Пүрэв",
  4: "Баасан",
  5: "Бямба",
  6: "Ням",
};
let menu = ref([]);
definePageMeta({
  middleware: "auth",
});
async function fetchData() {
  // console.log(`Bearer ${localStorage.getItem("token")}`);
  try {
    const res = await fetch(
      "https://backend-production-25f11.up.railway.app/menus/this-week",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    menu.value = json.days;
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  fetchData();
  console.log();
});

function goCart() {
  router.push("/order");
}
</script>

<template>
  <v-container class="pt-16">
    <h1 class="py-3">Долоо хоногийн хоолны цэс </h1>

    <v-slider
      v-model="sliderday"
      :max="6"
      :step="1"
      :ticks="days"
      :color="sliderday == today ? 'success' : 'primary'"
      density="compact"
      show-ticks="always"
      thumb-size="10"
    >
    </v-slider>

    <v-row>
      <v-col
        v-for="item in menu[days[sliderday]]"
        :key="item.id"
        cols="12"
        md="4"
      >
        <!-- Тухайн ямарваа нэгэн барааг тодосгохыг хүсвэл v-card дээр нэмэх css -->
        <!-- :style="sliderday === today ? 'box-shadow: 0px 0px 10px rgba(10, 255, 10, 0.5);' : ''" -->
        <v-card>
          <v-img :src="item.photo" height="200px" cover></v-img>
          <v-card-title>{{
            item.name.charAt(0).toUpperCase() + item.name.slice(1)
          }}</v-card-title>
          <v-card-subtitle> {{ item.recipe.join(', ')  }} </v-card-subtitle>
          <v-card-text>Үнэ: {{ item.price }}₮</v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="sliderday < today"
              color="white"
              class="bg-green"
              @click="plus(item)"
            >
              <v-icon icon="mdi-plus"></v-icon>
            </v-btn>
            <v-btn
              class="bg-blue"
              :disabled="sliderday < today"
              color="primary"
              @click="minus(item)"
            >
              <v-icon icon="mdi-minus"></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h2>Нийт : {{ total }} төгрөг</h2>
    <v-table>
      <thead>
        <tr>
          <th class="text-center">Нэр</th>
          <th class="text-center">Үнэ</th>
          <th class="text-center">Ширхэг</th>
          <th class="text-center">Тус хоолны нийт үнийн дүн</th>
          <th class="text-center">Устгах уу ?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[item, freq] in cart">
          <td class="text-center">
            {{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }}
          </td>
          <td class="text-center">{{ item.price }}</td>
          <td class="text-center">{{ freq }}</td>
          <td class="text-center">{{ item.price * freq }}</td>
          <td class="text-center">
            <v-btn @click="removeItem(item, freq)">Устгах</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup >
const sliderday = ref(new Date().getDay() - 1);
const today = ref((new Date().getDay() + 6)%7);
const total = ref(0);
const cart = ref(new Map());

function removeItem(item, freq) {
  total.value -= freq * item.price;
  cart.value.delete(item);
}
function plus(item) {
  if (!cart.value.has(item)) {
    cart.value.set(item, 0);
  }
  cart.value.set(item, cart.value.get(item) + 1);
  total.value += item.price;
}
function minus(item) {
  if (cart.value.get(item)) {
    cart.value.set(item, cart.value.get(item) - 1);
    total.value -= item.price;
  }
  if (cart.value.get(item) === 0) {
    cart.value.delete(item);
  }
}
const menu = {
  MON: [
    {
      id: 1,
      name: "burger",
      price: 14320,
      photo: "/zurag/burger.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "fries",
      price: 16870,
      photo: "/zurag/fries.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "cola",
      price: 11230,
      photo: "/zurag/cola.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  TUE: [
    {
      id: 1,
      name: "pizza",
      price: 17890,
      photo: "/zurag/1.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "salad",
      price: 13500,
      photo: "/zurag/2.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "juice",
      price: 14990,
      photo: "/zurag/3.png",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  WED: [
    {
      id: 1,
      name: "sushi",
      price: 19750,
      photo: "/zurag/sushi.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "ramen",
      price: 15860,
      photo: "/zurag/ramen.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "green tea",
      price: 12440,
      photo: "/zurag/tea.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  THU: [
    {
      id: 1,
      name: "steak",
      price: 17220,
      photo: "/zurag/steak.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "mashed potatoes",
      price: 10980,
      photo: "/zurag/potatoes.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "water",
      price: 11400,
      photo: "/zurag/water.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  FRI: [
    {
      id: 1,
      name: "tacos",
      price: 13210,
      photo: "/zurag/tacos.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "nachos",
      price: 18570,
      photo: "/zurag/nachos.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "lemonade",
      price: 12330,
      photo: "/zurag/lemonade.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  SAT: [
    {
      id: 1,
      name: "pancakes",
      price: 15340,
      photo: "/zurag/pancakes.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "bacon",
      price: 19000,
      photo: "/zurag/bacon.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "coffee",
      price: 13660,
      photo: "/zurag/coffee.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
  SUN: [
    {
      id: 1,
      name: "dumplings",
      price: 30000,
      photo: "/zurag/dumplings.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 2,
      name: "noodles",
      price: 25000,
      photo: "/zurag/noodles.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
    {
      id: 3,
      name: "milk tea",
      price: 11110,
      photo: "/zurag/milktea.jpg",
      recipe: ["Beef" ,"patty", "lettuce", "tomato", "cheese"," bun"],
    },
  ],
};

const days = {
  0: "MON",
  1: "TUE",
  2: "WED",
  3: "THU",
  4: "FRI",
  5: "SAT",
  6: "SUN",
};
</script>

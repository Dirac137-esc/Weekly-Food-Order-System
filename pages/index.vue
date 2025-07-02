<template>
  <v-container class="pt-16">
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <h1 class="py-3">Өнөөдөр : {{ days[today] }}</h1>

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
          <v-card-title>
            <v-icon :color="today === sliderday && green" size="20">
              mdi-food
            </v-icon>
            {{
              item.name.charAt(0).toUpperCase() + item.name.slice(1)
            }}</v-card-title
          >
          <v-card-subtitle> {{ item.recipe.join(", ") }} </v-card-subtitle>
          <v-card-text>Үнэ: {{ item.price }}₮</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              :disabled="sliderday < today"
              color="white"
              class="bg-success"
              @click="plus(item)"
            >
              <v-icon icon="mdi-plus"></v-icon>
            </v-btn>
            <v-btn
              class="bg-red"
              :disabled="sliderday < today"
              color="white"
              @click="minus(item)"
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
        <h2>{{ total }} төгрөг</h2>
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
        <tr v-for="[item, freq] in cart">
          <td class="text-center">
            {{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }}
          </td>
          <td class="text-center">{{ item.price }}</td>
          <td class="text-center">{{ freq }}</td>
          <td class="text-center">{{ item.price * freq }}</td>
          <td class="text-center">
            <v-btn color="red" @click="removeItem(item, freq)">Устгах</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-row class="justify-end">
      <v-col cols="auto" class="mt-5">
         <v-btn class="justify-end" color="success" @click="goCart">Үргэлжлүүлэх</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const router = useRouter()
const sliderday = ref((new Date().getDay() + 6) % 7);
const today = ref((new Date().getDay() + 6) % 7);
const total = ref(0);
const cart = ref(new Map());

function goCart()
{
    router.push('/cart')
}

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
      photo:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      recipe: ["Говь", "Салад", "Улаан лооль", "Бяслаг", "Талх"],
    },
    {
      id: 2,
      name: "fries",
      price: 16870,
      photo:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnJpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Төмс", "Давс", "Халуун ногоо", "Сармис"],
    },
    {
      id: 3,
      name: "cola",
      price: 11230,
      photo:
        "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sYSUyMGRyaW5rfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      recipe: ["Кола", "Хийн ундаа", "Мөс"],
    },
  ],
  TUE: [
    {
      id: 1,
      name: "pizza",
      price: 17890,
      photo:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гурил", "Бяслаг", "Төмс", "Монгол бяслаг"],
    },
    {
      id: 2,
      name: "salad",
      price: 13500,
      photo:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Салад", "Оливын тос", "Уксус", "Ногоо"],
    },
    {
      id: 3,
      name: "juice",
      price: 14990,
      photo:
        "https://images.unsplash.com/photo-1623401523800-2e3b5dd2e6f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8anVpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Жүүс", "Жимс", "Чихэр"],
    },
  ],
  WED: [
    {
      id: 1,
      name: "sushi",
      price: 19750,
      photo:
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Загас", "Будаа", "Хүрэн манжин", "Соус"],
    },
    {
      id: 2,
      name: "ramen",
      price: 15860,
      photo:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFtZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гоймон", "Шөл", "Өндөг", "Мах"],
    },
    {
      id: 3,
      name: "green tea",
      price: 12440,
      photo:
        "https://images.unsplash.com/photo-1559177697-9b0b0c053b33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Ногоон цай", "Ус", "Чихэр"],
    },
  ],
  THU: [
    {
      id: 1,
      name: "steak",
      price: 17220,
      photo:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гахайн мах", "Халуун ногоо", "Сармис", "Давс"],
    },
    {
      id: 2,
      name: "mashed potatoes",
      price: 10980,
      photo:
        "https://images.unsplash.com/photo-1510629954389-c1e0da47d414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFzaGVkJTIwcG90YXRvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Төмс", "Сүү", "Цөцгий", "Сармис"],
    },
    {
      id: 3,
      name: "water",
      price: 11400,
      photo:
        "https://images.unsplash.com/photo-1544003484-3cd181d17917?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Ус", "Мөс", "Лимон"],
    },
  ],
  FRI: [
    {
      id: 1,
      name: "tacos",
      price: 13210,
      photo:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Талх", "Мах", "Салад", "Соус"],
    },
    {
      id: 2,
      name: "nachos",
      price: 18570,
      photo:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmFjaG9zfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      recipe: ["Хуурга", "Бяслаг", "Соус", "Халуун ногоо"],
    },
    {
      id: 3,
      name: "lemonade",
      price: 12330,
      photo:
        "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVtb25hZGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Лимон", "Чихэр", "Ус", "Мөс"],
    },
  ],
  SAT: [
    {
      id: 1,
      name: "pancakes",
      price: 15340,
      photo:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuY2FrZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гурил", "Сүү", "Өндөг", "Жимс"],
    },
    {
      id: 2,
      name: "bacon",
      price: 19000,
      photo:
        "https://images.unsplash.com/photo-1588347817796-a8c1706e6d82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFjb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гахайн мах", "Давс", "Хатаасан", "Халуун ногоо"],
    },
    {
      id: 3,
      name: "coffee",
      price: 13660,
      photo:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      recipe: ["Кофе", "Сүү", "Чихэр", "Мөс"],
    },
  ],
  SUN: [
    {
      id: 1,
      name: "dumplings",
      price: 30000,
      photo:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHVtcGxpbmdzfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гурил", "Мах", "Сонгино", "Сармис"],
    },
    {
      id: 2,
      name: "noodles",
      price: 25000,
      photo:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Гоймон", "Мах", "Хөвөн", "Ногоо"],
    },
    {
      id: 3,
      name: "milk tea",
      price: 11110,
      photo:
        "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      recipe: ["Цай", "Сүү", "Чихэр", "Мөс"],
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

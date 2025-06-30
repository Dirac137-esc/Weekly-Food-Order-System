<template>
  <v-container>
    <h1>Order</h1>
    <v-row>
      <v-col v-for="item in foods" :key="item.id" cols="12" md="4">
        <v-card>
          <v-img :src="item.photo" height="200px" cover></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>Price: {{ item.price }}₮</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="add(item)">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4" />
    <h2>Cart</h2>
    <v-list>
      <v-list-item v-for="(item, index) in cart" :key="index">
        {{ item.name }} - {{ item.price }}₮
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
const foods = [
  {
    id: 1,
    name: 'Hool1',
    price: 3,
    photo: '/zurag/1.jpg'
  },
  {
    id: 2,
    name: 'Hool2',
    price: 2,
    photo: '/zurag/2.jpg'
  },
  {
    id: 3,
    name: 'Hool3',
    price: 1,
    photo: '/zurag/3.png'
  },
]

const cart = ref([])

function add(item) {
  cart.value.push(item)
}
</script>

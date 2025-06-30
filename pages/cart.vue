<script setup lang="ts">
import { ref, computed } from 'vue';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const cartItems = ref<CartItem[]>([
  { id: 1, name: 'burger1', price: 3, quantity: 2 },
  { id: 2, name: 'burger2', price: 2, quantity: 1 },
  { id: 3, name: 'burger3', price: 1, quantity: 3 },
]);

const total = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function removeItem(id: number) {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
}
</script>

<template>
    <h1>Сагс</h1>
  <div>
    <table>
      <thead>
        <tr>
          <th>Хоол</th>
          <th>Тоо</th>
          <th>Үнэ</th>
          <th>Нийт</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price }}₮</td>
          <td>{{ item.price * item.quantity }}₮</td>
          <td>
            <button @click="removeItem(item.id)">Устгах</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="total">
      <strong>Нийт дүн:</strong> {{ total }}₮
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
}
table {
  width: 100%;
  padding: 2%;
  margin-bottom: 20px;
  font-size: 110%;
}
th, td {
  border: 1px solid #ddd;
  padding: 2%;
  text-align: center;
}
th {
  background: #455ece;
}
.total {
  text-align: right;
  font-size: 1.2em;
  margin-right: 10px;
}
button {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background: #c0392b;
}
</style>
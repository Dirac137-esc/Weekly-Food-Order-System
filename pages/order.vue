<template>
  <v-app>
    <v-main>
      <v-container class="pt-10" style="max-width: 1200px">
        <v-row dense>
          <v-col cols="12" md="7">
            <Cart />
          </v-col>
          <v-col cols="12" md="5">
            <Totals />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import Cart from "~/components/cart/cart.vue";
import Totals from "~/components/cart/totals.vue";

// Хувируулах утгууд
</script>

<style scoped>
.cart-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 8px;
}

.coupon-card {
  border: 1px solid #e3e7ee;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coupon-selected {
  background: #e8f0ff;
  border-color: #325eaf !important;
}

.sticky-payment {
  position: sticky;
  top: 40px;
  z-index: 10;
}
</style>

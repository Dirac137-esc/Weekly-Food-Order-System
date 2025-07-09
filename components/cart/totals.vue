<template>
  <!-- <v-btn-toggle v-model="orderType" class="mb-4" rounded group>
    <v-btn value="delivery">Хүргэлтээр</v-btn>
    <v-btn value="pickup">Очиж авах</v-btn>
  </v-btn-toggle> -->
  <v-card class="pa-7 mb-4" outlined>
    <v-row v-for="(t, k) in totals" :key="k" justify="space-between">
      <span class="my-1">{{ t.label }}</span>
      <span
        ><strong>{{ t.amount.toLocaleString() }}₮</strong></span
      >
    </v-row>
    <v-divider class="my-5" />
    <v-row justify="space-between">
      <span class="font-weight-bold">ТӨЛӨХ НИЙТ ДҮН</span>
      <span class="font-weight-bold">{{ totalAmount.toLocaleString() }}₮</span>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { useCartStore } from "#imports";
const orderType = ref<"delivery" | "pickup">("delivery");
let cartStore = useCartStore();

const totals = computed(() => {
  const subtotal = cartStore.total;
  const minFee = subtotal < 0 ? 0 : 0;
  const deliveryFee = orderType.value === "delivery" ? 0 : 0;

  //   const vat = vatType.value === "company" ? Math.round(subtotal * 0.1) : 0;
  return {
    subtotal: { label: "Захиалгын дүн", amount: subtotal },
    minfee: { label: "Бага үнэтэй", amount: minFee },
    delivery: { label: "Хүргэлтийн үнэ", amount: deliveryFee },
    // vat: { label: "НӨАТ", amount: vat },
  };
});

const totalAmount = computed(() =>
  Object.values(totals.value).reduce((sum, t) => sum + t.amount, 0)
);
</script>

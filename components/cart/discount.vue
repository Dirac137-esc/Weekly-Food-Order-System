<template>
  <v-card class="pa-4 mb-4" outlined>
    <div class="font-weight-bold mb-2">Хөнгөлөлт</div>
    <div v-for="coupon in coupons" :key="coupon.id" class="mb-3">
      <v-card
        outlined
        class="coupon-card"
        :class="{
          'coupon-selected': selectedCoupons.includes(coupon.id),
        }"
        @click="toggleCoupon(coupon.id)"
      >
        <v-card-text class="d-flex align-center">
          <v-icon
            v-if="selectedCoupons.includes(coupon.id)"
            color="error"
            class="mr-2"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-check"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
              /></svg
          ></v-icon>
          <v-icon v-else
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-square"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"
              /></svg
          ></v-icon>
          <div>
            <div class="font-weight-bold" style="padding-left: 6px">
              {{ coupon.label }}
            </div>
            <div class="text-caption" style="padding-left: 6px">
              {{ coupon.description }}
            </div>
          </div>
          <v-spacer />
          <v-chip small color="error" variant="tonal" prepend-icon="mdi-tag">
            -{{ coupon.amount.toLocaleString() }}₮
          </v-chip>
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useCartStore } from "#imports";

// Купон болон захиалгын мэдээлэл
const coupons = ref([
  {
    id: "coupon1",
    label: "Шинэ хэрэглэгчийн купон",
    description: "Анхны захиалгад зориулсан гавьяа",
    amount: 5000,
  },
  {
    id: "coupon2",
    label: "Амралтын өдрийн хөнгөлөлт",
    description: "Бямба, ням",
    amount: 3000,
  },
  {
    id: "coupon3",
    label: "Төрсөн өдрийн урамшуулал",
    description: "Төрсөн өдөр",
    amount: 7000,
  },
]);
const selectedCoupons = ref<string[]>([]);

// Купон тогтоох функц
function toggleCoupon(id: string) {
  const index = selectedCoupons.value.indexOf(id);
  if (index >= 0) {
    selectedCoupons.value.splice(index, 1);
  } else {
    selectedCoupons.value.push(id);
  }
}
</script>

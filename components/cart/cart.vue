<template>
  <v-card class="pa-4 mb-4" outlined>
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-cart</v-icon>
      <span class="font-weight-bold text-h6">Миний сагс</span>
      <v-chip color="primary" small class="ml-2"
        >{{ cartItemCount }} ширхэг</v-chip
      >
    </div>
    <div v-if="cartStore.cart.size === 0" class="text-center py-4">
      <v-icon size="48" color="grey-lighten-2">mdi-cart-off</v-icon>
      <div class="text-subtitle-1 grey--text mt-2">Сагс хоосон байна</div>
    </div>
    <div v-else>
      <div
        v-for="[day, items] in Array.from(cartStore.cart.entries())"
        :key="day"
      >
        <div
          v-for="({ item, quantity }, index) in items"
          :key="item.id || index"
          class="food-item-card mb-4 pa-3"
        >
          <v-row
            no-gutters
            class="cart-item py-3 px-2 align-center hover:bg-grey-lighten-4 rounded-lg mb-2"
          >
            <!-- Image -->
            <v-col cols="3">
              <v-img :src="item.imageUrl" height="70" class="rounded-lg" cover>
                <template #error>
                  <div
                    class="image-placeholder d-flex align-center justify-center grey-lighten-3 rounded-lg"
                    style="height: 70px"
                  >
                    <v-icon size="40" color="grey-lighten-1">mdi-food</v-icon>
                  </div>
                </template>
                <template #placeholder>
                  <div
                    class="image-placeholder d-flex align-center justify-center"
                    style="height: 70px"
                  >
                    <v-progress-circular indeterminate color="primary" />
                  </div>
                </template>
              </v-img>
            </v-col>

            <!-- Info -->
            <v-col cols="6" class="pl-3">
              <div class="text-body-1 font-weight-bold">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ item.ingredients?.join(", ") }}
              </div>
              <div class="text-caption">Ширхэг: {{ quantity }}</div>
            </v-col>

            <!-- Controls -->
            <v-col cols="3" class="text-right">
              <div class="d-flex justify-end align-center mb-1">
                <span class="mx-2 text-body-2">{{ quantity }}</span>
              </div>
              <div class="font-weight-bold text-body-2 mb-1">
                {{ (item.price * quantity).toLocaleString() }}₮
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useCartStore } from "#imports";
const cartStore = useCartStore();

const cartItemCount = computed(() =>
  Array.from(cartStore.cart.values()).reduce((sum, dayItems) => {
    // dayItems is an array of {item, quantity}
    return sum + dayItems.reduce((daySum, entry) => daySum + entry.quantity, 0);
  }, 0)
);
</script>

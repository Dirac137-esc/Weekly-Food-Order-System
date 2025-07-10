<template>
  <div v-if="cartStore.cart.size === 0" class="text-center py-4">
    <v-icon size="48" color="grey-lighten-2">mdi-cart-off</v-icon>
    <div class="text-subtitle-1 grey--text mt-2">Сагс хоосон байна</div>
  </div>
  <v-card v-else class="elevation-8 rounded-xl mb-6" color="surface" outlined>
    <v-card-title class="d-flex align-center justify-space-between pa-6">
      <div class="d-flex align-center">
        <v-avatar color="primary" size="40" class="me-3">
          <v-icon color="white" size="20">mdi-cart</v-icon>
        </v-avatar>
        <div>
          <span class="font-weight-bold text-h6">Миний сагс</span>
          <v-chip color="primary" small class="ml-2"
            >{{ cartItemCount }} ширхэг</v-chip
          >
        </div>
      </div>
      <v-btn
        color="error"
        variant="outlined"
        prepend-icon="mdi-delete"
        @click="cartStore.clearCart()"
        rounded="xl"
        class="text-none"
      >
        Бүгдийг устгах
      </v-btn>
    </v-card-title>

    <v-divider class="mx-6"></v-divider>

    <v-card-text class="pa-6">
      <v-row>
        <template v-for="[day, dayItems] in cartStore.cart" :key="day">
          <v-col
            v-for="({ item, quantity }, index) in dayItems"
            :key="item.id || index"
            cols="12"
          >
            <v-card
              class="elevation-4 rounded-lg transition-all duration-300"
              color="surface"
              hover
            >
              <v-card-text class="pa-4">
                <v-row align="center" no-gutters>
                  <v-col cols="12" sm="3">
                    <div class="position-relative d-inline-block">
                      <v-img
                        :src="
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
                        "
                        height="100"
                        width="100"
                        class="rounded-lg elevation-3"
                        cover
                      />
                    </div>
                  </v-col>

                  <v-col cols="12" sm="5" class="pa-4">
                    <div class="text-h6 font-weight-bold mb-2">
                      {{ item.name }} <br />
                    </div>
                    <div class="text-body-2 text-grey mb-2">
                      <v-icon size="small" class="me-1">mdi-leaf</v-icon>
                      {{ item.ingredients?.join(", ") || "Органик найрлага" }}
                    </div>
                    <v-chip
                      color="primary"
                      size="small"
                      variant="outlined"
                      class="mt-1"
                    >
                      {{ days[day] }} :

                      {{ quantity }} ширхэг
                    </v-chip>
                  </v-col>

                  <v-col cols="12" sm="4" class="pa-4">
                    <div class="d-flex flex-column align-end">
                      <!-- <v-chip
                        color="primary"
                        class="mx-2 font-weight-bold"
                        size="small"
                        rounded="xl"
                      >
                        {{ quantity }}
                      </v-chip> -->

                      <!-- Price -->
                      <div class="text-end mb-3">
                        <div class="text-h6 font-weight-bold text-primary">
                          {{ formatPrice(item.price * quantity) }}₮
                        </div>
                        <div class="text-caption text-grey">
                          {{ formatPrice(item.price) }}₮ тус бүр
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-end mb-2">
                      <v-btn
                        icon="mdi-plus"
                        color="success"
                        class="mx-2"
                        size="small"
                        @click="cartStore.addItem(days[day], item, Number(day))"
                      ></v-btn>
                      <v-btn
                        icon="mdi-minus"
                        color="error"
                        class="mx-2"
                        size="small"
                        @click="cartStore.decreaseItem(day, item.id)"
                      ></v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useCartStore } from "#imports";
const cartStore = useCartStore();

const days: { [key: string]: string } = {
  0: "Даваа ",
  1: "Мягмар",
  2: "Лхагва",
  3: "Пүрэв",
  4: "Баасан",
  5: "Бямба",
  6: "Ням",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("mn-MN").format(price);
};
const cartItemCount = computed(() =>
  Array.from(cartStore.cart.values()).reduce((sum, dayItems) => {
    // dayItems is an array of {item, quantity}
    return sum + dayItems.reduce((daySum, entry) => daySum + entry.quantity, 0);
  }, 0)
);
</script>

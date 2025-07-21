<template>
  <v-app-bar app color="primary" dark elevation="4" height="80" class="px-2">
    <!-- Title -->
    <NuxtLink to="/home" style="text-decoration: none; color: white">
      <div class="d-flex align-center" variant="text">
        <v-icon style="font-size: clamp(1rem, 2vh, 2rem)" size="28"
          >mdi-food</v-icon
        >
        <v-app-bar-title
          class="font-weight-bold d-none d-sm-flex"
          style="font-size: clamp(0.75rem, 2vw, 1.25rem)"
        >
          Хоолны захиалга
        </v-app-bar-title>
      </div>
    </NuxtLink>
    <NuxtLink to="/about-us" style="font-weight: bold; text-decoration: none; color: white">
      <span class="mx-5"> Бидний тухай </span>
    </NuxtLink> 

    <v-spacer />

    <div class="d-flex align-center">
      <!-- Cart with Badge -->
      <v-badge
        v-if="userStore.user && uniqueCount > 0"
        :content="uniqueCount"
        color="white"
        overlap
        bordered
        location="end bottom"
        offset-x="6"
        offset-y="6"
        class="mx-1"
      >
        <v-btn
          v-if="userStore.user"
          @click="toCart"
          icon
          size="default"
          variant="text"
        >
          <v-icon style="font-size: clamp(1rem, 2vh, 2rem)">mdi-cart</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Таны сагс ({{ uniqueCount }})
          </v-tooltip>
        </v-btn>
      </v-badge>
      <v-btn
        v-else
        v-if="userStore.user"
        @click="toCart"
        icon
        class="mx-1"
        size="default"
        variant="text"
      >
        <v-icon style="font-size: clamp(1rem, 2vh, 2rem)">mdi-cart</v-icon>
        <v-tooltip activator="parent" location="bottom"> Сагс </v-tooltip>
      </v-btn>

      <!-- Theme -->
      <v-btn
        v-if="userStore.user"
        @click="themeChange"
        icon
        class="mx-1"
        size="default"
        variant="text"
      >
        <v-icon style="font-size: clamp(1rem, 2vh, 2rem)">
          {{ isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night" }}
        </v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ isDarkTheme ? "Гэрэлтэй" : "Харанхуй" }}
        </v-tooltip>
      </v-btn>

      <!-- Profile  -->
      <v-badge
        v-if="userStore.user?.isVip"
        overlap
        bordered
        offset-x="12"
        offset-y="12"
        class="mx-1"
      >
        <!-- badge -->
        <template #badge>
          <v-icon color="orange" small>mdi-crown</v-icon>
        </template>

        <v-btn
          v-if="userStore.user"
          icon
          to="/profile"
          size="default"
          variant="text"
        >
          <v-icon style="font-size: clamp(1rem, 2vh, 2rem)">mdi-account</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Профайл (VIP)
          </v-tooltip>
        </v-btn>
      </v-badge>

      <v-btn
        v-else
        v-if="userStore.user"
        icon
        to="/profile"
        class="mx-1"
        size="default"
        variant="text"
      >
        <v-icon style="font-size: clamp(1rem, 2vh, 2rem)">mdi-account</v-icon>
        <v-tooltip activator="parent" location="bottom"> Профайл </v-tooltip>
      </v-btn>

      <!-- Admin -->
      <v-btn
        v-if="isAdmin"
        icon
        to="/admin"
        class="mx-1"
        size="default"
        variant="text"
        color="warning"
      >
        <v-icon style="font-size: clamp(1rem, 2vh, 2rem)"
          >mdi-shield-crown</v-icon
        >
        <v-tooltip activator="parent" location="bottom">
          Админ самбар
        </v-tooltip>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const vuetify = useNuxtApp().$vuetify;
const userStore = useUserStore();
const cartStore = useCartStore();

const isDarkTheme = computed(() => vuetify.theme.global.name.value === "dark");
function themeChange() {
  const next = isDarkTheme.value ? "light" : "dark";
  vuetify.theme.global.name.value = next;
  localStorage.setItem("theme", next);
}

function toCart() {
  router.push("/order");
}

onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved) vuetify.theme.global.name.value = saved;
  userStore.loadUser();
});

const isAdmin = computed(() => userStore.user?.role === "admin");

const uniqueCount = computed(() => {
  const ids = new Set(cartStore.cartItems.map((e) => e.item.id));
  return ids.size;
});

definePageMeta({
  middleware: 'admin',
})
</script>
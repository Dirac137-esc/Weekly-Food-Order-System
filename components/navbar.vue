<template>
  <v-app-bar app color="primary" dark elevation="4" height="64" class="px-5">
    <div class="d-flex align-center">
      <v-icon size="28" class="mr-2">mdi-food</v-icon>
      <v-app-bar-title class="text-h6 font-weight-bold">
        Хоолны захиалга
      </v-app-bar-title>
    </div>

    <v-spacer />

    <div class="d-flex align-center">
      <v-btn icon to="/" class="mx-1" size="large" variant="text">
        <v-icon>mdi-home</v-icon>
        <v-tooltip activator="parent" location="bottom">
          Нүүр хуудас
        </v-tooltip>
      </v-btn>

      <v-btn
        icon
        @click="toCart"
        class="mx-1"
        size="large"
        variant="text"
        position="relative"
      >
        <v-icon>mdi-cart</v-icon>
        <v-tooltip activator="parent" location="bottom"> Сагс </v-tooltip>
      </v-btn>

      <!-- Theme Toggle Button -->
      <v-btn @click="themeChange" icon class="mx-1" size="large" variant="text">
        <v-icon>{{
          isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ isDarkTheme ? "Light Mode" : "Dark Mode" }}
        </v-tooltip>
      </v-btn>

      <v-btn icon to="/profile" class="mx-1" size="large" variant="text">
        <v-icon>mdi-account</v-icon>
        <v-tooltip activator="parent" location="bottom"> Профайл </v-tooltip>
      </v-btn>
      <v-btn
        v-if="isAdmin"
        icon
        to="/admin"
        class="mx-1"
        size="large"
        variant="text"
        color="warning"
      >
        <v-icon>mdi-shield-crown</v-icon>
        <v-tooltip activator="parent" location="bottom">
          Админ самбар
        </v-tooltip>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const route = useRoute();
const vuetify = useNuxtApp().$vuetify;
const userStore = useUserStore();

// Computed property for theme detection
const isDarkTheme = computed(() => vuetify.theme.global.name.value === "dark");

function themeChange() {
  vuetify.theme.global.name.value =
    vuetify.theme.global.name.value === "light" ? "dark" : "light";
}

function toCart() {
  router.push("/cart");
}

onMounted(() => {
  userStore.loadUser();
});
const isAdmin = computed(() => {
  return userStore.user?.role === "admin";
});

watchEffect(() => {
  route.fullPath; // dependency

  // Admin protection
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin") &&
    !(userStore.user && userStore.user?.role === "admin")
  ) {
    router.replace("/");
  }
});
</script>

<style scoped>
* {
  font-family: "JetBrains Mono", sans-serif;
}

.v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn:hover {
  transform: translateY(-2px);
}

.v-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.v-avatar:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

/* Custom button styles */
.v-btn--icon {
  border-radius: 8px;
}

.v-btn--icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Badge animation */
.v-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>

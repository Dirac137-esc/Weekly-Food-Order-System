<template>
  <NuxtLayout>
    <v-app>
      <navbar/>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
<script setup lang="ts">
import Navbar from "~/components/navbar.vue";
</script>
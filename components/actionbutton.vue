<template>
  <v-fab
    app
    location="right bottom"
    size="large"
    color="primary"
    icon
  >
    <v-icon>{{ open ? 'mdi-close' : 'mdi-cart' }}</v-icon>

    <v-speed-dial
      v-model="open"
      location="top center"
      transition="scale-transition"
      activator="parent"
    >
      <v-btn color="success" icon>
        <v-icon size="24">mdi-cash</v-icon>
      </v-btn>

      <v-btn color="info" icon>
        <v-icon size="24">mdi-truck-fast</v-icon>
      </v-btn>

      <v-btn color="warning" icon>
        <v-icon size="24">mdi-clock-outline</v-icon>
      </v-btn>

      <v-btn color="error" icon>
        <v-icon size="24">mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-fab>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
/* Position FAB relative to screen */
:deep(.v-fab) {
  z-index: 1000;
}
</style>

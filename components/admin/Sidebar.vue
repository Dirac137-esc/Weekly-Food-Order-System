<template>
  <v-navigation-drawer app permanent width="220" class="admin-sidebar">
    <v-list dense nav>
      <v-list-item>
        <v-list-item-title class="font-weight-bold text-h6">Админ</v-list-item-title>
      </v-list-item>
      <v-divider class="mb-2"></v-divider>
      <v-list-item
          v-for="item in menu"
          :key="item.key"
          :active="selected === item.key"
          @click="$emit('update:selected', item.key)"
          class="sidebar-btn"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
defineProps<{ menu: any[]; selected: string }>()
</script>



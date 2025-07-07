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

<style scoped>
.admin-sidebar {
  background-color: #ffffff;
  border-right: 2px solid #7e57c2;
  color: #4a148c;
  font-family: 'Roboto', sans-serif;
}



.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #4a148c;
}

.sidebar-btn:hover {
  background-color: #ede7f6;
  color: #311b92;
}
</style>



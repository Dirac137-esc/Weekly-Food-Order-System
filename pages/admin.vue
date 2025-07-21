<template>
  <v-app>
    <AdminSidebar :menu="menu" v-model:selected="selected" />
    <v-main>
      <v-container fluid class="admin-bg py-8">
        <component :is="currentView" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AdminSidebar from "~/components/admin/Sidebar.vue";
import Dashboard from "~/components/admin/dashboard.vue";
import Users from "~/components/admin/Users.vue";
import Orders from "~/components/admin/Orders.vue";
import Menu from "~/components/admin/Menu.vue";

const selected = ref("dashboard");
const menu = [
  { key: "dashboard", title: "Самбар", icon: "mdi-view-dashboard" },
  { key: "users", title: "Хэрэглэгчид", icon: "mdi-account-group" },
  { key: "orders", title: "Захиалгууд", icon: "mdi-receipt" },
  { key: "menu", title: "Хоолны цэс", icon: "mdi-food" },
];

const currentView = computed(() => {
  return (
    {
      dashboard: Dashboard,
      users: Users,
      orders: Orders,
      menu: Menu,
    }[selected.value] || Dashboard
  );
});
</script>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import MoreBtn from "~/components/admin/MoreBtn.vue";
import { useApi } from "@/composables/useApi";
interface StatItem {
  title: string;
  stats: string;
  icon: string;
  color: string;
}
const statistics = ref<StatItem[]>([]);
const moreList = [
  { title: "Share", value: "Share" },
  { title: "Refresh", value: "Refresh" },
  { title: "Update", value: "Update" },
];
const fetchStatistics = async () => {
  try {
    const orders: any[] = await useApi("/orders", "GET");

    const totalSales = orders.length;

    const userSet = new Set<string>();
    orders.forEach((order) => {
      const uid =
        typeof order.user === "object" && order.user._id
          ? order.user._id
          : order.user;
      userSet.add(uid);
    });
    const uniqueUsers = userSet.size;
    const foodSet = new Set<string>();
    let totalRevenue = 0;
    orders.forEach((order) => {
      totalRevenue += order.totalCost || 0;
      order.items.forEach((item: any) => {
        const id =
          typeof item.food === "object" && item.food._id
            ? item.food._id
            : item.food;
        foodSet.add(id);
      });
    });
    const totalProducts = foodSet.size;

    statistics.value = [
      {
        title: "Борлуулалт",
        stats: totalSales.toLocaleString(),
        icon: "mdi-chart-pie",

        color: "primary",
      },
      {
        title: "Үйлчлүүлэгч",
        stats: uniqueUsers.toLocaleString(),
        icon: "mdi-account-group-outline",

        color: "success",
      },
      {
        title: "Бүтээгдэхүүн",
        stats: totalProducts.toLocaleString(),
        icon: "mdi-laptop",

        color: "warning",
      },
      {
        title: "Орлого",
        stats: totalRevenue.toLocaleString("mn-MN", {
          style: "currency",
          currency: "MNT",
        }),
        icon: "mdi-currency-mnt",

        color: "info",
      },
    ];
  } catch (err: any) {
    console.error("Статистик татаж чадсангүй:", err);
  }
};
onMounted(fetchStatistics);

const onMoreAction = (action: string) => {
  if (action === "Refresh") {
    fetchStatistics();
  }
};
</script>

<template>
  <VCard title="ЭНЭ САРЫН ГҮЙЛГЭЭ">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="font-weight-medium text-high-emphasis">Энэ сар бид</span>
        <span class="text-high-emphasis">😎</span> 30% өсөлттэй
      </p>
    </template>

    <template #append>
      <MoreBtn :menu-list="moreList" @select="onMoreAction" />
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center ga-3">
            <VAvatar :color="item.color" rounded size="40" class="elevation-2">
              <VIcon size="24" :icon="item.icon" />
            </VAvatar>
            <div class="d-flex flex-column">
              <div class="text-body-1">{{ item.title }}</div>
              <h5 class="text-h5">{{ item.stats }}</h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

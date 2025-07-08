<!-- ЭНЭ ХУУДАС ЗАСАГДАНА . -->

<template>
  <div>
    <v-alert
      type="info"
      border="start"
      class="mb-6 font-weight-medium text-subtitle-1"
      elevation="2"
      rounded
    >
      Админ самбар тавтай морил!
    </v-alert>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-card class="mb-6 admin-stats-card" elevation="6" rounded>
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left color="primary" size="28">mdi-chart-bar</v-icon>
            Хоолны захиалгын тоо (ихээс бага)
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4 pb-2">
            <v-list dense nav>
              <v-list-item v-for="stat in foodStatsSorted">
                > class="stat-list-item" ripple >
                <v-list-item>
                  <v-list-item-title class="font-weight-semibold">
                    <v-chip
                      color="primary"
                      class="ml-4"
                      small
                      elevation="2"
                      pill
                    >
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-6 admin-stats-card" elevation="6" rounded>
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left color="primary" size="28"
              >mdi-chart-bar-stacked</v-icon
            >
            Захиалгын график
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <canvas ref="foodChart" height="260"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

const foodStats = ref([]);
const foodStatsSorted = ref([]);
const foodChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: any = null;

// async function fetchFoodStats() {
//   const token = localStorage.getItem("token");
//   const res = await fetch("https://backend-production-25f11.up.railway.app", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const data = await res.json();
//   if (Array.isArray(data)) {
//     foodStats.value = data;
//     foodStatsSorted.value = [...data].sort((a, b) => b.count - a.count);
//     await nextTick();
//     drawChart();
//   }
// }

// async function drawChart() {
//   if (!foodChart.value) return;
//   if (!window.Chart) await import("chart.js/auto");
//   if (chartInstance) chartInstance.destroy();

//   chartInstance = new Chart(foodChart.value.getContext("2d"), {
//     type: "bar",
//     data: {
//       labels: foodStatsSorted.value.map((f) => f.name),
//       datasets: [
//         {
//           label: "Захиалгын тоо",
//           data: foodStatsSorted.value.map((f) => f.count),
//           backgroundColor: "#1976d2",
//           borderRadius: 6,
//           maxBarThickness: 40,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           backgroundColor: "#1976d2",
//           titleColor: "#fff",
//           bodyColor: "#fff",
//           cornerRadius: 6,
//         },
//       },
//       scales: {
//         x: {
//           ticks: { font: { size: 14, weight: "600" } },
//           grid: { display: false },
//         },
//         y: {
//           beginAtZero: true,
//           ticks: { stepSize: 1, font: { size: 14 } },
//           grid: {
//             color: "#e3f0ff",
//             borderDash: [5, 5],
//           },
//         },
//       },
//     },
//   });
// }

// onMounted(fetchFoodStats);
</script>

<style scoped>
.admin-stats-card {
  background: #f5faff;
  box-shadow: 0 4px 12px rgb(25 118 210 / 0.15);
  transition: box-shadow 0.3s ease;
  border-radius: 20px;
}
.admin-stats-card:hover {
  box-shadow: 0 8px 24px rgb(25 118 210 / 0.3);
}

.stat-list-item {
  border-radius: 12px;
  padding: 8px 12px;
  transition: background-color 0.2s ease;
}
.stat-list-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
  cursor: pointer;
}

.v-alert {
  font-size: 1.1rem;
  letter-spacing: 0.03em;
  font-weight: 600;
}
</style>

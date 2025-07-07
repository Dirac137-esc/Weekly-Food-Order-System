<template>
  <v-app>
    <v-navigation-drawer app permanent width="220" class="admin-sidebar">
      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="font-weight-bold text-h6"
            >Админ</v-list-item-title
          >
        </v-list-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item
          v-for="item in menu"
          :key="item.key"
          :active="selected === item.key"
          @click="selected = item.key"
          class="sidebar-btn"
        >
          <v-list-item>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="admin-bg py-8" fluid>
        <h2 class="mb-6 font-weight-bold text-h5 admin-title">
          <v-icon left color="primary" size="large">mdi-cog</v-icon>
          {{ menu.find((m) => m.key === selected)?.title }}
        </h2>
        <div v-if="selected === 'menu'">
          <v-alert type="info" border="start" class="mb-4"
            >Хоолны цэс засварлах</v-alert
          >
          <!-- Add Food Form -->
          <v-form
            @submit.prevent="addFood"
            class="mb-4 d-flex flex-wrap align-center gap-2 admin-form"
          >
            <v-text-field
              v-model="newFood.name"
              label="Хоолны нэр"
              dense
              required
              style="max-width: 180px"
            />
            <v-text-field
              v-model="newFood.ingredient"
              label="Орц"
              dense
              style="max-width: 180px"
            />
            <v-text-field
              v-model="newFood.price"
              label="Үнэ"
              dense
              type="number"
              style="max-width: 120px"
            />
            <v-text-field
              v-model="newFood.imageUrl"
              label="Зураг (URL)"
              dense
              style="max-width: 220px"
            />
            <v-btn color="primary" type="submit" :loading="foodLoading"
              >Нэмэх</v-btn
            >
          </v-form>
          <v-alert v-if="foodMsg" :type="foodMsgType" class="mb-2">{{
            foodMsg
          }}</v-alert>
          <!-- Food List -->
          <v-row>
            <v-col
              v-for="food in foods"
              :key="food._id"
              cols="12"
              md="4"
              class="mb-4"
            >
              <v-card class="admin-food-card">
                <v-img :src="food.imageUrl" height="160px" cover></v-img>
                <v-card-title class="font-weight-bold">{{
                  food.name
                }}</v-card-title>
                <v-card-subtitle class="mb-1">{{ food.desc }}</v-card-subtitle>
                <v-card-text>
                  <div class="mb-2">
                    Үнэ: <span class="font-weight-bold">{{ food.price }}₮</span>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    icon
                    color="error"
                    @click="deleteFood(food._id)"
                    :loading="deleteLoadingId === food._id"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="primary"
                    @click="food.editing = !food.editing"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-if="food.editing" class="pa-3">
                    <v-text-field
                      v-model="food.name"
                      label="Нэр"
                      dense
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="food.desc"
                      label="Тайлбар"
                      dense
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="food.price"
                      label="Үнэ"
                      dense
                      type="number"
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="food.imageUrl"
                      label="Зураг (URL)"
                      dense
                      class="mb-2"
                    />
                    <v-btn
                      color="success"
                      size="small"
                      @click="updateFood(food)"
                      >Хадгалах</v-btn
                    >
                    <v-btn
                      color="grey"
                      size="small"
                      @click="food.editing = false"
                      >Болих</v-btn
                    >
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="selected === 'dashboard'">
          <v-alert type="info" border="start" class="mb-4">
            Админ самбар тавтай морил!
          </v-alert>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="mb-4 admin-stats-card">
                <v-card-title>
                  <v-icon left color="primary">mdi-chart-bar</v-icon>
                  Хоолны захиалгын тоо (ихээс бага)
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="stat in foodStatsSorted"
                      :key="stat.foodId"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ stat.name }}
                          <v-chip color="primary" class="ml-2"
                            >{{ stat.count }} удаа</v-chip
                          >
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="mb-4 admin-stats-card">
                <v-card-title>
                  <v-icon left color="primary">mdi-chart-bar-stacked</v-icon>
                  Захиалгын график
                </v-card-title>
                <v-card-text>
                  <canvas ref="foodChart" height="220"></canvas>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="selected === 'users'">
          <v-alert type="success" border="start" class="mb-4"
            >Хэрэглэгчид</v-alert
          >
          <v-btn
            color="primary"
            class="mb-3"
            @click="fetchUsers"
            :loading="usersLoading"
            >Шинэчлэх</v-btn
          >
          <v-alert v-if="usersMsg" :type="usersMsgType" class="mb-2">{{
            usersMsg
          }}</v-alert>
          <v-table class="admin-table">
            <thead>
              <tr>
                <th>Нэр</th>
                <th>И-мэйл</th>
                <th>Утас</th>
                <th>Хаяг</th>
                <th>Role</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name || user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.address }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user._id }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div v-else-if="selected === 'orders'">
          <v-alert type="warning" border="start" class="mb-4"
            >Захиалгууд</v-alert
          >
          <p>Энд бүх захиалгын жагсаалт, төлөв, дэлгэрэнгүй харагдана.</p>
        </div>
        <div v-else>
          <v-alert type="error" border="start" class="mb-4"
            >Сонголт олдсонгүй</v-alert
          >
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

const menu = [
  { key: "dashboard", title: "Самбар", icon: "mdi-view-dashboard" },
  { key: "users", title: "Хэрэглэгчид", icon: "mdi-account-group" },
  { key: "orders", title: "Захиалгууд", icon: "mdi-receipt" },
  { key: "menu", title: "Хоолны цэс", icon: "mdi-food" },
];
const selected = ref("dashboard");

// Food menu state
const foods = ref([]);
const foodLoading = ref(false);
const deleteLoadingId = ref("");
const foodMsg = ref("");
const foodMsgType = ref("success");
const newFood = ref({ name: "", desc: "", price: "", imageUrl: "" });

// Fetch food list from backend
async function fetchFoods() {
  foodLoading.value = true;
  try {
    const res = await fetch(
      "https://backend-production-88df.up.railway.app/foods"
    );
    const data = await res.json();
    foods.value = Array.isArray(data) ? data : data.foods || [];
  } catch (e) {
    foodMsg.value = "Хоолны жагсаалт авахад алдаа гарлаа";
    foodMsgType.value = "error";
  }
  foodLoading.value = false;
}
onMounted(fetchFoods);

// хоол нэмэх функц
async function addFood() {
  foodLoading.value = true;
  foodMsg.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://backend-production-88df.up.railway.app/foods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFood.value.name,
          desc: newFood.value.desc,
          price: Number(newFood.value.price),
          imageUrl: newFood.value.imageUrl,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      foodMsg.value = "Хоол амжилттай нэмэгдлээ";
      foodMsgType.value = "success";
      newFood.value = { name: "", desc: "", price: "", imageUrl: "" };
      fetchFoods();
    } else {
      foodMsg.value = data.message || "Хоол нэмэхэд алдаа гарлаа";
      foodMsgType.value = "error";
    }
  } catch (e) {
    foodMsg.value = "Сүлжээний алдаа";
    foodMsgType.value = "error";
  }
  foodLoading.value = false;
}

// Update food (inline edit)
async function updateFood(food) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://backend-production-88df.up.railway.app/foods/${food._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: food.name,
          desc: food.desc,
          price: Number(food.price),
          imageUrl: food.imageUrl,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      foodMsg.value = data.message || "Засахад алдаа гарлаа";
      foodMsgType.value = "error";
    }
  } catch (e) {
    foodMsg.value = "Сүлжээний алдаа";
    foodMsgType.value = "error";
  }
}

// хоол хасах функц
async function deleteFood(id) {
  deleteLoadingId.value = id;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://backend-production-88df.up.railway.app/foods/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      foodMsg.value = "Устгагдлаа";
      foodMsgType.value = "success";
      fetchFoods();
    } else {
      foodMsg.value = data.message || "Устгахад алдаа гарлаа";
      foodMsgType.value = "error";
    }
  } catch (e) {
    foodMsg.value = "Сүлжээний алдаа";
    foodMsgType.value = "error";
  }
  deleteLoadingId.value = "";
}

// User management state
const users = ref([]);
const usersLoading = ref(false);
const usersMsg = ref("");
const usersMsgType = ref("success");

// Fetch all users from backend
async function fetchUsers() {
  usersLoading.value = true;
  usersMsg.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://backend-production-88df.up.railway.app/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      users.value = Array.isArray(data) ? data : data.users || [];
      usersMsg.value = "";
    } else {
      usersMsg.value =
        data.message || "Хэрэглэгчдийн жагсаалт авахад алдаа гарлаа";
      usersMsgType.value = "error";
    }
  } catch (e) {
    usersMsg.value = "Сүлжээний алдаа";
    usersMsgType.value = "error";
  }
  usersLoading.value = false;
}
// Автоматаар хэрэглэгчдийн жагсаалтыг ачааллах
onMounted(fetchUsers);

// Food stats state
const foodStats = ref([]); // [{foodId, name, count}]
const foodStatsSorted = ref([]);

const foodChart = ref(null);
let chartInstance = null;

// Fetch food stats from backend
async function fetchFoodStats() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://backend-production-88df.up.railway.app/foods/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      foodStats.value = data;
      // Sort by count desc
      foodStatsSorted.value = [...data].sort((a, b) => b.count - a.count);
      await nextTick();
      drawChart();
    }
  } catch (e) {
    // ignore error for now
  }
}

// Draw chart using Chart.js (add Chart.js to your project)
async function drawChart() {
  if (!foodChart.value) return;
  if (!window.Chart) {
    // Lazy load Chart.js if not loaded
    await import("chart.js/auto");
  }
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new window.Chart(foodChart.value.getContext("2d"), {
    type: "bar",
    data: {
      labels: foodStatsSorted.value.map((f) => f.name),
      datasets: [
        {
          label: "Захиалгын тоо",
          data: foodStatsSorted.value.map((f) => f.count),
          backgroundColor: "#1976d2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

onMounted(() => {
  fetchFoodStats();
});
</script>

<style scoped>
.admin-bg {
  background: linear-gradient(135deg, #e3f0ff 0%, #f5faff 100%);
  min-height: 100vh;
}
.admin-title {
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.admin-sidebar {
  background: #e3f2fd !important;
  border-right: 1px solid #bbdefb;
}
.sidebar-btn {
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: background 0.2s;
}
.sidebar-btn.v-list-item--active {
  background: #bbdefb !important;
}
.admin-food-card {
  border-radius: 18px;
  box-shadow: 0 2px 12px #1976d220;
  background: #fff;
  transition: box-shadow 0.2s;
}
.admin-food-card:hover {
  box-shadow: 0 6px 24px #1976d240;
}
.admin-stats-card {
  border-radius: 18px;
  background: #f5faff;
  box-shadow: 0 2px 12px #1976d220;
}
.admin-table {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #1976d220;
}
.admin-form .v-btn {
  font-weight: 600;
}
</style>

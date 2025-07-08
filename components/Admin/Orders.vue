<template>
  <v-container class="py-6">
    <v-card elevation="2">
      <v-card-title class="bg-warning text-white">
        <v-icon start class="mr-2">mdi-receipt</v-icon>
        Захиалгын жагсаалт
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="msg"
          :type="msgType"
          class="mb-4"
          border="start"
          variant="tonal"
        >
          {{ msg }}
        </v-alert>

        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 my-3">Нийт захиалга: {{ orders.length }}</h3>
          <v-btn
            color="primary"
            @click="fetchOrders"
            :loading="loading"
            prepend-icon="mdi-refresh"
          >
            Шинэчлэх
          </v-btn>
        </div>

        <v-table class="rounded-lg elevation-1" density="comfortable">
          <thead>
            <tr>
              <th>Огноо</th>
              <th>Долоо хоног</th>
              <th>Хэрэглэгч</th>
              <th>Нийт дүн</th>
              <th>Төлбөр</th>
              <th>Хүргэлт</th>
              <th>Хаяг</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ formatDate(order.date) }}</td>
              <td>{{ order.weekday }}</td>
              <td>{{ order.user?.name || order.user?.email }}</td>
              <td>{{ order.totalCost.toLocaleString() }}₮</td>

              <!-- Payment Status -->
              <td style="max-width: 140px">
                <v-select
                  v-model="order.paymentStatus"
                  :items="paymentStatuses"
                  :item-title="(s) => s"
                  density="compact"
                  hide-details
                  variant="underlined"
                  @update:model-value="
                    (val) => updateStatus(order, 'paymentStatus', val)
                  "
                >
                  <template #selection="{ item }">
                    <v-chip
                      :color="getStatusColor(item.raw)"
                      text-color="white"
                      size="small"
                      label
                      class="text-subtitle-2"
                    >
                      {{ item.raw }}
                    </v-chip>
                  </template>
                </v-select>
              </td>

              <!-- Delivery Status -->
              <td style="max-width: 160px">
                <v-select
                  v-model="order.deliveryStatus"
                  :items="deliveryStatuses"
                  :item-title="(s) => s"
                  density="compact"
                  hide-details
                  variant="underlined"
                  @update:model-value="
                    (val) => updateStatus(order, 'deliveryStatus', val)
                  "
                >
                  <template #selection="{ item }">
                    <v-chip
                      :color="getStatusColor(item.raw)"
                      text-color="white"
                      size="small"
                      label
                    >
                      {{ item.raw }}
                    </v-chip>
                  </template>
                </v-select>
              </td>

              <td>{{ order.location?.address || "—" }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

interface Order {
  _id: string;
  date: string;
  weekday: string;
  user?: { name?: string; email?: string };
  totalCost: number;
  paymentStatus: string;
  deliveryStatus: string;
  location?: { address: string };
}

const orders = ref<Order[]>([]);
const loading = ref(false);
const msg = ref("");
const msgType = ref<"success" | "error">("success");

const paymentStatuses = ["pending", "paid", "refund"];
const deliveryStatuses = ["pending", "delivering", "complete"];

async function fetchOrders() {
  loading.value = true;
  msg.value = "";
  try {
    const data = await useApi("/orders");
    if (Array.isArray(data)) {
      orders.value = data;
    } else {
      msg.value = "Захиалга татахад алдаа гарлаа";
      msgType.value = "error";
    }
  } catch (err: any) {
    msg.value = err.message || "Сүлжээний алдаа";
    msgType.value = "error";
  } finally {
    loading.value = false;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("mn-MN");
}

async function updateStatus(
  order: Order,
  field: "paymentStatus" | "deliveryStatus",
  value: string
) {
  try {
    await useApi(`/orders/${order._id}`, "PUT", { [field]: value });
  } catch (err: any) {
    msg.value = err.message || "Сүлжээний алдаа";
    msgType.value = "error";
    await fetchOrders();
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "paid":
    case "complete":
      return "green";
    case "delivering":
      return "blue";
    case "refund":
      return "deep-orange";
    case "pending":
    default:
      return "grey";
  }
}

onMounted(fetchOrders);
</script>

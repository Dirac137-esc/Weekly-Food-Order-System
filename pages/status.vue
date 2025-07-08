<template>
  <v-container class="status-bg py-10" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="mb-8">
          <div class="text-h5 font-weight-bold mb-1 mt-15 status-title">
            Захиалгын дэлгэрэнгүй
          </div>
          <div class="grey--text mb-1">{{ statusDates[0]?.split(" ")[0] }}</div>
          <div class="mb-2">
            <span class="font-weight-bold">Захиалгын дугаар:</span>
            <span class="ml-1">#1101955718</span>
          </div>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-4 mb-2 status-info-card" elevation="2">
                <div class="font-weight-bold mb-1">Хүлээн авагч</div>
                <div>Батболд</div>
                <div>9999-8888</div>
                <div>Улаанбаатар, Монгол</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 mb-2 status-info-card" elevation="2">
                <div class="font-weight-bold mb-1">Төлбөрийн мэдээлэл</div>
                <div class="d-flex align-center">
                  <v-img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                    height="22"
                    width="36"
                    class="mr-2"
                  />
                  <span>**** 1234</span>
                  <span class="ml-2"
                    >{{ items.reduce((s, i) => s + i.qty * i.price, 0) }}₮</span
                  >
                </div>
                <div class="mt-2 font-weight-bold">
                  Төлөв:
                  <span
                    :class="{
                      'text-warning': paymentStatus === 'pending',
                      'text-success': paymentStatus === 'paid',
                      'text-error': paymentStatus === 'refund',
                    }"
                    >{{ paymentStatusLabel }}</span
                  >
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 mb-2 status-info-card" elevation="2">
                <div class="font-weight-bold mb-1">Захиалгын хураангуй</div>
                <div>
                  Нийлбэр: {{ items.reduce((s, i) => s + i.qty * i.price, 0) }}₮
                </div>
                <div>Хүргэлт: Үнэгүй</div>
                <div class="font-weight-bold mt-1">
                  Нийт: {{ items.reduce((s, i) => s + i.qty * i.price, 0) }}₮
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- Status  -->
        <v-card class="pa-6 mb-6 status-main-card" elevation="8">
          <div class="d-flex align-center mb-4">
            <v-icon size="32" color="primary" class="mr-2"
              >mdi-truck-delivery</v-icon
            >
            <span class="font-weight-bold text-h6">Хүргэлтийн явц</span>
            <v-spacer />
            <v-chip
              :color="deliveryStatusColor"
              class="font-weight-bold"
              label
              >{{ deliveryStatusLabel }}</v-chip
            >
          </div>
          <v-row class="mb-2">
            <v-col cols="12" md="8">
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="(s, i) in statuses"
                  :key="s.value"
                  :color="step > i ? s.color : 'grey lighten-1'"
                  :icon="s.icon"
                  small
                >
                  <template #opposite>
                    <div class="font-weight-bold">{{ s.label }}</div>
                  </template>
                  <div v-if="step > i" class="text-caption grey--text">
                    {{ statusDates[i] }}
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="d-flex flex-column align-center justify-center"
            >
              <v-btn
                v-if="step === 1"
                color="primary"
                @click="nextStep"
                class="mb-2"
                elevation="6"
                >Хүргэлт эхлүүлэх</v-btn
              >
              <v-btn
                v-else-if="step === 2"
                color="success"
                @click="nextStep"
                class="mb-2"
                elevation="6"
                >Хүргэлт дуусгах</v-btn
              >
              <v-btn v-else color="grey" disabled class="mb-2" elevation="2"
                >Захиалга дууссан</v-btn
              >
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <!-- Захиалсан хоол -->
          <div class="font-weight-bold mb-2">Захиалсан хоол</div>
          <v-row>
            <v-col cols="12" md="8">
              <v-list dense>
                <v-list-item
                  v-for="item in items"
                  :key="item.id"
                  class="status-food-item"
                >
                  <v-list-item>
                    <v-img :src="item.img" />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold">{{
                      item.name
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.desc }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item-action>
                    <span class="font-weight-bold"
                      >{{ item.qty }} x {{ item.price }}₮</span
                    >
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const step = ref(1); // 1: хүлээгдэж байгаа, 2: хүргэлт, 3: дууссан

const statuses = [
  {
    value: "pending",
    label: "Хүлээгдэж байна",
    color: "grey",
    icon: "mdi-clock-outline",
  },
  {
    value: "delivery",
    label: "Гарсан",
    color: "primary",
    icon: "mdi-truck-fast",
  },
  {
    value: "complete",
    label: "Хүргэгдсэн",
    color: "success",
    icon: "mdi-check-circle",
  },
];

// --- ШИНЭ: Реал цагийн статусын огноо ---
const statusDates = ref<string[]>([]);

function updateStatusDates() {
  const now = new Date();
  // Format: YYYY-MM-DD HH:mm
  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;

  // 1. Захиалга үүссэн (одоогийн цаг)
  const created = new Date(now);
  // 2. Хүргэлт эхэлсэн (одоогийн цаг + 1 цаг түр зур)
  const delivery = new Date(now);
  delivery.setHours(delivery.getHours() + 1);
  // 3. Хүргэлт дууссан (одоогийн цаг + 2 цаг түр зур)
  const complete = new Date(now);
  complete.setHours(complete.getHours() + 2);

  statusDates.value = [format(created), format(delivery), format(complete)];
}

// Анх ачаалах болон step өөрчлөгдөх бүрд шинэчилнэ
updateStatusDates();

const items = [
  {
    id: 1,
    name: "Будаатай хуурга",
    desc: "Үхрийн мах, ногоо",
    qty: 1,
    price: 12000,
    img: "/1.jpg",
  },
  {
    id: 2,
    name: "Гоймон",
    desc: "Тахианы мах, ногоо",
    qty: 2,
    price: 9000,
    img: "/2.jpg",
  },
];

const paymentStatus = ref<"pending" | "paid" | "refund">("paid");
const paymentStatusLabel = computed(() => {
  switch (paymentStatus.value) {
    case "pending":
      return "Хүлээгдэж байна";
    case "paid":
      return "Төлөгдсөн";
    case "refund":
      return "Буцаалт";
  }
});

const deliveryStatusLabel = computed(() => statuses[step.value - 1].label);
const deliveryStatusColor = computed(() => statuses[step.value - 1].color);

function nextStep() {
  if (step.value < 3) step.value++;
}
</script>

<style scoped>
.status-bg {
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%);
  min-height: 100vh;
}
.status-title {
  letter-spacing: 1px;
  color: #1976d2;
}
.status-info-card {
  background: #f5faff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1976d220;
  border: 1px solid #e3e7ee;
}
.status-main-card {
  background: linear-gradient(120deg, #f5faff 60%, #e3f0ff 100%);
  border-radius: 24px;
  box-shadow: 0 6px 32px #1976d220;
}
.status-food-item {
  border-radius: 12px;
  margin-bottom: 6px;
  background: #fff;
  box-shadow: 0 2px 8px #1976d220;
  border: 1px solid #e3e7ee;
}
.v-timeline {
  background: transparent;
}
.v-timeline-item__opposite {
  min-width: 120px;
}
.v-btn {
  font-weight: 600;
}
</style>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="mb-8">
          <div class="text-h5 font-weight-bold mb-1 mt-15">Захиалгын дэлгэрэнгүй</div>
          <div class="grey--text mb-1">2025-07-02</div>
          <div class="mb-2">
            <span class="font-weight-bold">Захиалгын дугаар:</span>
            <span class="ml-1">#1101955718</span>
          </div>
          <v-row>
            <v-col cols="12" md="4">
              <div class="font-weight-bold mb-1">Хүлээн авагч</div>
              <div>Батболд</div>
              <div>9999-8888</div>
              <div>Улаанбаатар, Монгол</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="font-weight-bold mb-1">Төлбөрийн мэдээлэл</div>
              <div class="d-flex align-center">
                <v-img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" height="22" width="36" class="mr-2"/>
                <span>**** 1234</span>
                <span class="ml-2">24,000₮</span>
              </div>
              <div class="mt-2 font-weight-bold">Төлөв: 
                <span :class="{
                  'text-warning': paymentStatus==='pending',
                  'text-success': paymentStatus==='paid',
                  'text-error': paymentStatus==='refund'
                }">{{ paymentStatusLabel }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="font-weight-bold mb-1">Захиалгын хураангуй</div>
              <div>Нийлбэр: 24,000₮</div>
              <div>Хүргэлт: Үнэгүй</div>
              <div class="font-weight-bold mt-1">Нийт: 24,000₮</div>
            </v-col>
          </v-row>
        </div>
        <!-- Status  -->
        <v-card class="pa-6 mb-6" outlined>
          <div class="d-flex align-center mb-4">
            <v-icon size="32" color="primary" class="mr-2">mdi-truck-delivery</v-icon>
            <span class="font-weight-bold text-h6">Хүргэлтийн явц</span>
            <v-spacer />
            <v-chip :color="deliveryStatusColor" class="font-weight-bold" label>{{ deliveryStatusLabel }}</v-chip>
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
                  <div v-if="step > i" class="text-caption grey--text">{{ statusDates[i] }}</div>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-col cols="12" md="4" class="d-flex flex-column align-center justify-center">
              <v-btn
                v-if="step === 1"
                color="primary"
                @click="nextStep"
                class="mb-2"
                >Хүргэлт эхлүүлэх</v-btn>
              <v-btn
                v-else-if="step === 2"
                color="success"
                @click="nextStep"
                class="mb-2"
                >Хүргэлт дуусгах</v-btn>
              <v-btn
                v-else
                color="grey"
                disabled
                class="mb-2"
                >Захиалга дууссан</v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-4"/>
          <!-- Захиалсан хоол -->
          <div class="font-weight-bold mb-2">Захиалсан хоол</div>
          <v-row>
            <v-col cols="12" md="8">
              <v-list dense>
                <v-list-item v-for="item in items" :key="item.id">
                  <v-list-item-avatar>
                    <v-img :src="item.img" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.desc }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <span class="font-weight-bold">{{ item.qty }} x {{ item.price }}₮</span>
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
import { ref, computed } from 'vue'

const step = ref(1) // 1: хүлээгдэж байгаа, 2: хүргэлт, 3: дууссан

const statuses = [
  { value: 'pending', label: 'Хүлээгдэж байна', color: 'grey', icon: 'mdi-clock-outline' },
  { value: 'delivery', label: 'Гарсан', color: 'primary', icon: 'mdi-truck-fast' },
  { value: 'complete', label: 'Хүргэгдсэн', color: 'success', icon: 'mdi-check-circle' }
]

const statusDates = [
    '2025-07-02 10:00',
    '2025-07-02 12:30',
    '2025-07-02 14:00'
]

const items = [
  { id: 1, name: 'Будаатай хуурга', desc: 'Үхрийн мах, ногоо', qty: 1, price: 12000, img: '/1.jpg' },
  { id: 2, name: 'Гоймон', desc: 'Тахианы мах, ногоо', qty: 2, price: 9000, img: '/2.jpg' }
]

const paymentStatus = ref<'pending'|'paid'|'refund'>('paid')
const paymentStatusLabel = computed(() => {
  switch (paymentStatus.value) {
    case 'pending': return 'Хүлээгдэж байна'
    case 'paid': return 'Төлөгдсөн'
    case 'refund': return 'Буцаалт'
  }
})

const deliveryStatusLabel = computed(() => statuses[step.value - 1].label)
const deliveryStatusColor = computed(() => statuses[step.value - 1].color)

function nextStep() {
  if (step.value < 3) step.value++
}
</script>

<style scoped>
.v-card {
  border-radius: 1.5rem;
}
.v-timeline {
  background: transparent;
}
.v-timeline-item__opposite {
  min-width: 120px;
}
</style>
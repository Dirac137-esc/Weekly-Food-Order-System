<template>
  <v-container class="py-6">
    <v-card elevation="2" rounded="xl">
      <v-card-title class="bg-warning text-white text-h6 d-flex align-center">
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
            elevation="1"
        >
          {{ msg }}
        </v-alert>

        <div class="d-flex justify-space-between align-center mb-6">
          <h3 class="text-h6 font-weight-medium">Нийт захиалга: {{ orders.length }}</h3>
          <MoreBtn
              color="primary"
              @click="fetchOrders"
              :loading="loading"
              prepend-icon="mdi-refresh"
              variant="flat"
              class="rounded"
          >
            Шинэчлэх
          </MoreBtn>
        </div>


        <v-row class="mb-6" dense>
          <v-col cols="12" md="3">
            <v-text-field
                v-model="filters.user"
                label="Хэрэглэгчийн нэр…"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                    v-model="filters.dateRangeFormatted"
                    label="Огноо"
                    readonly
                    density="compact"
                    v-bind="props"
                    variant="outlined"
                    hide-details
                />
              </template>
              <v-date-picker
                  v-model="filters.dateRange"
                  range
                  scrollable
                  @change="menu = false"
              />
            </v-menu>
          </v-col>

          <v-col cols="6" md="2">
            <v-select
                v-model="filters.weekday"
                :items="['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба','Ням']"
                label="Өдөр"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-text-field
                v-model.number="filters.minTotal"
                label="Нийт дүн (min)"
                type="number"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-text-field
                v-model.number="filters.maxTotal"
                label="Нийт дүн (max)"
                type="number"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
                v-model="filters.paymentStatus"
                :items="['pending','paid','refund']"
                label="Төлөлт"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
                v-model="filters.deliveryStatus"
                :items="['pending','delivering','complete']"
                label="Хүргэлт"
                clearable
                density="compact"
                variant="outlined"
                hide-details
            />
          </v-col>
        </v-row>


         <v-data-table
               :headers="headers"
               :items="filteredOrders"
               item-key="_id"
            sort-icon="mdi-swap-vertical"
            class="rounded-xl elevation-1"
            density="comfortable"
            hover
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.weekday="{ item }">
            {{ mongolianWeekdays[item.weekday] || '—' }}
          </template>

            <template #item.userName="{ item }">
              <div
                  class="text-truncate"
                  :title="item.user?.name || item.user?.email || '—'"
                >
                {{ item.user?.name || item.user?.email || '—' }}
              </div>
           </template>

          <template #item.totalCost="{ item }">
            {{ item.totalCost.toLocaleString() }}₮
          </template>

          <template #item.items="{ item }">
            <div v-if="item.items?.length">
              <div
                  v-for="(it, i) in item.items"
                  :key="i"
                  class="d-flex align-center mb-1"
              >
                <v-chip
                    class="me-2"
                    color="primary"
                    size="small"
                    label
                    text-color="white"
                >
                  {{ it.food?.name || '—' }}
                </v-chip>
                <span
                    class="px-2 py-1 text-caption rounded bg-grey-lighten-3 text-grey-darken-2 font-weight-medium"
                    style="line-height: 1"
                >
                  ×{{ it.qty }}
                </span>
              </div>
            </div>
            <div v-else>—</div>
          </template>

          <template #item.paymentStatus="{ item }">
            <v-select
                v-model="item.paymentStatus"
                :items="paymentStatuses"
                density="compact"
                hide-details
                variant="underlined"
                @update:model-value="val => updateStatus(item, 'paymentStatus', val)"
            >
              <template #selection="{ item: sel }">
                <v-chip
                    :color="getStatusColor(sel.raw)"
                    text-color="white"
                    size="small"
                    label
                    class="text-caption"
                >
                  {{ sel.raw }}
                </v-chip>
              </template>
            </v-select>
          </template>

          <template #item.deliveryStatus="{ item }">
            <v-select
                v-model="item.deliveryStatus"
                :items="deliveryStatuses"
                density="compact"
                hide-details
                variant="underlined"
                @update:model-value="val => updateStatus(item, 'deliveryStatus', val)"
            >
              <template #selection="{ item: sel }">
                <v-chip
                    :color="getStatusColor(sel.raw)"
                    text-color="white"
                    size="small"
                    label
                    class="text-caption"
                >
                  {{ sel.raw }}
                </v-chip>
              </template>
            </v-select>
          </template>

          <template #item.address="{ item }">
            <div
                class="address-cell text-truncate"
                :title="item.location?.address || '—'"
            >
              {{ item.location?.address || '—' }}
            </div>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '@/composables/useApi';
import MoreBtn from "~/components/admin/MoreBtn.vue";

interface Order {
  _id: string;
  date: string;
  weekday: string;
  user?: { name?: string; email?: string };
  totalCost: number;
  items?: Array<{ food?: { name: string }; qty: number }>;
  paymentStatus: string;
  deliveryStatus: string;
  location?: { address: string };
}


const mongolianWeekdays: Record<string, string> = {
  monday: 'Даваа',
  tuesday: 'Мягмар',
  wednesday: 'Лхагва',
  thursday: 'Пүрэв',
  friday: 'Баасан',
  saturday: 'Бямба',
  sunday: 'Ням',
};


const orders = ref<Order[]>([]);
const loading = ref(false);
const msg = ref('');
const msgType = ref<'success' | 'error'>('success');


const paymentStatuses = ['pending', 'paid', 'refund'];
const deliveryStatuses = ['pending', 'delivering', 'complete'];


const headers = [
  { text: 'Огноо',         value: 'date',           sortable: true  },
  { text: 'Өдөр',          value: 'weekday',        sortable: false },
  { text: 'Хэрэглэгч',     value: 'userName',       sortable: false, cellClass: 'user-cell' },
  { text: 'Нийт дүн',      value: 'totalCost',      sortable: true },
  { text: 'Захиалсан хоол', value: 'items',         sortable: false },
  { text: 'Төлбөр',        value: 'paymentStatus',  sortable: false },
  { text: 'Хүргэлт',       value: 'deliveryStatus', sortable: false },
  { text: 'Хаяг',          value: 'address',        sortable: false },
];



const sortDesc = ref<boolean[]>([]);

const filters = ref({
  user: '',
  dateRange: [] as string[],
  dateRangeFormatted: '',
  weekday: '',
  minTotal: null as number | null,
  maxTotal: null as number | null,
  paymentStatus: '',
  deliveryStatus: ''
});
const menu = ref(false);

async function fetchOrders() {
  loading.value = true;
  msg.value = '';
  try {
    const data = await useApi('/orders');
    if (Array.isArray(data)) {
      orders.value = data;
    } else {
      msg.value = 'Захиалга татахад алдаа гарлаа';
      msgType.value = 'error';
    }
  } catch (err: any) {
    msg.value = err.message || 'Сүлжээний алдаа';
    msgType.value = 'error';
  } finally {
    loading.value = false;
  }
}
onMounted(fetchOrders);
watch(
    () => filters.value.dateRange,
    (val) => {
      if (val.length === 2) {
        const [start, end] = val;
        filters.value.dateRangeFormatted = `${new Date(start).toLocaleDateString('mn-MN')} – ${new Date(end).toLocaleDateString('mn-MN')}`;
      } else {
        filters.value.dateRangeFormatted = '';
      }
    }
);


const filteredOrders = computed(() =>
    orders.value.filter(o => {

      if (filters.value.user) {
        const name = (o.user?.name || o.user?.email || '').toLowerCase();
        if (!name.includes(filters.value.user.toLowerCase())) return false;
      }

      if (filters.value.weekday && mongolianWeekdays[o.weekday] !== filters.value.weekday)
        return false;

      if (
          (filters.value.minTotal != null && o.totalCost < filters.value.minTotal) ||
          (filters.value.maxTotal != null && o.totalCost > filters.value.maxTotal)
      )
        return false;

      if (filters.value.dateRange.length === 2) {
        const [fromStr, toStr] = filters.value.dateRange;
        const orderDate = new Date(o.date);

        // Strip time part from both sides for accurate comparison
        const from = new Date(fromStr);
        from.setHours(0, 0, 0, 0);

        const to = new Date(toStr);
        to.setHours(23, 59, 59, 999);

        if (orderDate < from || orderDate > to) return false;
      }


      if (filters.value.paymentStatus && o.paymentStatus !== filters.value.paymentStatus)
        return false;
      return !(filters.value.deliveryStatus && o.deliveryStatus !== filters.value.deliveryStatus);


    })
);


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('mn-MN');
}

async function updateStatus(
    order: Order,
    field: 'paymentStatus' | 'deliveryStatus',
    value: string
) {
  try {
    await useApi(`/orders/${order._id}`, 'PUT', { [field]: value });
  } catch (err: any) {
    msg.value = err.message || 'Сүлжээний алдаа';
    msgType.value = 'error';
    await fetchOrders();
  }
}
function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
    case 'complete':
      return 'green';
    case 'delivering':
      return 'blue';
    case 'refund':
      return 'deep-orange';
    default:
      return 'grey';
  }
}
</script>
<style scoped>
.address-cell {
  max-width: 200px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-cell {
  width: 150px;
}
</style>

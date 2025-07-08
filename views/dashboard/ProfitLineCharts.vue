<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { hexToRgb } from '~/@layouts/utils'
import { useApi } from '@/composables/useApi'

const vuetifyTheme = useTheme()


const totalRevenue = ref(0)
const series = ref<{ data: number[] }>({ data: [] } as any)
const loading = ref(false)
const error = ref<string|null>(null)


const last7Days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setHours(0,0,0,0)
  d.setDate(d.getDate() - (6 - i))
  return d.getTime()
})


const fetchRevenue = async () => {
  loading.value = true
  error.value = null

  try {
    const orders: any[] = await useApi('/orders', 'GET')
    const daily = new Array<number>(7).fill(0)
    let sum = 0

    for (const o of orders) {
      const cost = o.totalCost || 0
      sum += cost

      const d = new Date(o.date)
      d.setHours(0,0,0,0)
      const ts = d.getTime()
      const idx = last7Days.indexOf(ts)
      if (idx !== -1) daily[idx] += cost
    }

    totalRevenue.value = sum
    series.value = { data: daily }
  } catch (err: any) {
    error.value = err.message || 'Failed to load revenue'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRevenue)


const chartOptions = computed(() => {
  const colors = vuetifyTheme.current.value.colors
  const vars   = vuetifyTheme.current.value.variables

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: { enabled: false },
    grid: {
      borderColor: `rgba(${hexToRgb(String(vars['border-color']))},${vars['border-opacity']})`,
      strokeDashArray: 6,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: -10, left: -7, right: 5, bottom: 5 },
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight',
    },
    colors: [colors.primary],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [{
        size: 5.5,
        seriesIndex: 0,
        dataPointIndex: series.value.data.length - 1,
        strokeColor: colors.primary,
        fillColor: colors.surface,
      }],
      hover: { size: 7 },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <div v-if="loading" class="text-center py-4">Loading…</div>
      <div v-else>
        <h4 class="text-h5">
          {{ totalRevenue.toLocaleString('mn-MN', { style: 'currency', currency: 'MNT' }) }}
        </h4>

        <VueApexCharts
            type="line"
            :options="chartOptions"
            :series="[series]"
            :height="80"
            class="my-1"
        />

        <h6 class="text-h6 text-center">
          Нийт орлого (сүүлийн 7 хоног)
        </h6>
      </div>
      <div v-if="error" class="text-error text-center mt-2">{{ error }}</div>
    </VCardText>
  </VCard>
</template>

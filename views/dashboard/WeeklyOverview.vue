<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { hexToRgb } from '~/@layouts/utils'
import MoreBtn from '~/components/Admin/MoreBtn.vue'
import { useApi } from '@/composables/useApi'

const vuetifyTheme = useTheme()
const series     = ref<{ data: number[] }>({ data: [] } as any)
const changePct  = ref(0)
const loading    = ref(false)
const error      = ref<string|null>(null)

const moreList = [
  { title: 'Share',   value: 'Share'   },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update',  value: 'Update'  },
]
function buildWeekFromMonday(offsetDays: number) {
  const arr: number[] = []
  const today = new Date()
  const jsDay  = today.getDay()
  const monday = new Date(today)
  monday.setHours(0,0,0,0)
  monday.setDate(today.getDate() - ((jsDay + 6) % 7) - offsetDays)
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    arr.push(d.getTime())
  }
  return arr
}
const thisWeek = buildWeekFromMonday(0)
const prevWeek = buildWeekFromMonday(7)

const fetchStats = async () => {
  loading.value = true
  error.value   = null

  try {
    const orders: any[] = await useApi('/orders', 'GET')
    const thisData = new Array<number>(7).fill(0)
    const prevData = new Array<number>(7).fill(0)

    orders.forEach(o => {
      const ts = new Date(o.date).setHours(0,0,0,0)
      const idxThis = thisWeek.indexOf(ts)
      if (idxThis !== -1) thisData[idxThis]++
      const idxPrev = prevWeek.indexOf(ts)
      if (idxPrev !== -1) prevData[idxPrev]++
    })

    const sumThis = thisData.reduce((a,b) => a+b, 0)
    const sumPrev = prevData.reduce((a,b) => a+b, 0)
    changePct.value = sumPrev === 0
        ? 100
        : Math.round(((sumThis - sumPrev)/sumPrev)*100)
    series.value = { data: thisData }
  } catch (err: any) {
    error.value = err.message || 'Failed to load stats'
    console.error(err)
  } finally {
    loading.value = false
  }
}
onMounted(fetchStats)
const onMoreAction = (val: string) => {
  if (val === 'Refresh') fetchStats()

}
const options = computed(() => {
  const c = vuetifyTheme.current.value.colors
  const v = vuetifyTheme.current.value.variables
  const disabledColor = `rgba(${hexToRgb(c['on-surface'])},${v['disabled-opacity']})`
  const borderColor   = `rgba(${hexToRgb(String(v['border-color']))},${v['border-opacity']})`

  return {
    chart: {
      offsetY: -10,
      offsetX: -15,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { borderRadius: 6, distributed: true, columnWidth: '30%' },
    },
    stroke: { width: 2, colors: [c.surface] },
    legend: { show: false },
    grid: { borderColor, strokeDashArray: 7, xaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    colors: [
      c['track-bg'], c['track-bg'], c['track-bg'],
      `rgba(${hexToRgb(c.primary)},1)`,
      c['track-bg'], c['track-bg'], c['track-bg'],
    ],
    states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
    xaxis: {
      categories: ['Дав','Мяг','Лха','Пүр','Ба','Бя','Ня'],
      tickPlacement: 'on',
      labels: { show: false },
      crosshairs: { opacity: 0 },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        style: { colors: disabledColor, fontSize: '13px' },
        formatter: (v: number) => v > 999 ? `${(v/1000).toFixed(0)}k` : v,
      },
    },
    responsive: [
      { breakpoint: 1560, options: { plotOptions: { bar: { columnWidth: '35%' } } } },
      { breakpoint: 1380, options: { plotOptions: { bar: { columnWidth: '45%' } } } },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>7 хоногийн тойм</VCardTitle>
      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" @select="onMoreAction" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div v-if="loading" class="text-center py-6">Loading…</div>
      <div v-else>
        <VueApexCharts
            type="bar"
            :options="options"
            :series="[series]"
            height="200"
        />
        <div class="d-flex align-center mb-5 gap-x-4">
          <h4 class="text-h4">{{ changePct }}%</h4>
          <p class="mb-0">{{ changePct }}% илүү борлуулалттай</p>
        </div>

        <VBtn block>дэлгэрэнгүй</VBtn>
        <div v-if="error" class="text-error mt-2">{{ error }}</div>
      </div>
    </VCardText>
  </VCard>
</template>

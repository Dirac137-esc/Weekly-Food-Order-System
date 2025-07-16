<script setup lang="ts">
import theMost from '@/views/dashboard/theMost.vue'

import frequentUser from '@/views/dashboard/frequentUser.vue'

import ProfitLineCharts from '@/views/dashboard/ProfitLineCharts.vue'
import Transactions from '@/views/dashboard/Transactions.vue'

import WeeklyOverview from '@/views/dashboard/WeeklyOverview.vue'
import CardStatisticsVertical from '~/@core/components/cards/CardStatisticsVertical.vue'

const totalProfit = {
  title: 'Нийт Орлого',
  color: 'secondary',
  icon: 'ri-pie-chart-2-line',
  stats: '255.6k',
  change: 42,
  subtitle: 'Weekly',
}

</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <theMost />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <Transactions />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <WeeklyOverview />
    </VCol>



    <VCol
      cols="12"
      md="4"
    >
      <VRow class="match-height">
        <VCol
          cols="12"
          sm="6"
        >
          <ProfitLineCharts />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical v-bind="totalProfit" />
        </VCol>



      </VRow>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <frequentUser />
    </VCol>




  </VRow>
</template>

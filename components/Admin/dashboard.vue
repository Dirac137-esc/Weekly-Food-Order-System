<script setup lang="ts">
import theMost from '@/views/dashboard/theMost.vue'

import frequentUser from '@/views/dashboard/frequentUser.vue'

import ProfitLineCharts from '@/views/dashboard/ProfitLineCharts.vue'
import Transactions from '@/views/dashboard/Transactions.vue'

import WeeklyOverview from '@/views/dashboard/WeeklyOverview.vue'
import CardStatisticsVertical from '~/@core/components/cards/CardStatisticsVertical.vue'

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'ri-pie-chart-2-line',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}

const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'ri-file-word-2-line',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
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

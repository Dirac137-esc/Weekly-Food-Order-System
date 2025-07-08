<script setup lang="ts">
import { ref,  onMounted } from 'vue'
import MoreBtn from '~/@core/components/MoreBtn.vue'
import { useApi } from '@/composables/useApi'


const customers = ref<Array<{
  abbr: string
  amount: string
  country: string
  sales: string
  change: string
  color: string
}>>([])
const loading  = ref(false)
const error    = ref<string|null>(null)

const moreList = [
  { title: 'Refresh',    value: 'Refresh'    },
  { title: 'Yesterday',  value: 'Yesterday'  },
  { title: 'Last Week',  value: 'Last Week'  },
  { title: 'Last Month', value: 'Last Month' },
]


const loadTopCustomers = async () => {
  loading.value = true
  error.value   = null
  try {
    const orders: any[] = await useApi('/orders?populate=user', 'GET')
    type Agg = { name: string; total: number; count: number }
    const map = new Map<string, Agg>()

    orders.forEach(o => {
      const user = typeof o.user === 'object' && o.user.name
          ? o.user.name
          : String(o.user)

      if (!map.has(user)) {
        map.set(user, { name: user, total: 0, count: 0 })
      }
      const rec = map.get(user)!
      rec.total += o.totalCost || 0
      rec.count += 1
    })
    const arr = Array.from(map.values()).map(r => {
      const change = '+0.0%'
      const abbr = r.name
          .split(' ')
          .map(w => w.charAt(0).toUpperCase())
          .join('')
          .slice(0,2)
      const sales = `${r.count}захиалга`
      return {
        abbr,
        country: r.name,
        amount:  r.total.toLocaleString('mn-MN', { style: 'currency', currency: 'MNT' }),
        change,
        sales,
        color: 'primary',
      }
    })

    customers.value = arr
        .sort((a,b) => {
          const na = Number(a.amount.replace(/\D/g, ''))
          const nb = Number(b.amount.replace(/\D/g, ''))
          return nb - na
        })
        .slice(0,5)
  } catch (err: any) {
    error.value = err.message || 'Алдаа гарлаа'
  } finally {
    loading.value = false
  }
}
onMounted(loadTopCustomers)
const onMoreAction = (val: string) => {
  if (val === 'Refresh') loadTopCustomers()
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Шилдэг худалдан авагчид</VCardTitle>
      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" @select="onMoreAction" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div v-if="loading" class="text-center py-6">Loading…</div>
      <div v-else>
        <VList class="card-list">
          <VListItem
              v-for="c in customers"
              :key="c.country"
          >
            <template #prepend>
              <VAvatar variant="tonal" size="40" :color="c.color">
                {{ c.abbr }}
              </VAvatar>
            </template>

            <VListItemTitle class="mb-1 d-flex align-center">
              <h6 class="text-h6">{{ c.amount }}</h6>
              <VIcon
                  size="24"
                  :color="c.change.charAt(0) === '+' ? 'success' : 'error'"
                  class="mx-1"
              >
                {{ c.change.charAt(0) === '+'
                  ? 'ri-arrow-up-s-line'
                  : 'ri-arrow-down-s-line' }}
              </VIcon>
              <div
                  :class="c.change.charAt(0) === '+' ? 'text-success' : 'text-error'"
                  class="text-body-1"
              >
                {{ c.change.slice(1) }}
              </div>
            </VListItemTitle>

            <VListItemSubtitle class="text-body-1 me-2">
              {{ c.country }}
            </VListItemSubtitle>

            <template #append>
              <div>
                <h6 class="text-h6 mb-1">{{ c.sales }}</h6>
                <div class="text-body-2 text-disabled text-end">
                  худалдан авалт
                </div>
              </div>
            </template>
          </VListItem>
        </VList>

        <div v-if="error" class="text-error mt-2">{{ error }}</div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.card-list {
  --v-card-list-gap: 0.875rem;
}
</style>

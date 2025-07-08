<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import trophy from 'public/zurag/trophy.png'

const stats = ref<{ name: string; count: number }[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchStats = async () => {
  loading.value = true
  error.value = null
  try {
    const orders = await useApi('/orders', 'GET')

    const foodMap = new Map<string, { name: string; count: number }>()

    for (const order of orders) {
      for (const item of order.items) {
        const food = item.food
        const key = typeof food === 'object' && food._id ? food._id : food
        const name = typeof food === 'object' && food.name ? food.name : 'Unknown'

        if (!foodMap.has(key)) {
          foodMap.set(key, { name, count: 0 })
        }
        foodMap.get(key)!.count += item.qty
      }
    }

    stats.value = Array.from(foodMap.values()).sort((a, b) => b.count - a.count)
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch stats'
  } finally {
    loading.value = false
  }
}
onMounted(fetchStats)
const topFood = computed(() => stats.value[0] || { name: 'Loading...', count: 0 })
const totalQty = computed(() =>
    stats.value.reduce((sum, food) => sum + food.count, 0)
)
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-2">
        <h5 class="text-h5">
          {{ topFood.name }} <span class="text-high-emphasis">🎉</span>
        </h5>
        <div class="text-body-1">
          Сарын хамгийн эрэлттэй хоол
        </div>
      </div>
      <h4 class="text-h4 text-primary">

        {{ topFood.count }} удаа захиалсан
      </h4>
      <div class="text-body-1 mb-2">
        Нийт хэрэглэгчдийн {{ ((topFood.count / totalQty) * 100).toFixed(0) }}% <span class="text-high-emphasis">🚀</span>
      </div>
      <VBtn size="small" @click="fetchStats" :loading="loading">
        Борлуулалтыг шинэчлэх
      </VBtn>

      <div v-if="error" class="text-error mt-2">
        Алдаа: {{ error }}
      </div>
    </VCardText>

    <VImg
        :src="trophy"
        class="trophy"
    />
  </VCard>
</template>

<style lang="scss" scoped>
.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>

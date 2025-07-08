import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const stats = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useOrderStats() {
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

    return {
        stats,
        loading,
        error,
        fetchStats,
        top5Foods: computed(() => stats.value.slice(0, 5)),
    }
}

<template>
  <v-container class="py-6">
    <v-row>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="bg-primary text-white">СОНГОЛТ</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list class="pa-0">
              <v-list-item
                  v-for="food in foods"
                  :key="food._id"
                  class="food-item elevation-1 rounded-lg mb-3"
                  draggable="true"
                  @dragstart="dragFood($event, food)"
              >
                <template #prepend>
                  <v-avatar size="56" rounded="lg" class="me-3">
                    <v-img :src="food.imageUrl" cover />
                  </v-avatar>
                </template>

                <v-list-item>
                  <v-list-item-title class="text-subtitle-1 font-weight-medium">
                    {{ food.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-grey-darken-1">
                    ₮{{ food.price.toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item-action>
                  <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditFoodModal(food)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="red"
                      @click="deleteFood(food._id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-btn block class="mt-4" color="primary" @click="openAddFoodModal">
              <v-icon left>mdi-plus</v-icon>
              Шинэ Хоол Нэмэх
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Меню -->
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="bg-secondary text-white">7 ХОНОГИЙН ТӨЛӨВЛӨГӨӨ</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="align-center mb-4">
              <v-col cols="12" md="6">
                <v-label>Сонгох</v-label>
                <v-text-field
                    type="week"
                    v-model="selectedWeek"
                    @change="onWeekChange"
                    density="compact"
                    hide-details
                />
              </v-col>
              <v-col cols="12" md="6" class="text-end">
                <v-btn color="primary" class="mr-2" @click="loadMenuForWeek">
                  Энэ Долоо Хоног
                </v-btn>
                <v-btn
                    v-if="!currentMenu"
                    color="success"
                    class="mr-2"
                    @click="createNewMenu"
                >
                  ШИНЭЭР МЕНЮ ҮҮСГЭХ
                </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!currentMenu"
                    @click="saveMenu"
                >
                  ХАДГАЛАХ
                </v-btn>
              </v-col>
            </v-row>

            <!-- 7 хоног -->
            <v-row>
              <v-col
                  v-for="day in weekDays"
                  :key="day.name"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
              >

              <v-card :class="{ 'opacity-50': !currentMenu }" outlined>
                <v-card-title
                    class="d-flex flex-column align-center text-center pa-2"
                    style="min-height: 60px;"
                >
  <span class="text-body-1 font-weight-medium">
    {{ getMongolianDayLabel(day.name) }}
  </span>
                  <span class="text-caption text-grey">
    {{ day.date }}
  </span>
                </v-card-title>


                <v-divider></v-divider>
                  <v-card-text
                      class="day-drop-zone"
                      @dragover.prevent="currentMenu && $event.preventDefault()"
                      @drop="currentMenu && dropFood($event, day)"
                  >
                    <div v-if="day.foods.length">
                      <v-chip
                          v-for="food in day.foods"
                          :key="food._id"
                          closable
                          size="small"
                          variant="elevated"
                          color="indigo-lighten-4"
                          text-color="indigo-darken-3"
                          class="ma-1 px-3 rounded-lg font-weight-medium text-sm"
                          @click:close="removeFoodFromDay(day.name, food._id)"
                      >
                        {{ food.name }}
                      </v-chip>


                    </div>
                    <div v-else class="text-center text-grey">Drop foods here</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="showFoodModal" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">
            {{ editingFood ? 'Edit Food' : 'Add New Food' }}
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="submitFoodForm">
            <v-text-field label="Name" v-model="foodForm.name" required />
            <v-text-field label="Price" type="number" v-model.number="foodForm.price" required />
            <v-text-field label="Image URL" v-model="foodForm.imageUrl" required />
            <v-textarea label="Ingredients (comma-separated)" v-model="foodForm.ingredients" />

            <v-card-actions class="justify-end mt-2">
              <v-btn text @click="closeFoodModal">Cancel</v-btn>
              <v-btn type="submit" color="primary">
                {{ editingFood ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

const API_BASE = 'https://backend-production-25f11.up.railway.app'

export default {
  data() {
    return {
      foods: [],
      weekDays: [
        { name: 'monday', date: '', foods: [] },
        { name: 'tuesday', date: '', foods: [] },
        { name: 'wednesday', date: '', foods: [] },
        { name: 'thursday', date: '', foods: [] },
        { name: 'friday', date: '', foods: [] },
        { name: 'saturday', date: '', foods: [] },
        { name: 'sunday', date: '', foods: [] }
      ],

      selectedWeek: '',
      currentMenu: null,
      showFoodModal: false,
      editingFood: null,
      foodForm: {
        name: '',
        price: 0,
        imageUrl: '',
        ingredients: ''
      },
      draggedFood: null
    }
  },
  computed: {
    headers() {
      const token = localStorage.getItem('token')
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  },
  mounted() {
    this.fetchFoods()
    this.setDefaultWeek()
    this.loadMenuForWeek()

  },
  methods: {
// --- FOOD CRUD ---
    async fetchFoods() {
      try {
        const { data } = await axios.get(`${API_BASE}/foods`, { headers: this.headers })
        this.foods = data
      } catch (e) {
        console.error('Error fetching foods:', e)
      }
    },
    getMongolianDayLabel(dayName) {
      const labels = {
        monday: 'Даваа',
        tuesday: 'Мягмар',
        wednesday: 'Лхагва',
        thursday: 'Пүрэв',
        friday: 'Баасан',
        saturday: 'Бямба',
        sunday: 'Ням'
      }
      return labels[dayName] || dayName
    },
    openAddFoodModal() {
      this.editingFood = null
      this.foodForm = { name: '', price: 0, imageUrl: '', ingredients: '' }
      this.showFoodModal = true
    },
    openEditFoodModal(food) {
      this.editingFood = food
      this.foodForm = {
        name: food.name,
        price: food.price,
        imageUrl: food.imageUrl,
        ingredients: food.ingredients.join(', ')
      }
      this.showFoodModal = true
    },

    closeFoodModal() {
      this.showFoodModal = false
    },
    async saveMenu() {
      if (!this.currentMenu) {
        return alert('No menu loaded to save.')
      }

      const daysPayload = this.weekDays.reduce((acc, day) => {
        acc[day.name] = day.foods.map(f => f._id)
        return acc
      }, {})

      const payload = {
        startDate: this.currentMenu.startDate,
        endDate: this.currentMenu.endDate,
        days: daysPayload
      }

      try {
        const res = await axios.put(
            `${API_BASE}/menus/${this.currentMenu._id}`,
            payload,
            { headers: this.headers }
        )
        console.log('✅ Хадгалалт амжилттай:', res.data)
        alert('Меню хадгалагдлаа')
        await this.loadMenuForWeek()
      } catch (err) {

        console.error('❌ Хадгалахад алдаа гарлаа:', err.response || err)
        alert(
            'Хадгалалт Амжилтгүй.\n' +
            (err.response?.data?.message || err.message)
        )
      }
    }
, async submitFoodForm() {
      const payload = {
        name: this.foodForm.name,
        price: this.foodForm.price,
        imageUrl: this.foodForm.imageUrl,
        ingredients: this.foodForm.ingredients
            .split(',')
            .map(i => i.trim())
            .filter(i => i)
      }
      try {
        if (this.editingFood) {
          await axios.put(`${API_BASE}/foods/${this.editingFood._id}`, payload, {
            headers: this.headers
          })
        } else {
          await axios.post(`${API_BASE}/foods`, payload, {
            headers: this.headers
          })
        }
        await this.fetchFoods()
        this.closeFoodModal()
      } catch (e) {
        console.error('Хоол хадгалахад алдаа гарлаа:', e)
      }
    },
    async deleteFood(foodId) {
      if (!confirm('Устгахдаа итгэлтэй байна уу?')) return
      try {
        await axios.delete(`${API_BASE}/foods/${foodId}`, { headers: this.headers })
        await this.fetchFoods()

        this.weekDays.forEach(d => {
          d.foods = d.foods.filter(f => f._id !== foodId)
        })
      } catch (e) {
        console.error('Устгахад алдаа гарлаа:', e)
      }
    },


    setDefaultWeek() {
      const today = new Date()
      const year = today.getFullYear()
      const week = Math.ceil(
          ((today - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7
      )
      this.selectedWeek = `${year}-W${String(week).padStart(2, '0')}`
      this.calculateWeekDates()
    },
    async onWeekChange() {
      this.calculateWeekDates()
      await this.loadMenuForWeek()
      if (!this.currentMenu) {
        await this.createNewMenu()
        await this.loadMenuForWeek()
      }
    },

    calculateWeekDates() {
      const [year, weekStr] = this.selectedWeek.split('-W')
      const weekNum = parseInt(weekStr, 10)
//##########################-------------UB локал цаг ----------##############################
      const jan4Utc = new Date(Date.UTC(year, 0, 4))
      const jan4Ub = new Date(
          jan4Utc.toLocaleString('en-US', { timeZone: 'Asia/Ulaanbaatar' })
      )

      const dow = (jan4Ub.getDay() || 7) - 1
      const week1Mon = new Date(jan4Ub)
      week1Mon.setDate(jan4Ub.getDate() - dow)
      // Меню зөвхөн 1дэх өдрөөс эхлэх болнооо
      const targetMon = new Date(week1Mon)
      targetMon.setDate(week1Mon.getDate() + (weekNum - 1) * 7)
      // 1 дэхээс 7 хүртэл форматанд оруулах
      this.weekDays.forEach((day, i) => {
        const d = new Date(targetMon)
        d.setDate(targetMon.getDate() + i)
        const ubLocal = new Date(
            d.toLocaleString('en-US', { timeZone: 'Asia/Ulaanbaatar' })
        )
        day.date = ubLocal.toISOString().split('T')[0]
      })
    },


//##########################-------------Меню ачаалалт, үүсгэлт ----------##############################
    async loadMenuForWeek() {
      try {

        const { data: menus } = await axios.get(`${API_BASE}/menus`, {
          headers: this.headers
        })


        const selectedStart = this.weekDays[0].date
        const match = menus.find(menu =>
            menu.weekStart.slice(0, 10) === selectedStart
        )

        this.currentMenu = match || null

        if (this.currentMenu) {
          this.populateMenuDays()
        } else {
          this.clearMenuDays()
        }
      } catch (e) {
        console.error('Ачаалахад алдаа гарлаа:', e)
        this.currentMenu = null
        this.clearMenuDays()
      }
    }
    ,
    populateMenuDays() {
      this.weekDays.forEach(day => {

        day.foods = this.currentMenu.days[day.name] || []
      })
    },
    clearMenuDays() {
      this.weekDays.forEach(day => {
        day.foods = []
      })
    },
    async createNewMenu() {
      const emptyDays = this.weekDays.reduce((acc, d) => {
        acc[d.name] = []
        return acc
      }, {})

      try {
        // Сонгогдсон 7 хонгоос 1дэхийг авах
        const weekStart = this.weekDays[0].date // үргэлж 1дэх

        const { data } = await axios.post(
            `${API_BASE}/menus`,
            {
              weekStart,
              days: emptyDays
            },
            { headers: this.headers }
        )
        this.currentMenu = data
        alert('Шинэ меню үүслээ!')
      } catch (e) {
        if (e.response?.status === 409) {
          alert('Энэ 7 хонгийн меню аль хэдийн үүссэн байна.')
        } else {
          console.error('меню үүсгэхэд алдаа гарлаа:', e)
          alert('меню үүсгэлт амжилтгүй.')
        }
      }
    },


//##########################-------------Draggin' hmmm ----------##############################
    dragFood(evt, food) {
      this.draggedFood = food
      evt.dataTransfer.setData('text/plain', food._id)
    },
    async dropFood(evt, day) {
      evt.preventDefault()
      if (!this.currentMenu || !this.draggedFood) return
      try {
        await axios.post(
            `${API_BASE}/menus/${this.currentMenu._id}/days/${day.name}/${this.draggedFood._id}`,
            {},
            { headers: this.headers }
        )
        // append locally
        if (!day.foods.find(f => f._id === this.draggedFood._id)) {
          day.foods.push({ ...this.draggedFood })
        }
      } catch (e) {
        console.error('Хоол нэмэхэд алдаа гарлаа:', e)
      }
    },
    async removeFoodFromDay(dayName, foodId) {
      try {
        await axios.delete(
            `${API_BASE}/menus/${this.currentMenu._id}/days/${dayName}/${foodId}`,
            { headers: this.headers }
        )
        const day = this.weekDays.find(d => d.name === dayName)
        if (day) {
          day.foods = day.foods.filter(f => f._id !== foodId)
        }
      } catch (e) {
        console.error('Тухайн өдрөөс хоол устгахад алдаа гарлаа:', e)
      }
    }
  }
}
</script>

<style scoped>



.day-column h3 {
  word-break: break-word;
  white-space: normal;
  font-size: 0.95rem;
  line-height: 1.2rem;
}
.day-drop-zone {
  min-height: 160px;
  padding: 1rem;
  background-color: #f9f9f9;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.opacity-50 {
  opacity: 0.5;
  pointer-events: none;
}




</style>

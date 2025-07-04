<template>
  <v-app>
    <v-navigation-drawer app permanent width="220">
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-h6">Админ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item
          v-for="item in menu"
          :key="item.key"
          :active="selected === item.key"
          @click="selected = item.key"
          class="sidebar-btn"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <h2 class="mb-4">{{ menu.find(m => m.key === selected)?.title }}</h2>
        <div v-if="selected === 'menu'">
          <v-alert type="info" border="start" class="mb-4">Хоолны цэс засварлах</v-alert>
          <!-- Add Food Form -->
          <v-form @submit.prevent="addFood" class="mb-4 d-flex flex-wrap align-center gap-2">
            <v-text-field v-model="newFood.name" label="Хоолны нэр" dense required style="max-width:180px"/>
            <v-text-field v-model="newFood.desc" label="Тайлбар" dense style="max-width:180px"/>
            <v-text-field v-model="newFood.price" label="Үнэ" dense type="number" style="max-width:120px"/>
            <v-text-field v-model="newFood.imageUrl" label="Зураг (URL)" dense style="max-width:220px"/>
            <v-btn color="primary" type="submit" :loading="foodLoading">Нэмэх</v-btn>
          </v-form>
          <v-alert v-if="foodMsg" :type="foodMsgType" class="mb-2">{{ foodMsg }}</v-alert>
          <!-- Food List -->
          <v-table>
            <thead>
              <tr>
                <th>Зураг</th>
                <th>Нэр</th>
                <th>Тайлбар</th>
                <th>Үнэ</th>
                <th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="food in foods" :key="food._id">
                <td>
                  <v-img :src="food.imageUrl" height="40" width="40" cover></v-img>
                </td>
                <td>
                  <v-text-field v-model="food.name" dense hide-details @blur="updateFood(food)" />
                </td>
                <td>
                  <v-text-field v-model="food.desc" dense hide-details @blur="updateFood(food)" />
                </td>
                <td>
                  <v-text-field v-model="food.price" dense hide-details type="number" @blur="updateFood(food)" style="max-width:90px"/>
                </td>
                <td>
                  <v-btn icon color="error" @click="deleteFood(food._id)" :loading="deleteLoadingId===food._id">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div v-else-if="selected === 'dashboard'">
          <v-alert type="info" border="start" class="mb-4">Админ самбар тавтай морил!</v-alert>
          <p>Энд захиалгын статистик, хэрэглэгчийн тоо гэх мэт ерөнхий мэдээлэл харуулна.</p>
        </div>
        <div v-else-if="selected === 'users'">
          <v-alert type="success" border="start" class="mb-4">Хэрэглэгчид</v-alert>
          <v-btn color="primary" class="mb-3" @click="fetchUsers" :loading="usersLoading">Шинэчлэх</v-btn>
          <v-alert v-if="usersMsg" :type="usersMsgType" class="mb-2">{{ usersMsg }}</v-alert>
          <v-table>
            <thead>
              <tr>
                <th>Нэр</th>
                <th>И-мэйл</th>
                <th>Утас</th>
                <th>Хаяг</th>
                <th>Role</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name || user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.address }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user._id }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div v-else-if="selected === 'orders'">
          <v-alert type="warning" border="start" class="mb-4">Захиалгууд</v-alert>
          <p>Энд бүх захиалгын жагсаалт, төлөв, дэлгэрэнгүй харагдана.</p>
        </div>
        <div v-else>
          <v-alert type="error" border="start" class="mb-4">Сонголт олдсонгүй</v-alert>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menu = [
  { key: 'dashboard', title: 'Самбар', icon: 'mdi-view-dashboard' },
  { key: 'users', title: 'Хэрэглэгчид', icon: 'mdi-account-group' },
  { key: 'orders', title: 'Захиалгууд', icon: 'mdi-receipt' },
  { key: 'menu', title: 'Хоолны цэс', icon: 'mdi-food' }
]
const selected = ref('dashboard')

// Food menu state
const foods = ref([])
const foodLoading = ref(false)
const deleteLoadingId = ref('')
const foodMsg = ref('')
const foodMsgType = ref('success')
const newFood = ref({ name: '', desc: '', price: '', imageUrl: '' })

// Fetch food list from backend
async function fetchFoods() {
  foodLoading.value = true
  try {
    const res = await fetch('https://backend-production-88df.up.railway.app/foods')
    const data = await res.json()
    foods.value = Array.isArray(data) ? data : (data.foods || [])
  } catch (e) {
    foodMsg.value = 'Хоолны жагсаалт авахад алдаа гарлаа'
    foodMsgType.value = 'error'
  }
  foodLoading.value = false
}
onMounted(fetchFoods)

// хоол нэмэх функц
async function addFood() {
  foodLoading.value = true
  foodMsg.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('https://backend-production-88df.up.railway.app/foods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newFood.value.name,
        desc: newFood.value.desc,
        price: Number(newFood.value.price),
        imageUrl: newFood.value.imageUrl
      })
    })
    const data = await res.json()
    if (res.ok) {
      foodMsg.value = 'Хоол амжилттай нэмэгдлээ'
      foodMsgType.value = 'success'
      newFood.value = { name: '', desc: '', price: '', imageUrl: '' }
      fetchFoods()
    } else {
      foodMsg.value = data.message || 'Хоол нэмэхэд алдаа гарлаа'
      foodMsgType.value = 'error'
    }
  } catch (e) {
    foodMsg.value = 'Сүлжээний алдаа'
    foodMsgType.value = 'error'
  }
  foodLoading.value = false
}

// Update food (inline edit)
async function updateFood(food) {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://backend-production-88df.up.railway.app/foods/${food._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: food.name,
        desc: food.desc,
        price: Number(food.price),
        imageUrl: food.imageUrl
      })
    })
    const data = await res.json()
    if (!res.ok) {
      foodMsg.value = data.message || 'Засахад алдаа гарлаа'
      foodMsgType.value = 'error'
    }
  } catch (e) {
    foodMsg.value = 'Сүлжээний алдаа'
    foodMsgType.value = 'error'
  }
}

// хоол хасах функц
async function deleteFood(id) {
  deleteLoadingId.value = id
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`https://backend-production-88df.up.railway.app/foods/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (res.ok) {
      foodMsg.value = 'Устгагдлаа'
      foodMsgType.value = 'success'
      fetchFoods()
    } else {
      foodMsg.value = data.message || 'Устгахад алдаа гарлаа'
      foodMsgType.value = 'error'
    }
  } catch (e) {
    foodMsg.value = 'Сүлжээний алдаа'
    foodMsgType.value = 'error'
  }
  deleteLoadingId.value = ''
}

// User management state
const users = ref([])
const usersLoading = ref(false)
const usersMsg = ref('')
const usersMsgType = ref('success')

// Fetch all users from backend
async function fetchUsers() {
  usersLoading.value = true
  usersMsg.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('https://backend-production-88df.up.railway.app/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (res.ok) {
      users.value = Array.isArray(data) ? data : (data.users || [])
      usersMsg.value = ''
    } else {
      usersMsg.value = data.message || 'Хэрэглэгчдийн жагсаалт авахад алдаа гарлаа'
      usersMsgType.value = 'error'
    }
  } catch (e) {
    usersMsg.value = 'Сүлжээний алдаа'
    usersMsgType.value = 'error'
  }
  usersLoading.value = false
}
// Автоматаар хэрэглэгчдийн жагсаалтыг ачааллах
onMounted(fetchUsers)
</script>

<style scoped>
.sidebar-btn {
  cursor: pointer;
}
.sidebar-btn.v-list-item--active {
  background: #e3f2fd !important;
}
</style>
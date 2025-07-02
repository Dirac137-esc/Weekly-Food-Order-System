<template>
  <v-container class="pt-16">
    <v-card class="mx-auto" max-width="500">
      <v-card-title>
        <v-avatar size="64" class="me-4">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
        </v-avatar>
        <div>
          <h2 class="text-h6 mb-1">{{ user.name || 'Зочин' }}</h2>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list density="compact" v-if="user && !editing">
          <v-list-item>
            <v-list-item-title>Майл</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email || user?.mail || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Нэр</v-list-item-title>
            <v-list-item-subtitle>{{ user?.name || user?.username || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Утас</v-list-item-title>
            <v-list-item-subtitle>{{ user?.phone || user?.phonenumber || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Хаяг</v-list-item-title>
            <v-list-item-subtitle>{{ user?.address || '-' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <!-- Edit form -->
        <div v-else-if="user && editing">
          <v-form @submit.prevent="saveProfile">
            <v-text-field v-model="editName" label="Нэр" required class="mb-2"/>
            <v-text-field v-model="editPhone" label="Утас" required class="mb-2"/>
            <v-text-field v-model="editAddress" label="Хаяг" class="mb-2"/>
            <v-btn color="primary" type="submit" class="me-2">Хадгалах</v-btn>
            <v-btn color="grey" @click="cancelEdit">Болих</v-btn>
            <div v-if="editResult" :class="editResultColor + ' mt-2'">{{ editResult }}</div>
          </v-form>
        </div>
        <div v-else class="text-center grey--text">Та нэвтрээгүй байна.</div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="user && !editing" color="primary" @click="editProfile">Засах</v-btn>
        <v-btn v-if="user" color="error" class="ms-2" @click="logout">Гарах</v-btn>
        <router-link v-if="!user" to="/auth">
          <v-btn color="secondary" class="ms-2">Нэвтрэх / Бүртгүүлэх</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref({})
const router = useRouter()

const editing = ref(false)
const editName = ref('{}')
const editEmail = ref('')
const editPhone = ref('{}')
const editAddress = ref('{}')
const editResult = ref('{}')
const editResultColor = ref('text-success')

onMounted(() => {
  const userStr = localStorage.getItem('user')
  user.value = userStr ? JSON.parse(userStr) : null
})

function editProfile() {
  editing.value = true
  editName.value = user.value.name || ''
  editPhone.value = user.value.phone || ''
  editAddress.value = user.value.address || ''
  editResult.value = ''
}

function cancelEdit() {
  editing.value = false
  editResult.value = ''
}

async function saveProfile() {
  editResult.value = ''
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`https://backend-production-88df.up.railway.app/users/${user.value.id}`, {
      method: 'PUT',
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editName.value,
        phone: editPhone.value,
        address: editAddress.value,
        email: editEmail.value 
      })
    })
    const data = await response.json()
    if (response.ok) {
      user.value.name = editName.value
      user.value.phone = editPhone.value
      user.value.address = editAddress.value
      localStorage.setItem('user', JSON.stringify(user.value))
      editResultColor.value = 'text-success'
      editResult.value = 'Амжилттай хадгалагдлаа.'
      setTimeout(() => {
        editing.value = false
        editResult.value = ''
      }, 1000)
    } else {
      editResultColor.value = 'text-error'
      editResult.value = data.message || 'Алдаа гарлаа, дахин оролдоно уу.'
    }
  } catch (error) {
    editResultColor.value = 'text-error'
    editResult.value = 'Сүлжээний алдаа, дахин оролдоно уу.'
  }
}

function logout() {
  localStorage.removeItem('user')
  user.value = null
  router.push('/auth')
}
</script>

<style scoped>
.text-success {
  color: green;
}
.text-error {
  color: red;
}
</style>



<template>
  <v-container class="pt-16">
    <v-card class="mx-auto" max-width="500">
      <v-card-title>
        <v-avatar size="64" class="me-4">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
        </v-avatar>
        <div>
          <h2 class="text-h6 mb-1">{{ user?.name || 'Зочин' }}</h2>
          <div class="text-body-2 text-grey">Joined: {{ user?.joined || '-' }}</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list density="compact" v-if="user">
          <v-list-item>
            <v-list-item-title>Майл</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Нэр</v-list-item-title>
            <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Утас</v-list-item-title>
            <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-center grey--text">Та нэвтрээгүй байна.</div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="user" color="primary" @click="editProfile">Засах</v-btn>
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

const user = ref(null)
const router = useRouter()

onMounted(() => {
  const userStr = localStorage.getItem('user')
  user.value = userStr ? JSON.parse(userStr) : null
})

function editProfile() {
  alert('Edit')
}

function logout() {
  localStorage.removeItem('user')
  user.value = null
  router.push('/auth')
}
</script>



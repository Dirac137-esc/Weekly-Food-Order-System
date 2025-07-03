<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>Хоолны захиалга</v-app-bar-title>
    <v-spacer />
    <v-btn icon to="/">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn icon @click="toCart">
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-btn icon to="/profile">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <!-- Админ зөвхөн admin хэрэглэгчид харагдана -->
    <v-btn v-if="isAdmin" icon to="/admin" title="Админ">
      <v-icon>mdi-pencil-circle</v-icon>
    </v-btn>
  </v-app-bar>  
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const user = ref(null)
const router = useRouter()
const route = useRoute()

function toCart()
{   
    router.push('/cart')
}


function updateUser() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user')
      user.value = userStr ? JSON.parse(userStr) : null
    } else {
      user.value = null
    }
  } catch (e) {
    user.value = null
  }
}

onMounted(updateUser)

watchEffect(() => {
  route.fullPath // dependency
  updateUser()
  // админ хамгаалах
  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin') &&
    !(user.value && (user.value.role === 'admin' || user.value.isAdmin === true))
  ) {
    router.replace('/')
  }
})

const isAdmin = computed(() =>
  user.value && (user.value.role === 'admin' || user.value.isAdmin === true)
)
</script>
<template>
  <v-container class="pt-16" max-width="400">
    <v-card>
      <v-card-title>Нэвтрэх</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="username" label="Хэрэглэгчийн нэр" required />
          <v-text-field v-model="password" label="Нууц үг" type="password" required />
          <v-btn color="primary" type="submit" block>Нэвтрэх</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
function login() {
  alert(`Нэвтэрч байна: ${username.value}`)
}
</script>
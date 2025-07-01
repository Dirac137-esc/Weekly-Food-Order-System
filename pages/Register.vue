<template>
  <v-container class="pt-16" max-width="400">
    <v-card>
      <v-card-title>Бүртгүүлэх</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field v-model="name" label="Нэр" required />
          <v-text-field v-model="email" label="Имэйл" type="email" required />
          <v-text-field v-model="username" label="Хэрэглэгчийн нэр" required />
          <v-text-field v-model="password" label="Нууц үг" type="password" required />
          <v-btn color="primary" type="submit" block>Бүртгүүлэх</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const username = ref('')
const password = ref('')

async function register() {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                username: username.value,
                password: password.value
            })
        })
        if (!response.ok) {
            throw new error('Бүртгэл амжилгүй')
                  }
        else { alert('Amjilttai')}
    }   catch (error) {
    alert('aldaa garlaa')
} 
}
</script>
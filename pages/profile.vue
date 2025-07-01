<template>
  <v-container class="pt-16">
    <v-card class="mx-auto" max-width="500">
      <v-card-title>
        <v-avatar size="64" class="me-4">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
        </v-avatar>
        <div>
          <h2 class="text-h6 mb-1">{{ user.name }}</h2>
          <div class="text-body-2 text-grey">Joined: {{ user.joined }}</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list density="compact">
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
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="editProfile">Засах</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
const user = {
  name: 'name name',
  email: 'name.com',
  username: 'username',
  phone: '+88118811',
  joined: '2024-06-30'
}

function editProfile() {
  alert('Edit')
}
</script>



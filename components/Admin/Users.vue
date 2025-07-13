<template>
  <v-container class="py-6">
    <v-card elevation="2">
      <v-card-title class="bg-primary text-white">
        <v-icon start class="mr-2">mdi-account-group</v-icon>
        Хэрэглэгчдийн жагсаалт
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="msg"
          :type="msgType"
          class="mb-4"
          border="start"
          variant="tonal"
        >
          {{ msg }}
        </v-alert>

        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 my-3">Нийт хэрэглэгч: {{ users.length }}</h3>
          <v-btn
            color="primary"
            @click="fetchUsers"
            :loading="loading"
            prepend-icon="mdi-refresh"
          >
            Шинэчлэх
          </v-btn>
        </div>

        <v-table class="elevation-1 rounded-lg" density="comfortable">
          <thead>
            <tr>
              <th>Нэр</th>
              <th>И-мэйл</th>
              <th>Утас</th>
              <th>Хаяг</th>
              <th>VIP status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name || user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || "—" }}</td>
              <td>{{ user.address || "—" }}</td>
              <td>
                <v-chip
                    :color="user.isVIP ? 'amber' : 'grey-lighten-1'"
                    :text-color="user.isVIP ? 'white' : 'grey-darken-4'"
                    size="small"
                    class="ma-1 font-weight-bold"
                    variant="elevated"
                >
                  {{ user.isVIP? '⭐ VIP' : 'Энгийн' }}
                </v-chip>
              </td>



            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

const users = ref<any[]>([]);
const loading = ref(false);
const msg = ref("");
const msgType = ref<"success" | "error">("success");
const config = useRuntimeConfig();
const API_BASE = config.public.apiBase;

function normalizeRoles(roles: any): string[] {
  if (Array.isArray(roles)) return roles;
  if (typeof roles === "string") return roles.split(",").map((r) => r.trim());
  return [];
}

async function fetchUsers() {
  loading.value = true;
  msg.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      users.value = Array.isArray(data) ? data : data.users || [];
    } else {
      msg.value = data.message || "Хэрэглэгчдийн жагсаалт авахад алдаа гарлаа";
      msgType.value = "error";
    }
  } catch (err) {
    msg.value = "Сүлжээний алдаа";
    msgType.value = "error";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUsers);
</script>
<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

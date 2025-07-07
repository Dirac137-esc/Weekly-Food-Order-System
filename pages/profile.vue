<template>
  <v-container class="profile-container py-8" fluid>
    <div class="profile-bg-overlay"></div>
    <!-- Header with back button -->
    <div class="header-section mb-5 profile-header">
      <div class="d-flex align-center">
        <v-btn 
          icon 
          variant="text" 
          @click="$router.go(-1)"
          class="mr-3"
          size="small"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="text-h5 font-weight-bold">Профайл</h1>
      </div>  
    </div>

    <!-- Profile Content -->
    <div v-if="userStore.user && !editing" class="profile-content-boxed">
      <v-row justify="center">
        <v-col cols="12" md="7" lg="5">
          <v-card class="profile-main-card pa-6" elevation="8">
            <div class="d-flex flex-column align-center">
              <!-- Avatar and Name -->
              <v-avatar size="120" class="mb-3 profile-avatar elevation-4" color="grey-lighten-4">
                <v-img 
                  :src="userStore.user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" 
                  alt="User Avatar"
                />  
              </v-avatar>
              <h2 class="text-h6 font-weight-bold mb-1">{{ userStore.user?.name || 'Username' }}</h2>
              <div class="text-grey-darken-1 mb-2">{{ userStore.user?.email }}</div>
              <v-btn color="primary" variant="tonal" size="small" class="mb-4" @click="editProfile">
                <v-icon left size="small">mdi-account-edit</v-icon> Хувийн мэдээлэл засах
              </v-btn>
            </div>

            <!-- Quick Actions -->
            <v-row class="quick-actions mb-4" justify="center">
              <v-col cols="4" class="text-center">
                <v-btn icon color="orange" variant="text">
                  <v-icon size="large">mdi-map-marker</v-icon>
                </v-btn>
                <div class="caption mt-1">Хаяг</div>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-btn icon color="pink" variant="text">
                  <v-icon size="large">mdi-heart</v-icon>
                </v-btn>
                <div class="caption mt-1">Хадгалсан</div>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-btn icon color="blue" variant="text">
                  <v-icon size="large">mdi-cog</v-icon>
                </v-btn>
                <div class="caption mt-1">Тохиргоо</div>
              </v-col>
            </v-row>

            <!-- Personal Info Card -->
            <v-card class="info-banner mb-4" color="orange-lighten-5" elevation="1">
              <v-list>
                <v-list-item>
                  <v-list-item-icon><v-icon color="primary">mdi-phone</v-icon></v-list-item-icon>
                  <v-list-item-title>{{ userStore.user?.phone || 'Утас оруулаагүй' }}</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item>
                  <v-list-item-icon><v-icon color="primary">mdi-map-marker</v-icon></v-list-item-icon>
                  <v-list-item-title>{{ userStore.user?.address || 'Хаяг оруулаагүй' }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Logout Button -->
            <v-btn color="error" variant="outlined" block @click="showLogoutDialog = true">
              <v-icon left size="small">mdi-logout</v-icon> Гарах
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Edit Form -->
    <div v-else-if="userStore.user && editing" class="edit-form">
      <v-card class="edit-card mx-auto" elevation="2" max-width="420">
        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveProfile">
            <!-- Avatar Section -->
            <div class="text-center mb-6">
              <v-avatar size="100" class="mb-4 elevation-2">
                <v-img 
                  :src="userStore.user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" 
                  alt="User Avatar"
                />
              </v-avatar>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onAvatarSelected"
              />
              <v-btn 
                variant="outlined" 
                color="primary" 
                size="small"
                prepend-icon="mdi-camera"
                @click="triggerFileInput"
                :loading="avatarUploading"
              >
                Зураг солих
              </v-btn>
            </div>

            <!-- Form Fields -->
            <div class="form-fields">
              <v-text-field 
                v-model="editName" 
                label="Нэр" 
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-4"
                hide-details
              />
              
              <v-text-field 
                v-model="editPhone" 
                label="Утасны дугаар" 
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                class="mb-4"
                hide-details
              />
              
              <v-text-field 
                v-model="editEmail" 
                label="И-мэйл хаяг" 
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-4"
                hide-details
              />
              
              <v-text-field 
                v-model="editAddress" 
                label="Гэрийн хаяг" 
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                class="mb-4"
                hide-details
              />
            </div>
            
            <!-- Alert -->
            <v-alert 
              v-if="editResult" 
              :type="editResultColor === 'text-success' ? 'success' : 'error'" 
              class="mb-4"
              variant="tonal"
            >
              {{ editResult }}
            </v-alert>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <v-btn 
                color="primary" 
                type="submit" 
                :loading="saving"
                size="large"
                block
                class="mb-3"
              >
                Хадгалах
              </v-btn>
              <v-btn 
                variant="outlined" 
                color="grey" 
                @click="cancelEdit"
                size="large"
                block
              >
                Болих
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- Not logged in -->
    <div v-else class="not-logged-in">
      <v-card class="text-center pa-8" elevation="0">
        <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-account-off</v-icon>
        <h3 class="text-h6 mb-2">Та нэвтрээгүй байна</h3>
        <p class="text-grey-darken-1 mb-6">Профайл үзэхийн тулд эхлээд нэвтэрнэ үү</p>
        <v-btn 
          color="primary" 
          size="large"
          @click="$router.push('/auth')"
          block
        >
          Нэвтрэх / Бүртгүүлэх
        </v-btn>
      </v-card>
    </div>

    <!-- Logout Confirmation Dialog -->
    <v-dialog v-model="showLogoutDialog" max-width="400">
      <v-card class="dialog-card">
        <v-card-title class="text-h6 pa-6">
          <v-icon class="mr-3" color="warning">mdi-alert</v-icon>
          Анхааруулга
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          Та системээс гарахдаа итгэлтэй байна уу?
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            variant="outlined" 
            color="grey" 
            @click="showLogoutDialog = false"
          >
            Болих
          </v-btn>
          <v-btn 
            color="error" 
            @click="logout" 
            class="ml-3"
          >
            Гарах
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore();
const router = useRouter()

// State variables
const editing = ref(false)
const saving = ref(false)
const showLogoutDialog = ref(false)
const fileInput = ref(null)
const avatarUploading = ref(false)

// Edit form data
const editName = ref('')
const editEmail = ref('')
const editPhone = ref('')
const editAddress = ref('')
const editResult = ref('')
const editResultColor = ref('text-success')


onMounted(() => {
    userStore.loadUser();
})

function editProfile() {
  editing.value = true
  editName.value = userStore.user.value.name || ''
  editEmail.value = userStore.user.value.email || ''
  editPhone.value = userStore.user.value.phone || ''
  editAddress.value = userStore.user.value.address || ''
  editResult.value = ''
}

function cancelEdit() {
  editing.value = false
  editResult.value = ''
}

async function saveProfile() {
  editResult.value = ''
  saving.value = true
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`https://backend-production-25f11.up.railway.app/users/${user.value.id}`, {
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
      userStore.user.value.name = editName.value
      userStore.user.value.phone = editPhone.value
      userStore.user.value.address = editAddress.value
      userStore.user.value.email = editEmail.value
      localStorage.setItem('user', JSON.stringify(userStore.user.value))
            
      setTimeout(() => {
        editing.value = false
        editResult.value = ''
      }, 1500)
    } else {
      editResultColor.value = 'text-error'
      editResult.value = data.message || 'Алдаа гарлаа, дахин оролдоно уу.'
    }
  } catch (error) {
    editResultColor.value = 'text-error'
    editResult.value = 'Сүлжээний алдаа, дахин оролдоно уу.'
  } finally {
    saving.value = false
  }
}

function triggerFileInput() {
  fileInput.value && fileInput.value.click()
}

async function onAvatarSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  avatarUploading.value = true
  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('avatar', file)
    // Change endpoint if your backend uses a different one
    const response = await fetch(`https://backend-production-25f11.up.railway.app/users/${userStore.user.value.id}/avatar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    const data = await response.json()
    if (response.ok && data.avatar) {
      userStore.user.value.avatar = data.avatar
      localStorage.setItem('user', JSON.stringify(userStore.user.value))
      editResultColor.value = 'text-success'
      editResult.value = 'Зураг амжилттай шинэчлэгдлээ!'
    } else {
      editResultColor.value = 'text-error'
      editResult.value = data.message || 'Зураг шинэчлэхэд алдаа гарлаа'
    }
  } catch (e) {
    editResultColor.value = 'text-error'
    editResult.value = 'Сүлжээний алдаа'
  }
  avatarUploading.value = false
}

function logout() {
  localStorage.removeItem('token')
  userStore.logOut();
  showLogoutDialog.value = false;
  router.push('/auth')
}

</script>

<style scoped>
.profile-container {
  position: relative;
  background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  min-height: 100vh;
  overflow: hidden;
}
.profile-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(2px);
  z-index: 0;
}
.v-container,
.profile-content,
.profile-content-boxed,
.edit-form,
.not-logged-in {
  position: relative;
  z-index: 1;
}
.profile-header {
  position: relative;
  z-index: 1;
}
.profile-content-boxed {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 60vh;
}
.profile-main-card {
  background: linear-gradient(135deg, #e3f0ff 0%, #f5faff 100%);
  border-radius: 22px;
  box-shadow: 0 4px 32px #1976d220;
}
.profile-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 12px #ff980033;
}
.info-banner {
  border-radius: 16px;
}
.quick-actions .v-btn {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px #ff980033;
  margin-bottom: 4px;
}
.quick-actions .caption {
  font-size: 0.85rem;
  color: #888;
}
.edit-card {
  border-radius: 18px;
}
.action-buttons .v-btn {
  font-weight: 600;
}
</style>

<template>
  <v-container class="profile-container" fluid>
    <!-- Header with back button -->
    <div class="header-section mb-3">
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
        <h1 class="text-h6 font-weight-medium">Профайл</h1>
      </div>  
    </div>

    <!-- Profile Content -->
    <div v-if="user && !editing" class="profile-content">
      <!-- Avatar and Phone Section -->
      <v-card class="profile-card mb-3" elevation="0">
        <v-card-text class="text-center pa-4">
          <v-avatar size="80" class="mb-3 profile-avatar">
            <v-img 
              :src="user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" 
              alt="User Avatar"
            />
          </v-avatar>
          <p class="text-body-1 mb-2 phone-number">{{ user?.phone || '+976 9444 7509' }}</p>
          
          <!-- Quick Actions -->
          <div class="quick-actions mb-3">
            <div class="action-item">
              <v-icon class="action-icon" color="orange" size="small">mdi-map-marker</v-icon>
              <span class="action-text">Хадгалсан хаяг</span>
            </div>
            <div class="action-item">
              <v-icon class="action-icon" color="orange" size="small">mdi-cog</v-icon>
              <span class="action-text">Хөнгөлөлт</span>
            </div>
            <div class="action-item">
              <v-icon class="action-icon" color="orange" size="small">mdi-heart</v-icon>
              <span class="action-text">Хадгалсан</span>
            </div>
          </div>

          <!-- Personal Info Banner -->
          <v-card 
            class="info-banner" 
            color="orange-lighten-4" 
            @click="editProfile"
            style="cursor: pointer;"
          >
            <v-card-text class="d-flex align-center justify-space-between pa-3">
              <span class="text-body-2 font-weight-medium text-orange-darken-2">
                Хувийн мэдээлэл
              </span>
              <v-icon color="orange-darken-2" size="small">mdi-chevron-right</v-icon>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>

      <!-- Menu Items -->
      <v-card class="menu-card" elevation="0">
        <v-list class="pa-0">
          <v-list-item 
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon" size="small">mdi-phone</v-icon>
            </template>
            <v-list-item-title class="menu-title text-body-2">{{ user?.phone || '94447509' }}</v-list-item-title>
            <template v-slot:append>

            </template>
          </v-list-item>

          <v-divider class="mx-3"></v-divider>

          <v-list-item 
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon" size="small">mdi-account</v-icon>
            </template>
            <v-list-item-title class="menu-title text-body-2">{{ user?.name || 'Нэр нэмэх' }}</v-list-item-title>
            <template v-slot:append>
             
            </template>
          </v-list-item>

          <v-divider class="mx-3"></v-divider>

          <v-list-item
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon" size="small">mdi-email</v-icon>
            </template>
            <v-list-item-title class="menu-title text-body-2">{{ user?.email || 'И-мэйл хаяг' }}</v-list-item-title>
            <template v-slot:append>
  
            </template>
          </v-list-item>

          <v-divider class="mx-3"></v-divider>

          
        </v-list>
      </v-card>

      <!-- Logout Button -->
      <v-card class="mt-3" elevation="0">
        <v-list class="pa-0">
          <v-list-item 
            class="menu-item px-3 py-2"
            @click="showLogoutDialog = true"
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon" color="error" size="small">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="menu-title text-error text-body-2">Гарах</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <!-- Edit Form -->
    <div v-else-if="user && editing" class="edit-form">
      <v-card class="edit-card" elevation="0">
        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveProfile">
            <!-- Avatar Section -->
            <div class="text-center mb-6">
              <v-avatar size="100" class="mb-4">
                <v-img 
                  :src="user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" 
                  alt="User Avatar"
                />
              </v-avatar>
              <v-btn 
                variant="outlined" 
                color="primary" 
                size="small"
                prepend-icon="mdi-camera"
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

const user = ref({})
const router = useRouter()

// State variables
const editing = ref(false)
const saving = ref(false)
const showLogoutDialog = ref(false)

// Edit form data
const editName = ref('')
const editEmail = ref('')
const editPhone = ref('')
const editAddress = ref('')
const editResult = ref('')
const editResultColor = ref('text-success')

// Settings
const notificationSettings = ref({
  email: true,
  sms: false,
  push: true
})

const privacySettings = ref({
  showProfile: true,
  showActivity: true
})

const activities = ref([])

onMounted(() => {
  loadUserData()
  loadUserActivities()
})

function loadUserData() {
  const userStr = localStorage.getItem('user')
  user.value = userStr ? JSON.parse(userStr) : null
}

function loadUserActivities() {
  const savedActivities = localStorage.getItem('userActivities')
  if (savedActivities) {
    activities.value = JSON.parse(savedActivities)
  }
}

function editProfile() {
  editing.value = true
  editName.value = user.value.name || ''
  editEmail.value = user.value.email || ''
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
  saving.value = true
  
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
      user.value.email = editEmail.value
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Add activity
      addActivity('Профайл засварлав', 'Хувийн мэдээллээ шинэчлэв', 'mdi-account-edit', 'primary')
      
      editResultColor.value = 'text-success'
      editResult.value = 'Амжилттай хадгалагдлаа.'
      
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

function addActivity(title, description, icon, color) {
  const newActivity = {
    id: Date.now(),
    title,
    description,
    date: new Date().toISOString(),
    icon,
    color
  }
  activities.value.unshift(newActivity)
  localStorage.setItem('userActivities', JSON.stringify(activities.value))
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  user.value = null
  showLogoutDialog.value = false
  router.push('/auth')
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.profile-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.header-section {
  padding: 8px 0;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.profile-avatar {
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.phone-number {
  color: #666;
  font-weight: 500;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.action-icon {
  background: #fff3e0;
  padding: 8px;
  border-radius: 50%;
  margin-bottom: 6px;
}

.action-text {
  font-size: 11px;
  color: #666;
  font-weight: 500;
}

.info-banner {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
}

.menu-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.menu-item {
  transition: background-color 0.2s ease;
  min-height: 40px;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-icon {
  color: #666;
  margin-right: 12px;
}

.menu-title {
  font-weight: 500;
  color: #333;
}

.menu-chevron {
  color: #ccc;
}

.edit-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-fields {
  margin-bottom: 20px;
}

.action-buttons {
  margin-top: 20px;
}

.dialog-card {
  border-radius: 12px;
}

.not-logged-in .v-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .profile-container {
    padding: 8px;
  }
  
  .quick-actions {
    margin: 12px 0;
  }
  
  .action-text {
    font-size: 10px;
  }
  
  .menu-item {
    min-height: 36px;
  }
}
</style>
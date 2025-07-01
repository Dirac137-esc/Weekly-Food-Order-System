<template>
  <v-container
    fluid
    class="auth-bg"
    style="min-height: 100vh; padding-top: 40px; position: relative;"
  >
    <div class="auth-overlay"></div>
    <v-row class="fill-height" no-gutters>
                                        <!-- Зүүн талын хэсэг -->
      <v-col
        cols="12"
        md="6"
        class="d-flex flex-column justify-center align-center text-center quote-col"
        style="z-index:2;"
      > 
        <div class="left-side">
          <h1 class="display-1 font-weight-bold mb-4" style="color: #fff; text-shadow: 2px 2px 8px #000;">
            "Хоолны захиалга"-т тавтай морилно уу!
          </h1>
          <p class="subtitle-1" style="color: #fff; text-shadow: 1px 1px 6px #000;">
            Өдрийг сайхан өнгрүүлээрэй!
          </p>
        </div>
      </v-col>
                                        <!-- Баруун талын хэсэг -->
      <v-col
        cols="12"
        md="6"
        class="d-flex justify-center align-center"
        style="z-index:2; min-height: 100vh; margin-left: 50vw;"
      >
        <v-card max-width="420" class="pa-6 mt-10 color-login pt-10 right-card" elevation="10">
          <transition name="slide-fade" mode="out-in">
            <v-row :key="isLogin" class="mb-6 justify-center">
              <v-btn-toggle
                v-model="isLogin"
                class="login-toggle"
                mandatory
                rounded-4xl
                group
              >
                <v-btn
                  :value="true"
                  class="toggle-btn"
                  color="primary"
                  variant="flat"
                  size="large"
                  elevation="4"
                >
                  &nbsp;Нэвтрэх &nbsp;&nbsp;
                </v-btn>
                <v-btn
                  :value="false"
                  class="toggle-btn"
                  color="success"
                  variant="flat"
                  size="large"
                  elevation="4"
                >
                  Бүртгүүлэх
                </v-btn>
              </v-btn-toggle>
            </v-row>
          </transition>
          <transition name="slide-fade" mode="out-in">
            <div :key="isLogin">
                                              <!-- Login хэсэг -->
              <v-form v-if="isLogin" @submit.prevent="login">
                <v-card-title class="justify-center pb-2 text-center">Нэвтрэх</v-card-title>
                <v-text-field v-model="loginUsername" label="Хэрэглэгчийн нэр" prepend-inner-icon="mdi-account" required />
                <v-text-field v-model="loginPassword" label="Нууц үг" type="password" prepend-inner-icon="mdi-lock" required />
                <div class="d-flex align-center justify-space-between mb-3">
                  <v-checkbox
                    v-model="loginRememberMe"
                    label="Намайг санах"
                    class="ma-0 pa-0 remember-checkbox"
                    hide-details
                    density="compact"
                  />
                  <v-btn variant="text" color="grey" size="small" class="forgot-btn" @click="forgotPassword">
                    Нууц үгээ мартсан
                  </v-btn>
                </div>
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  class="main-action-btn mb-2"
                  elevation="6"
                >
                  Нэвтрэх
                </v-btn>
                <v-divider class="my-4" />
                <v-btn color="red" class="mb-2 social-btn" block @click="loginWithGoogle">
                  <v-icon left>mdi-google</v-icon> Google-р нэвтрэх
                </v-btn>
                <v-btn color="blue darken-4" class="mb-2 social-btn" block @click="loginWithFacebook">
                  <v-icon left>mdi-facebook</v-icon> Facebook-р нэвтрэх
                </v-btn>
              </v-form>
                                            <!-- Register хэсэг -->
              <v-form v-else @submit.prevent="register">
                <v-card-title class="justify-center pb-2 text-center">Бүртгүүлэх</v-card-title>
                <v-text-field v-model="registerName" label="Нэр" prepend-inner-icon="mdi-account" required />
                <v-text-field v-model="registerEmail" label="Имэйл" type="email" prepend-inner-icon="mdi-email" required />
                <v-text-field v-model="phone" label="Хэрэглэгчийн утас" prepend-inner-icon="mdi-phone" type="number" required />
                <v-text-field v-model="registerPassword" label="Нууц үг" type="password" prepend-inner-icon="mdi-lock" required />
                <div class="d-flex align-center mb-3">
                  <v-checkbox
                    v-model="registerRememberMe"
                    label="Намайг санах"
                    class="ma-0 pa-0 remember-checkbox"
                    hide-details
                    density="compact"
                  />
                </div>
                <v-btn
                  color="#4BB543"
                  type="submit"
                  block
                  class="main-action-btn mb-2"
                  elevation="6"
                >
                  Бүртгүүлэх
                </v-btn>
                <v-divider class="my-4" />
                <v-btn color="red" class="mb-2 social-btn" block @click="registerWithGoogle">
                  <v-icon left>mdi-google</v-icon> Google-р бүртгүүлэх
                </v-btn>
                <v-btn color="blue darken-4" class="social-btn" block @click="registerWithFacebook">
                  <v-icon left>mdi-facebook</v-icon> Facebook-р бүртгүүлэх
                </v-btn>
              </v-form>
            </div>
          </transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const isLogin = ref(true)

// Login форм 
const loginUsername = ref('')
const loginPassword = ref('')
const loginRememberMe = ref(false)

// Register форм
const registerName = ref('')
const registerEmail = ref('')
const phone = ref('')
const registerPassword = ref('')
const registerRememberMe = ref(false)

// dummy
function login() {
  alert(`Нэвтэрч байна: ${loginUsername.value}, Намайг санах: ${loginRememberMe.value}`)
}
function forgotPassword() {
  alert('Нууц үгээ мартсан уу?')
}
function loginWithGoogle() {
  alert('Google-r newtreh')
}
function loginWithFacebook() {
  alert('Facebook r newtreh')
}
function register() {
  alert(`Бүртгүүлж байна: ${registerName.value}, Намайг санах: ${registerRememberMe.value}, Утас: ${phone.value}`)
}
function registerWithGoogle() {
  alert('Google-r register')
}
function registerWithFacebook() {
  alert('Facebook-r register')
}
</script>


<style scoped>
.auth-bg {
  background-image: url('/zurag/back-zurag.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}
.auth-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1;
  pointer-events: none;
}
.left-side {
  max-width: 500px;
  pointer-events: auto; 
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(.55,0,.1,1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.auth-bg, .v-card, .v-btn, .v-text-field, .v-card-title, .v-col, .v-row, .left-side {
  font-family: 'Montserrat', Arial, sans-serif !important;
}
body {
  font-family: 'Noto Sans', sans-serif;
}
.color-login {
    background-color:rgb(213, 247, 235)
    }
.quote-col {
  position: fixed;
  left: 0;
  top: 0;
  width: 50vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
  background: transparent;
  z-index: 2;
  pointer-events: none;
}
@media (max-width: 960px) {
  .quote-col {
    position: static;
    width: 100vw;
    height: auto;
    min-height: unset;
    pointer-events: auto;
  }
}
.toggle-btn, .main-action-btn, .forgot-btn, .social-btn  {
  text-transform: none !important;
  letter-spacing: normal !important;
}
.right-card {
  border-radius: 2rem !important; /* or any value you like */
  overflow: hidden;
}
</style>

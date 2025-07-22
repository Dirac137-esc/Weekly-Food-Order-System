<template>
  <v-container
    fluid
    class="auth-bg"
    style="min-height: 100vh; padding-top: 40px; position: relative"
  >
    <div class="auth-overlay"></div>
    <v-row class="fill-height" no-gutters>
      <v-col
        cols="12"
        md="6"
        class="d-flex flex-column justify-center align-center text-center quote-col"
        style="z-index: 2"
      >
        <div class="left-side">
          <h1
            class="display-1 font-weight-bold mb-4"
            style="color: #fff; text-shadow: 2px 2px 8px #000"
          >
            "Хоолны захиалга"-т тавтай морилно уу!
          </h1>
          <p
            class="subtitle-1"
            style="color: #fff; text-shadow: 1px 1px 6px #000"
          >
            Өдрийг сайхан өнгөрүүлээрэй!
          </p>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
        sm="12"
        class="d-flex justify-center align-center"
        style="z-index: 2; min-height: 100vh; margin-left: 50vw"
      >
        <v-card
          max-width="600"
          class="pa-6 mt-10 right-card auth-card mr-5"
          elevation="10"
        >
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
              <v-form v-if="isLogin" @submit.prevent="login">
                <v-card-title class="justify-center pb-2 text-center"
                  >Нэвтрэх</v-card-title
                >
                <v-text-field
                  v-model="loginEmail"
                  label="Хэрэглэгчийн Email"
                  prepend-inner-icon="mdi-account"
                  autocomplete="email"
                  required
                />
                <v-text-field
                  v-model="loginPassword"
                  label="Нууц үг"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  autocomplete="password"
                  required
                />
                <div class="d-flex align-center justify-space-between mb-3">
                  <v-checkbox
                    v-model="loginRememberMe"
                    label="Намайг санах"
                    class="ma-0 pa-0 remember-checkbox"
                    hide-details
                    density="compact"
                  />
                  <v-btn
                    variant="text"
                    color="grey"
                    size="small"
                    class="forgot-btn"
                    @click="forgotPassword"
                    >Нууц үгээ мартсан</v-btn
                  >
                </div>
                <div class="text-center">
                  <v-alert
                    v-if="loginResult"
                    :type="
                      loginResult.includes('Амжилттай') ? 'success' : 'error'
                    "
                    class="mb-4"
                    >{{ loginResult }}</v-alert
                  >
                </div>
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  class="main-action-btn"
                  elevation="6"
                  >Нэвтрэх</v-btn
                >
              </v-form>
              <v-form v-else @submit.prevent="register">
                <v-card-title class="justify-center pb-2 text-center"
                  >Бүртгүүлэх</v-card-title
                >
                <v-text-field
                  v-model="registerName"
                  label="Нэр"
                  prepend-inner-icon="mdi-account"
                  autocomplete="name"
                  required
                />
                <v-text-field
                  v-model="registerEmail"
                  label="Имэйл"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  autocomplete="email"
                  required
                />
                <v-text-field
                  v-model="phone"
                  label="Хэрэглэгчийн утас"
                  prepend-inner-icon="mdi-phone"
                  type="number"
                  required
                />
                <v-text-field
                  v-model="registerPassword"
                  label="Нууц үг"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  autocomplete="password"
                  required
                />
                <div class="d-flex align-center mb-3">
                  <v-checkbox
                    v-model="registerRememberMe"
                    label="Намайг санах"
                    class="ma-0 pa-0 remember-checkbox"
                    hide-details
                    density="compact"
                  />
                </div>
                <div class="text-center">
                  <v-alert
                    v-if="registerResult"
                    :type="
                      registerResult.includes('Амжилттай') ? 'success' : 'error'
                    "
                    class="mb-4"
                    >{{ registerResult }}</v-alert
                  >
                </div>
                <v-btn
                  color="#4BB543"
                  type="submit"
                  block
                  class="main-action-btn"
                  elevation="6"
                  >Бүртгүүлэх</v-btn
                >
              </v-form>
            </div>
          </transition>
          <!-- Social login section -->
          <div
            class="action-section-outside mt-6 d-flex flex-column"
            style="height: 30%"
          >
            <div class="text-center mb-4" style=" font-size: 0.9rem">
              Та мөн үүгээр нэвтрэх боломжтой
            </div>
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn
                  color="red"
                  class="social-btn"
                  block
                  @click="isLogin ? loginWithGoogle() : registerWithGoogle()"
                >
                  <v-icon left>mdi-google</v-icon> Google
                </v-btn>
                <v-btn
                  color="blue darken-4"
                  class="social-btn"
                  block
                  @click="isLogin ? loginWithFacebook() : registerWithFacebook()"
                >
                  <v-icon left>mdi-facebook</v-icon> Facebook
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// -------------------
// Импорт болон хувьсагчийн тодорхойлолт
// -------------------
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "#imports";

const isLogin = ref(true); // Нэвтрэх эсвэл бүртгүүлэх формын төлөв
const userStore = useUserStore();
const loginEmail = ref("");
const loginPassword = ref("");
const loginRememberMe = ref(false);
const registerName = ref("");
const registerEmail = ref("");
const phone = ref("");
const registerPassword = ref("");
const registerRememberMe = ref(false);
const registerResult = ref(""); // Бүртгэлийн үр дүнгийн мессеж
const loginResult = ref(""); // Нэвтрэх үр дүнгийн мессеж
const router = useRouter();

// -------------------
// Хуудас ачаалахад санах функц
// -------------------
onMounted(() => {
  // Хэрвээ хэрэглэгч өмнө нь "Намайг санах" сонгосон бол email-ийг автоматаар бөглөнө
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    loginEmail.value = rememberedEmail;
    loginRememberMe.value = true;
  }
});

// -------------------
// Нэвтрэх функц
// -------------------
async function login() {
  loginResult.value = "";
  try {
    // Backend руу нэвтрэх хүсэлт илгээх
    const response = await fetch(
      "https://backend-production-25f11.up.railway.app/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.value,
          password: loginPassword.value,
        }),
      }
    );
    const result = await response.json();
    if (response.ok) {
      // Амжилттай нэвтэрсэн бол хэрэглэгчийн мэдээллийг хадгална
      loginResult.value = "Амжилттай нэвтэрлээ!";
      userStore.saveUser(result.user);
      console.log(result.user);
      if (result.token) localStorage.setItem("token", result.token);
      // "Намайг санах" сонгосон бол email-ийг хадгална
      if (loginRememberMe.value)
        localStorage.setItem("rememberedEmail", loginEmail.value);
      else localStorage.removeItem("rememberedEmail");
    } else {
      // Алдаа гарвал мессеж харуулна
      loginResult.value = "Алдаа: " + (result.message || "Нэвтрэхэд амжилтгүй");
    }
  } catch {
    loginResult.value = "Сүлжээний алдаа!";
  }
}

// -------------------
// Бүртгүүлэх функц
// -------------------
async function register() {
  registerResult.value = "";
  try {
    // Backend руу бүртгүүлэх хүсэлт илгээх
    const response = await fetch(
      "https://backend-production-25f11.up.railway.app/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName.value,
          email: registerEmail.value,
          phone: phone.value,
          password: registerPassword.value,
        }),
      }
    );
    const result = await response.json();
    if (response.ok) {
      // Амжилттай бүртгүүлсэн бол нэвтрэх форм руу шилжүүлнэ
      registerResult.value = "Бүртгэл амжилттай!";
      isLogin.value = true;
      if (result.token) localStorage.setItem("token", result.token);
    } else {
      // Алдаа гарвал мессеж харуулна
      registerResult.value =
        "Алдаа: " + (result.message || "Бүртгэхэд амжилтгүй");
    }
  } catch {
    registerResult.value = "Сүлжээний алдаа!";
  }
}

// -------------------
// Нэвтрэхэд амжилттай болвол эхлэл хуудас руу автоматаар шилжүүлнэ
// -------------------
watch(loginResult, (val) => {
  if (val === "Амжилттай нэвтэрлээ!") setTimeout(() => router.push("/"), 1200);
});

// -------------------
// Social болон нэмэлт үйлдлүүд
// -------------------
function forgotPassword() {
  alert("Нууц үгээ мартсан уу?");
}
function loginWithGoogle() {
  alert("Google-р нэвтрэх");
}
function loginWithFacebook() {
  alert("Facebook-р нэвтрэх");
}
function registerWithGoogle() {
  alert("Google-р бүртгүүлэх");
}
function registerWithFacebook() {
  alert("Facebook-р бүртгүүлэх");
}
</script>

<style scoped>

html,
body {
  overflow: hidden !important;
  height: 100vh !important;
  margin: 0;
  padding: 0;
}

.auth-bg {
  background-image: url("/zurag/back-zurag.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  min-height: 100vh !important;
  height: 100vh !important;
  overflow: hidden;
}
.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
  pointer-events: none;
}
.left-side {
  max-width: 500px;
  pointer-events: auto;
}

body {
  font-family: "Noto Sans", sans-serif;
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
.toggle-btn,
.main-action-btn,
.forgot-btn,
.social-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
}
.right-card,
.auth-card {
  border-radius: 2rem !important;
  overflow: hidden;
}
.auth-card {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  min-height: unset !important;
  width: 100%;
}

.action-section-outside {
  margin-top: 48px;
  padding: 24px 16px 16px 16px;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.social-btn {
  margin-bottom: 10px;
}

@media (max-width: 960px) {
  .quote-col,
  .left-side,
  .display-1 {
    display: none !important;
  }
  .right-card,
  .action-section-outside {
    margin-left: -35% !important;
    margin-right: auto !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    max-width: 70% !important;
    padding: 16px !important;
    position: relative !important;
  }
  .action-section-outside {
    width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

}
</style>

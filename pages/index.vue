<style>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 400% 400%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  animation: gradientFlow 8s ease-in-out infinite;
}

@keyframes gradientFlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 50%
    ),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.05"><path d="M0,20 Q250,80 500,20 T1000,20 L1000,100 L0,100 Z"/></svg>');
  background-size: 100% 100%, 100% 100%, cover;
  background-position: 0% 0%, 100% 100%, bottom;
  animation: floatingLights 6s ease-in-out infinite alternate;
}

@keyframes floatingLights {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  100% {
    transform: translateY(-10px) rotate(1deg);
  }
}

.hero-content {
  animation: fadeInUp 1.5s ease-out;
  position: relative;
  z-index: 2;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  animation: slideInFromLeft 1s ease-out 0.3s both;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease-in-out infinite;

  .gradient-text {
    background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #45b7d1);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 3s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  animation: slideInFromRight 1s ease-out 0.6s both;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@keyframes slideInFromRight {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-button-container {
  animation: bounceIn 1s ease-out 0.9s both;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.v-btn.hero-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #4caf50, #45a049) !important;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.v-btn.hero-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
  z-index: 1;
}

.pulse-animation {
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
  }
  50% {
    box-shadow: 0 12px 35px rgba(76, 175, 80, 0.8) !important;
  }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatUp 8s infinite linear;
}

.particle:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  left: 20%;
  animation-delay: 1s;
}
.particle:nth-child(3) {
  left: 30%;
  animation-delay: 2s;
}
.particle:nth-child(4) {
  left: 70%;
  animation-delay: 3s;
}
.particle:nth-child(5) {
  left: 80%;
  animation-delay: 4s;
}
.particle:nth-child(6) {
  left: 90%;
  animation-delay: 5s;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) rotate(360deg);
    opacity: 0;
  }
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 3rem !important;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.5rem !important;
  }
  .hero-subtitle {
    font-size: 1.25rem !important;
  }
}
</style>
<template>
  <div id="app">
    <v-app>
      <section class="hero-section">
        <div class="floating-particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>

        <v-container class="fill-height" fluid>
          <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" md="10" lg="8" xl="6">
              <div
                class="hero-content text-center d-flex flex-column justify-center align-center"
              >
                <h1
                  class="hero-title text-h2 text-md-h1 font-weight-bold white--text mb-6"
                >
                  Хурдан, амттай,<br />
                  <span class="gradient-text">найдвартай</span> хоол
                </h1>

                <p
                  class="hero-subtitle text-h6 text-md-h5 white--text mb-12 opacity-90"
                >
                  Та өлсөж байна уу ? Би лав өлсөж байна 😊
                </p>

                <div class="hero-button-container">
                  <v-btn
                    size="x-large"
                    class="hero-button pulse-animation rounded-xl px-12 py-4 d-flex"
                    prepend-icon="mdi-silverware-fork-knife"
                    elevation="8"
                  >
                    <template v-slot:prepend>
                      <v-icon size="28" class="me-3"></v-icon>
                    </template>
                    <NuxtLink to="/auth" style="text-decoration: none; color: white;" >
                      <span class="text-h6 font-weight-bold pt-0"
                        >Хоол захиалах</span
                      >
                    </NuxtLink>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-app>
  </div>
</template>

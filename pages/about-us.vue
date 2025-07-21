<template>
  <v-app>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="floating-elements">
        <v-icon class="floating-icon floating-1">mdi-hamburger</v-icon>
        <v-icon class="floating-icon floating-2">mdi-pizza</v-icon>
        <v-icon class="floating-icon floating-3">mdi-ice-cream</v-icon>
        <v-icon class="floating-icon floating-4">mdi-coffee</v-icon>
      </div>

      <v-container class="hero-content fill-height">
        <v-row class="fill-height align-center justify-center text-center">
          <v-col cols="12" md="8">
            <h1 class="display-2 font-weight-black white--text mb-6 fade-up">
              Lorem Ipsum Dolor Sit Amet
            </h1>
            <p class="headline white--text mb-8 fade-up">
              Consectetur adipiscing elit. Nulla imperdiet.
            </p>
            <v-btn 
              large 
              color="white" 
              class="black--text font-weight-bold px-8 fade-up"
              rounded
            >
              <v-icon left>mdi-silverware-fork-knife</v-icon>
              Lorem Menu
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Example Other Section -->
    <v-container class="section-padding">
      <h2 class="display-1 font-weight-bold mb-6 primary--text">Lorem Section</h2>
      <p class="text-h6 mb-4 grey--text text--darken-1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante.
      </p>
      <p class="body-1 mb-6 grey--text text--darken-2">
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </p>
      <v-btn color="orange" large rounded>
        <v-icon left>mdi-history</v-icon>
        Read More
      </v-btn>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      storyImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      stats: [
        { id: 1, icon: 'mdi-store', number: '100+', label: 'Lorem' },
        { id: 2, icon: 'mdi-account-group', number: '500+', label: 'Ipsum' },
        { id: 3, icon: 'mdi-heart', number: '2M+', label: 'Dolor' },
        { id: 4, icon: 'mdi-food', number: '75+', label: 'Amet' },
      ],
      values: [
        { id: 1, icon: 'mdi-clock-fast', title: 'Lorem', description: 'Tempor incididunt ut labore.' },
        { id: 2, icon: 'mdi-star', title: 'Ipsum', description: 'Excepteur sint occaecat cupidatat.' },
        { id: 3, icon: 'mdi-account-heart', title: 'Dolor', description: 'Sed ut perspiciatis unde omnis.' },
      ],
      timeline: [
        { year: '2010', title: 'Start', description: 'Lorem ipsum dolor sit amet.' },
        { year: '2015', title: 'Grow', description: 'Consectetur adipiscing elit.' },
        { year: '2020', title: 'Scale', description: 'Sed do eiusmod tempor.' },
      ],
      teamMembers: [
        {
          id: 1,
          name: 'John Doe',
          position: 'CEO',
          bio: 'Lorem ipsum dolor sit amet.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 2,
          name: 'Jane Smith',
          position: 'COO',
          bio: 'Consectetur adipiscing elit.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616c95a7aa6?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 3,
          name: 'Alice Johnson',
          position: 'Chef',
          bio: 'Sed do eiusmod tempor.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        },
      ],
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.floating-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.1) !important;
  animation: float 6s ease-in-out infinite;
  font-size: 3rem !important;
}

.floating-1 { top: 20%; left: 10%; animation-delay: 0s; }
.floating-2 { top: 60%; left: 80%; animation-delay: 2s; font-size: 2rem !important; }
.floating-3 { top: 40%; left: 60%; animation-delay: 4s; }
.floating-4 { top: 80%; left: 20%; animation-delay: 1s; font-size: 2rem !important; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.hero-content {
  position: relative;
  z-index: 3;
}

.section-padding {
  padding: 80px 0;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 16px !important;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.value-card {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%) !important;
  border-radius: 20px !important;
  transition: transform 0.3s ease;
  border: none !important;
}

.value-card:hover {
  transform: scale(1.05);
}

.timeline-item {
  border-left: 3px solid #ff6b35;
  padding-left: 30px;
  margin-bottom: 40px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff6b35;
}

.fade-up {
  animation: fadeUp 1s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.team-img-container {
  display: flex;
  justify-content: center;
}

.team-img {
  border-radius: 50%;
  object-fit: cover;
}

.primary--text {
  color: #ff6b35 !important;
}

.rounded-xl {
  border-radius: 12px !important;
}
</style>

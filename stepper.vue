<template>
  <v-stepper
    v-model="step"
    class="mb-8 elevation-0 bg-transparent"
    hide-actions
  >
    <v-stepper-header class="elevation-0 bg-transparent">
      <v-stepper-item
        :complete="step > 1"
        step="1"
        color="primary"
        class="pa-4"
      >
        <template #icon>
          <v-avatar
            :color="step >= 1 ? 'primary' : 'grey-lighten-2'"
            size="48"
            class="elevation-4"
          >
            <v-icon v-if="step > 1" color="white" size="20"> mdi-check </v-icon>
            <span
              v-else
              class="text-h6 font-weight-bold"
              :class="step >= 1 ? 'text-white' : 'text-grey'"
            >
              1
            </span>
          </v-avatar>
        </template>
        <div class="text-center mt-2">
          <div class="text-subtitle-1 font-weight-bold">Захиалга</div>
          <div class="text-caption text-grey">Order Items</div>
        </div>
      </v-stepper-item>

      <v-divider class="mx-4"></v-divider>

      <v-stepper-item
        :complete="step > 2"
        step="2"
        color="primary"
        class="pa-4"
      >
        <template #icon>
          <v-avatar
            :color="step >= 2 ? 'primary' : 'grey-lighten-2'"
            size="48"
            class="elevation-4"
          >
            <v-icon v-if="step > 2" color="white" size="20"> mdi-check </v-icon>
            <span
              v-else
              class="text-h6 font-weight-bold"
              :class="step >= 2 ? 'text-white' : 'text-grey'"
            >
              2
            </span>
          </v-avatar>
        </template>
        <div class="text-center mt-2">
          <div class="text-subtitle-1 font-weight-bold">Төлбөр</div>
          <div class="text-caption text-grey">Payment</div>
        </div>
      </v-stepper-item>

      <v-divider class="mx-4"></v-divider>

      <v-stepper-item step="3" color="primary" class="pa-4">
        <template #icon>
          <v-avatar
            :color="step >= 3 ? 'primary' : 'grey-lighten-2'"
            size="48"
            class="elevation-4"
          >
            <v-icon v-if="step > 3" color="white" size="20"> mdi-check </v-icon>
            <span
              v-else
              class="text-h6 font-weight-bold"
              :class="step >= 3 ? 'text-white' : 'text-grey'"
            >
              3
            </span>
          </v-avatar>
        </template>
        <div class="text-center mt-2">
          <div class="text-subtitle-1 font-weight-bold">Хянах</div>
          <div class="text-caption text-grey">Review</div>
        </div>
      </v-stepper-item>
    </v-stepper-header>
  </v-stepper>
</template>

<script setup lang="ts">
const step = ref(1);
</script>

<script setup lang="ts">
// import TheHeader from '../components/TheHeader.vue'
import TheCalculator from '../components/TheCalculator.vue';
</script>

<template>
  <main>
    <v-app>
      <!-- <TheHeader /> -->
      <v-main>
        <v-container>
          <h1 class="font-weight-bold mb-4">Loan Interest Calculator</h1>
          <TheCalculator />
        </v-container>
      </v-main>
    </v-app>
  </main>
</template>

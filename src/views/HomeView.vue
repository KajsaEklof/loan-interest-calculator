<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue'
import TheCalculator from '../components/TheCalculator.vue'
</script>

<template>
  <main>
    <v-app>
      <TheHeader />
      <v-main>
        <TheCalculator />
      </v-main>
    </v-app>
  </main>
</template>

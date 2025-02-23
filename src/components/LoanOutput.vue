<template>
  <div class="ma-8">
    <h2>Output</h2>
    <v-data-table
      :items="props.output"
      :headers="headers"
      :loading="props.loading"
      loading-text="Calculating..."
      item-key="accrualDate"
      items-per-page="30"
      density="compact"
    >
      <template v-slot:item.accrualDate="{ value }">
        {{ value.toLocaleDateString() }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import type { DailyInterest } from './TheCalculator.vue';

const props = defineProps<{
  output: DailyInterest[];
  loading: boolean;
}>();



const headers = [
  { title: 'Accrual Date', key: 'accrualDate' },
  { title: 'Days Elapsed', key: 'daysElapsed' },
  { title: 'Interest Accrued', key: 'interestAccrued' },
  { title: 'Interest Without Margin', key: 'interestWithoutMargin' },
  { title: 'Total Interest', key: 'totalInterest' },
];
</script>

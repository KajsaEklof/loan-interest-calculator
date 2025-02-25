<template>
  <h2 class="mb-4 text-primary">Output</h2>
  <v-data-table
    :items="props.output"
    :headers="headers"
    :loading="props.loading"
    loading-text="Calculating..."
    item-key="accrualDate"
    items-per-page="30"
    density="compact"
    color="primary"
    fixed-header
  >
    <template v-slot:item.accrualDate="{ value }">
      {{ value.toLocaleDateString() }}
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { DailyInterest } from '@/Types/CalculatorTypes';

const props = defineProps<{
  output: DailyInterest[];
  loading: boolean;
}>();

const headers = [
  { title: 'Accrual Date', key: 'accrualDate', sortable: false },
  { title: 'Days Elapsed (since start date of loan)', key: 'daysElapsed', sortable: false },
  { title: 'Daily Interest', key: 'interestAccrued', sortable: false },
  { title: 'Daily Interest Without Margin', key: 'interestWithoutMargin', sortable: false },
  { title: 'Total Interest', key: 'totalInterest', sortable: false },
];
</script>

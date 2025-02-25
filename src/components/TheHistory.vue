<template>
  <v-select
    v-model="selectedLoanId"
    :items="calculationsHistory"
    variant="outlined"
    no-data-text="No calculations made"
    label="History"
    color="primary"
    item-value="id"
    clearable
    @update:model-value="updateSelectedHistory"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :subtitle="formatLoanDates(item.value)"></v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import type { CalculationDetails } from '@/Types/CalculatorTypes';
import { ref } from 'vue';

const props = defineProps<{
  calculationsHistory: CalculationDetails[];
}>();

const emit = defineEmits(['updateSelectedHistory']);
const selectedLoanId = ref<string | null>(null);

function updateSelectedHistory(id: string | null) {
  emit('updateSelectedHistory', id);
}

// format the loan dates in a readable format for the history dropdown
// e.g. 01/01/2021 - 01/01/2022
// @param loanId - the id of the loan
// @returns the formatted date string
function formatLoanDates(loanId: string) {
  const loan = props.calculationsHistory.find((x) => x.id === loanId);
  if (!loan) {
    return '';
  }

  return `${loan.startDate.toLocaleDateString()} - ${loan.endDate.toLocaleDateString()}`;
}
</script>

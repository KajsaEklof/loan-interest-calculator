<template>
  <v-row no-gutters>
    <v-col cols="12" md="8" class="d-flex justify-between align-top">
      <h1 class="font-weight-bold text-primary">Loan Interest Calculator</h1>
    </v-col>
    <v-col cols="12" md="4">
      <TheHistory
        :calculationsHistory="calculationsHistory"
        @updateSelectedHistory="updateSelectedHistory"
      />
    </v-col>
  </v-row>
  <v-form class="mt-4" @submit.prevent="calculateLoan">
    <v-row>
      <v-col md="6" cols="12">
        <v-date-input
          v-model="startDate"
          :rules="[rules.required]"
          label="Start Date"
          color="primary"
          variant="outlined"
        ></v-date-input>
      </v-col>
      <v-col md="6" cols="12">
        <v-date-input
          v-model="endDate"
          :rules="[rules.required]"
          label="End Date"
          color="primary"
          variant="outlined"
        ></v-date-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" cols="12">
        <v-select
          v-model="currency"
          :items="currencies"
          :rules="[rules.required]"
          label="Currency"
          color="primary"
          variant="outlined"
        >
          <template v-slot:prepend>
            <Icon icon="mdi:currency-gbp" style="font-size: 24px" class="v-icon" />
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">{{ item.value }}</v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <span>
              {{ item.value }}
            </span>
          </template>
        </v-select>
      </v-col>
      <v-col md="6" cols="12">
        <v-text-field
          v-model="amount"
          :rules="[rules.required]"
          label="Amount"
          type="number"
          color="primary"
          variant="outlined"
        >
          <template v-slot:prepend>
            <Icon icon="mdi:cash-multiple" style="font-size: 24px" class="v-icon" />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-8">
      <v-col cols="12">
        <v-slider
          v-model="baseInterestRate"
          :step="0.1"
          label="Base Interest Rate %"
          thumb-label="always"
          color="primary"
        />
      </v-col>
      <v-col cols="12">
        <v-slider
          v-model="margin"
          :step="0.1"
          color="primary"
          label="Margin %"
          thumb-label="always"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex justify-end">
        <v-btn :loading="props.loading" type="submit" variant="flat" color="primary">
          Calculate
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { CalculationDetails, SelectItem } from '@/Types/CalculatorTypes';
import TheHistory from './TheHistory.vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  loading: boolean;
  calculationsHistory: CalculationDetails[];
}>();

const emit = defineEmits(['calculate', 'updateSelectedHistory']);

// available currencies
const currencies: SelectItem[] = [
  {
    value: 'US Dollar (USD)',
    title: '$',
  },
  {
    value: 'Euro (EUR)',
    title: '€',
  },
  {
    value: 'British Pound (GBP)',
    title: '£',
  },
  {
    value: 'Japanese Yen (JPY)',
    title: '¥',
  },
  {
    value: 'Chinese Yuan (CNY)',
    title: '¥',
  },
  {
    value: 'Swiss Franc (CHF)',
    title: 'Fr',
  },
  {
    value: 'Canadian Dollar (CAD)',
    title: '$',
  },
  {
    value: 'Australian Dollar (AUD)',
    title: '$',
  },
  {
    value: 'Singapore Dollar (SGD)',
    title: '$',
  },
  {
    value: 'Hong Kong Dollar (HKD)',
    title: '$',
  },
];

const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const currency = ref('US Dollar (USD)');
const amount = ref(1000);
const baseInterestRate = ref(5);
const margin = ref(2);

// validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required',
};

// update the selected historic calculation and populate the calculator fields
function updateSelectedHistory(selected: string) {
  // emit event to update the selected history item ID in the parent component and update the data table
  emit('updateSelectedHistory', selected);

  // populate the calculator fields with the selected history item
  const item = props.calculationsHistory.find((item) => item.id === selected);
  if (item) {
    startDate.value = item.startDate;
    endDate.value = item.endDate;
    currency.value = item.currency;
    amount.value = item.amount;
    baseInterestRate.value = item.baseInterestRate;
    margin.value = item.margin;
  }
}

// calculate the loan interest
// emit the event to the parent component to calculate the loan
function calculateLoan() {
  emit('calculate', {
    startDate: startDate.value,
    endDate: endDate.value,
    currency: currency.value,
    amount: amount.value,
    baseInterestRate: baseInterestRate.value,
    margin: margin.value,
    id: uuidv4(),
  });
}
</script>

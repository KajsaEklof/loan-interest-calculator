<template>
  <v-card variant="outlined">
    <h2 class="ml-8 mt-4">Loan Details</h2>
    <v-form class="ma-8 mt-4" @submit.prevent="generateOutput">
      <v-row>
        <v-col>
          <v-date-input v-model="startDate" label="Start Date"></v-date-input>
        </v-col>
        <v-col>
          <v-date-input v-model="endDate" label="End Date"></v-date-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="currency"
            :items="currencies"
            label="Currency"
            prepend-icon="home"
            :multiple="false"
          >
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
        <v-col>
          <v-text-field
            v-model="amount"
            label="Amount"
            prepend-icon="money"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-8">
        <v-col cols="12">
          <v-slider
            v-model="baseInterestRate"
            :step="0.1"
            label="Base Interest Rate %"
            thumb-label="always"
            color="accent"
          />
        </v-col>
        <v-col cols="12">
          <v-slider
            v-model="margin"
            :step="0.1"
            color="accent"
            label="Margin %"
            thumb-label="always"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="d-flex justify-end">
          <v-btn :loading="loading" type="submit" variant="flat" color="primary">Calculate</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <LoanOutput :output="dataOutput" :loading="loading" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoanOutput from '../components/LoanOutput.vue';

type SelectItem = { title: string; value: string };
// type Output = {
//   loanSummary: {
//     startDate: Date;
//     endDate: Date;
//     currency: string;
//     amount: number;
//     baseInterestRate: number;
//     margin: number;
//   };
//   dailyInterest: DailyInterest[];
// };
export type DailyInterest = {
  accrualDate: Date;
  daysElapsed: number;
  interestAccrued: string;
  interestWithoutMargin: string;
  totalInterest: string;
};

const startDate = ref(null);
const endDate = ref(null);

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

const loading = ref(false);
const currency = ref('US Dollar (USD)');
const amount = ref(1000);
const baseInterestRate = ref(5);
const margin = ref(2);

const dataOutput = ref<DailyInterest[]>([]);

function roundToN(num: number, n: number): number {
  return Number(num.toFixed(n));
}

function getTermInDays(): number {
  // calculate the number of days between the start and end date
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays;
  }

  return 0;
}

function calculateYears(days: number): number {
  // console.log('calculateYears days:', days);
  // calculate the number of years between the start and end date
  // if (startDate.value && endDate.value) {
  //   const start = new Date(startDate.value);
  //   const end = new Date(endDate.value);
  //   const diffTime = end.getTime() - start.getTime();
  //   const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const diffYears = days / 365;

  // return the number of years rounded to 4 decimals
  return roundToN(diffYears, 4);
  // }

  // return 0;
}

function generateOutput() {
  // 1. Daily Interest Amount without margin
  // 2. Daily Interest Amount Accrued
  // 3. Accrual Date
  // 4. Number of Days elapsed since the Start Date of the loan
  // 5. Total Interest - calculated over the given period

  if (!startDate.value || !endDate.value) {
    console.error('Start Date and End Date are required');
    return;
  }


  loading.value = true;

  const output: DailyInterest[] = [];
  dataOutput.value = [];
  // const output: Output = {
  //   loanSummary: {
  //     startDate: startDate.value,
  //     endDate: endDate.value,
  //     currency: currency.value,
  //     amount: amount.value,
  //     baseInterestRate: baseInterestRate.value,
  //     margin: margin.value,
  //   },
  //   dailyInterest: [],
  // };

  const c: string = currencies.find((c) => c.value === currency.value)?.title || '';
  const term = getTermInDays();
  for (let i = 0; i < term; i++) {
    const accrualDate = new Date(startDate.value);
    accrualDate.setDate(accrualDate.getDate() + i);
    // console.log('startDate.value', startDate.value);
    // console.log('accrualDate', accrualDate);

    const daysElapsed = i;
    const interestWithoutMargin = calculateDailyInterest(false, daysElapsed + 1);
    const interestAccrued = calculateDailyInterest(true, daysElapsed + 1);
    const totalInterest = calculateTotalInterest(daysElapsed + 1);

    output.push({
      accrualDate,
      daysElapsed,
      interestWithoutMargin : `${c}${interestWithoutMargin.toFixed(2)}`,
      interestAccrued: `${c}${interestAccrued.toFixed(2)}`,
      totalInterest: `${c}${totalInterest.toFixed(2)}`,
    });
  }

  // console.log('output', output);
  
  setTimeout(() => {
    dataOutput.value = output;
    loading.value = false;
  }, 500);
}

function calculateDailyInterest(withMargin: boolean, term: number): number {
  const totalInterest = (baseInterestRate.value + (withMargin ? margin.value : 0)) / 100;

  const years = calculateYears(term);
  const interest = amount.value * totalInterest * years;

  return interest;
}

function calculateTotalInterest(termInDays: number): number {
  // calculate the term in years
  const term = calculateYears(termInDays);
  const totalInterest = (baseInterestRate.value + margin.value) / 100;
  const interest = amount.value * totalInterest * term;


  return interest;
}
</script>

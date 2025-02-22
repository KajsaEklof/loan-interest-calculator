<template>
  <v-card variant="outlined" class="ma-8">
    <v-card-title>Loan Details</v-card-title>
    <v-form class="ma-8 mt-4" @submit.prevent="calculateInterest">
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
          v-model=currency
          :items=currencies
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
        <v-col>
          <v-slider
          v-model="baseInterestRate"
          label="Base Interest Rate %"
          thumb-label="always"
          color="accent"
          />
        </v-col>
        <v-col>
          <v-slider
          v-model="margin"
          color="accent"
          label="Margin %"
          thumb-label="always"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="d-flex justify-end">
          <v-btn type="submit" variant="flat" color="primary">Calculate</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
    </v-card-actions> -->
    <LoanOutput />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoanOutput from '../components/LoanOutput.vue' 

type SelectItem = { title: string, value: string }

const startDate = ref(null)
const endDate = ref(null)

const currencies: SelectItem[] = [
  {
    value: 'US Dollar (USD)',
    title: '$'
  },
  {
    value: 'Euro (EUR)',
    title: '€'
  },
  {
    value: 'British Pound (GBP)',
    title: '£'
  },
  {
    value: 'Japanese Yen (JPY)',
    title: '¥'
  },
  {
    value: 'Chinese Yuan (CNY)',
    title: '¥'
  },
  {
    value: 'Swiss Franc (CHF)',
    title: 'Fr'
  },
  {
    value: 'Canadian Dollar (CAD)',
    title: '$'
  },
  {
    value: 'Australian Dollar (AUD)',
    title: '$'
  },
  {
    value: 'Singapore Dollar (SGD)',
    title: '$'
  },
  {
    value: 'Hong Kong Dollar (HKD)',
    title: '$'
  }
]

const currency = ref('US Dollar (USD)')
const amount = ref(1000)
const baseInterestRate = ref(5)
const margin = ref(2)

// find the selected currency icon for the amount field
// const selectedCurrency = currencies.find((item) => item.value === currency.value)

function calculateYears() {
  // calculate the number of years between the start and end date
  console.log('Calculating years')
  console.log('startDate', startDate.value);
  console.log('endDate', endDate.value);

  // return the number of years
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    console.log('diffDays', diffDays);
    const diffYears = diffDays / 365;
    return diffYears;
  }

  return 0;
}

function calculateInterest() {
  // calculate the interest
  console.log('Calculating interest')
  console.log('amount', amount);
  console.log('amount', amount.value);
  console.log('baseInterestRate', baseInterestRate.value);
  console.log('margin', margin.value);
  console.log('currency', currency.value);
  console.log('startDate', startDate.value);
  console.log('endDate', endDate.value);

  const term = calculateYears();
  console.log('years/term', term);
  const totalInterest = (baseInterestRate.value + margin.value) / 100;
  console.log('totalInterest', totalInterest);


  const interest = amount.value * totalInterest * term
  console.log('interest', interest);
}

</script>
<template>
  <main>
    <v-app>
      <v-main>
        <v-sheet elevation="4" class="ma-8 pa-8">
          <TheCalculator
            :calculationsHistory="calculationsHistory"
            :loading="loading"
            @calculate="generateCalculation"
            @updateSelectedHistory="updateSelectedHistory"
          />
          <v-row>
            <v-col>
              <TheLoanOutput :output="dataOutput" :loading="loading" />
            </v-col>
          </v-row>
        </v-sheet>
      </v-main>
    </v-app>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TheCalculator from '@/components/TheCalculator.vue';
import TheLoanOutput from '@/components/TheLoanOutput.vue';
import type {
  CalculationDetails,
  DailyInterest,
  DataOutput,
  SelectItem,
} from '@/Types/CalculatorTypes';

const selectedHistoryId = ref<string | null>(null); // id of the selected historic calculation item
const calculationsHistory = ref<CalculationDetails[]>([]); // array of historic calculations
const dataOutputHistory = ref<DataOutput[]>([]); // array of historic loan data output

const loading = ref(false);
const dataOutput = ref<DailyInterest[]>([]); // array of daily interest calculations

// currency options
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

// Generate a new loan calculation
// @Param loanValues: CalculationDetails the details of the loan
function generateCalculation(loanValues: CalculationDetails) {
  // find the currency symbol
  const c: string = currencies.find((c) => c.value === loanValues.currency)?.title || '';

  // if a previous calculation is not selected, add a new calculation to the history. Otherwise, update the selected calculation
  if (!selectedHistoryId.value) {
    calculationsHistory.value.push({
      ...loanValues,
      title: `Loan ${calculationsHistory.value.length + 1} - ${c}${loanValues.amount}`,
    });
  } else {
    // update the selected historic calculation
    const index = calculationsHistory.value.findIndex((x) => x.id === selectedHistoryId.value);
    calculationsHistory.value[index] = {
      ...loanValues,
      id: selectedHistoryId.value, // keep the same id
      title: `Loan ${index + 1} - ${c}${loanValues.amount}`, // update the title with the (potential) new amount
    };
  }

  calculateLoan(loanValues);
}

// Update the selected historic calculation item ID
// @Param selectedId: string the ID of the selected historic calculation item
function updateSelectedHistory(selectedId: string) {
  selectedHistoryId.value = selectedId;

  // populate the output table with the selected historic calculation's data
  const data = dataOutputHistory.value.find((x) => x.id === selectedId);
  if (data) {
    dataOutput.value = data.dataOutput;
  } else {
    console.error('No data found for selected calculation with ID', selectedId);
  }
}

// Calculate the interest for the loan
// @Param v: CalculationDetails the details of the loan
function calculateLoan(v: CalculationDetails) {
  // get the number of days in the loan term
  const days = getTermInDays(v.startDate, v.endDate);

  // find the currency symbol
  const c: string = currencies.find((c) => c.value === v.currency)?.title || '';
  const output: DailyInterest[] = [];

  loading.value = true;
  dataOutput.value = []; // clear the output table

  // calculate the total interest for the loan period with and without the margin
  const totalInterestForLoan = calculateTotalInterest(
    v.amount,
    days,
    (v.baseInterestRate + v.margin) / 100,
  );
  const totalInterestForLoanWithoutMargin = calculateTotalInterest(
    v.amount,
    days,
    v.baseInterestRate / 100,
  );

  // calculate the daily interest for the loan period
  for (let i = 0; i < days; i++) {
    const accrualDate = new Date(v.startDate);
    accrualDate.setDate(v.startDate.getDate() + i); // set the accrual date to the current day in the loop

    const daysElapsed = i;
    const term = getTermInYears(daysElapsed + 1);
    const interest = (v.baseInterestRate + v.margin) / 100;
    const totalInterest = v.amount * interest * term; // calculate the total interest for the loan period up to the current day in the loop

    output.push({
      accrualDate,
      daysElapsed,
      interestWithoutMargin: `${c}${Math.round((totalInterestForLoanWithoutMargin / days) * 100) / 100}`,
      interestAccrued: `${c}${Math.round((totalInterestForLoan / days) * 100) / 100}`,
      totalInterest: `${c}${Math.round(totalInterest*100) / 100}`,
    });
  }

  // for a better user experience, add a minimal delay before displaying the output
  setTimeout(() => {
    dataOutput.value = output;

    if (selectedHistoryId.value) {
      const index = dataOutputHistory.value.findIndex((x) => x.id === selectedHistoryId.value);
      if (index && index > -1) {
        dataOutputHistory.value[index].dataOutput = output;
      }
    } else {
      dataOutputHistory.value.push({ dataOutput: output, id: v.id });
    }

    loading.value = false;
  }, 400);
}

// calculate the number of days between the start and end date of the loan
// @Param startDate: Date
// @Param endDate: Date
// @Return the number of days between the start and end date of the loan
function getTermInDays(startDate: Date, endDate: Date): number {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime(); // difference in milliseconds
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // milliseconds to days conversion. (1000 * 60 * 60 * 24) calculates the number of milliseconds in one day

    return diffDays;
  }

  return 0;
}

// convert the number of days to years
// NOTE: when converting days to years, we assume a year has 365 days and ignore leap years
// @Param days: number the number of days
// @Return the number of years without rounding the decimals
function getTermInYears(days: number): number {
  const diffYears = days / 365;

  return diffYears;
}

// @Param amount: number
// @Param days: number
// @Param interestRate: number (percentage)
// @Return the total interest for the loan period using the simple interest formula
function calculateTotalInterest(amount: number, days: number, interestRate: number): number {
  // Simple Interest = P × r × n
  const term = getTermInYears(days);
  const interest = amount * interestRate * term;

  return interest;
}
</script>

export type CalculationDetails = {
  startDate: Date;
  endDate: Date;
  currency: string;
  amount: number;
  baseInterestRate: number;
  margin: number;
  id: string;
  title: string;
};

export type DailyInterest = {
  accrualDate: Date;
  daysElapsed: number;
  interestAccrued: string;
  interestWithoutMargin: string;
  totalInterest: string;
};

export type DataOutput = {
  dataOutput: DailyInterest[];
  id: string;
};

export type SelectItem = { title: string; value: string };

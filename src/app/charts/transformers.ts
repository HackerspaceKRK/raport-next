import { keyTranslations } from "../translations";

export type DataLegend = Record<string, string>;

export interface Income {
  // Decimal
  darowizny_celowe: string;
  // Decimal
  darowizny_inne: string;
  // Decimal
  darowizny_koronawirus: string;
  // Decimal
  darowizny_sponsoring: string;
  // Decimal
  darowizny_statutowe: string;
  // Decimal
  eventy: string;
  // Decimal
  inne_wplywy: string;
  // Decimal
  korekty: string;
  // Decimal
  nieprzeparsowane: string;
  // Decimal
  warsztaty: string;
}

export interface Costs {
  // Decimal
  administracyjne: string;
  // Decimal
  bank: string;
  // Decimal
  covid: string;
  // Decimal
  eventy: string;
  // Decimal
  hosting: string;
  // Decimal
  inne_koszty: string;
  // Decimal
  internet: string;
  // Decimal
  korekty: string;
  // Decimal
  ksiegowosc: string;
  // Decimal
  lokal: string;
  // Decimal
  nieprzeparsowane: string;
  // Decimal
  ubezpieczenia: string;
  // Decimal
  umowy: string;
  // Decimal
  zakupy: string;
  // Decimal
  zwroty: string;
}

export interface MonthSummary {
  // Decimal
  end_saldo: string;
  // Decimal
  safe_threshold: string;
  // Decimal
  safe_threshold_difference: string;
  // Decimal
  start_saldo: string;
  // Decimal
  balance: string;
  // Decimal
  costs: string;
  // Decimal
  date: string;
  // Decimal
  incomes: string;
  // Decimal
  other_expenses: string;
  // Decimal
  venue_expenses: string;
}

export interface Described {
  // Decimal
  value: number;
  category: string;
  details?: string;
  name?: string;
}

type MonthDetails = {
  income: Income;
  income_described: Described[];
  koszty: Costs;
  koszty_described: Described[];
  summary: MonthSummary;
};


export type Summary = Record<string, MonthDetails>;

export interface StatsMonths {
  [key: string]: number;
}

export interface Operations {
  all: string;
  months: StatsMonths;
}

export interface Stats {
  parsing_date: string;
  operations: Operations;
}

export type ChartItem = {
  name: string;
  value: number;
};

function getDataset(data: Summary, year: string, month: string) {
  return data[`${year}-${month}`];
}

// Dumb but works lol
export function transform(obj: any): MonthSummary {
  const translatedObject: typeof keyTranslations = {};
  for (const key of Object.keys(obj)) {
    const newValue = key in keyTranslations ? keyTranslations[key] : key;
    translatedObject[newValue] = obj[key];
  }
  return translatedObject as any as MonthSummary;
}

export function getPlotDataset(
  data: Summary,
  years: Record<string, string[]>,
  year: string
) {
  const listOfPlotDatasets: MonthSummary[] = [];
  years[year].map((month) => {
    const currentData = getDataset(data, year, month);
    const { summary } = currentData;
    listOfPlotDatasets.push(transform(summary));
  });

  return listOfPlotDatasets;
}

export function getWholePlotDataset(
  data: Summary,
  years: Record<string, string[]>
) {
  const listOfPlotDatasets: MonthSummary[] = [];
  Object.keys(years).map((year) => {
    years[year].map((month) => {
      const currentData = getDataset(data, year, month);
      const { summary } = currentData;
      listOfPlotDatasets.push(transform(summary));
    });
  });
  return listOfPlotDatasets;
}

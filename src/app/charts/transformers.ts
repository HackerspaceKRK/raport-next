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
  ksiegowosc: string;
  // Decimal
  lokal: string;
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
  bilans: string;
  // Decimal
  end_saldo: string;
  // Decimal
  safe_threshold: string;
  // Decimal
  safe_threshold_difference: string;
  // Decimal
  start_saldo: string;
}

export interface Described {
  // Decimal
  value: string;
  category: string;
  details?: string;
  name?: string;
  // Will be removed soon-ish
  listed?: boolean;
}

type MonthDetails = {
  income: Income;
  income_described: Described[];
  koszty: Costs;
  koszty_described: Described[];
  summary: MonthSummary;
  plot: PlotSummary;
};

export interface PlotSummary {
  date: string;
  incomes: string;
  venue_expenses: string;
  other_expenses: string;
  saldo: string;
}

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
}

function getDataset(data: Summary, year: string, month: string) {
  return data[`${year}-${month}`];
}

// Dumb but works lol
export function transform(obj: any): PlotSummary {
  const translatedObject: typeof keyTranslations = {};
  for (const key of Object.keys(obj)) {
    const newValue = key in keyTranslations ? keyTranslations[key] : key;
    translatedObject[newValue] = obj[key];
  }
  return translatedObject as any as PlotSummary;
}

export function getPlotDataset(
  data: Summary,
  years: Record<string, string[]>,
  year: string
) {
  const listOfPlotDatasets: PlotSummary[] = [];
  years[year].map((month) => {
    const currentData = getDataset(data, year, month);
    const { plot } = currentData;
    listOfPlotDatasets.push(transform(plot));
  });

  return listOfPlotDatasets;
}

export function getWholePlotDataset(
  data: Summary,
  years: Record<string, string[]>
) {
  const listOfPlotDatasets: PlotSummary[] = [];
  Object.keys(years).map((year) => {
    years[year].map((month) => {
      const currentData = getDataset(data, year, month);
      const { plot } = currentData;
      listOfPlotDatasets.push(transform(plot));
    });
  });
  return listOfPlotDatasets;
}

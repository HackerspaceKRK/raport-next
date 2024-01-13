"use client";
import React, { useState, useMemo } from "react";
import moment from "moment";

import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Decimal from "decimal.js";

type Legend = Record<string, string>;

interface Income {
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

interface Costs {
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

interface MonthSummary {
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

interface Described {
  // Decimal
  value: string;
  data: {
    category: "event" | "workshops" | string;
    metadata: {
      details: string;
      name: string;
    };
  };
}

type MonthDetails = {
  income: Income;
  income_described: Described[];
  koszty: Costs;
  koszty_described: Described[];
  summary: MonthSummary;
};

type Summary = Record<string, MonthDetails>;

const keyTranslations: Record<string, string> = {
  darowizny_celowe: "Darowizny Celowe",
  darowizny_inne: "Darowizny Inne",
  darowizny_koronawirus: "Darowizny Koronawirus",
  darowizny_sponsoring: "Darowizny Sponsoring",
  darowizny_statutowe: "Darowizny Statutowe",
  eventy: "eventy",
  inne_wplywy: "inne Wplywy",
  warsztaty: "warsztaty",
  administracyjne: "administracyjne",
  bank: "bank",
  covid: "covid",
  hosting: "hosting",
  inne_koszty: "inneKoszty",
  internet: "internet",
  ksiegowosc: "ksiegowosc",
  lokal: "lokal",
  ubezpieczenia: "ubezpieczenia",
  income: "Dochód",
  koszty: "Koszty",
  summary: "Suma",
};

export function Summary({ data, legend }: { data: Summary; legend: Legend }) {
  function getTranslations(key: string): string {
    return (legend as any)[key] || keyTranslations[key] || key;
  }

  const years = useMemo(() => {
    const newYears: Record<string, string[]> = {};
    Object.keys(data).forEach((entry) => {
      const [year, month] = entry.split("-");
      if (!newYears[year]) {
        newYears[year] = [];
      }
      newYears[year].push(month);
    });

    return newYears;
  }, [data]);

  const availableYears = useMemo(
    () =>
      Object.keys(years)
        .map((x) => parseInt(x))
        .toSorted()
        .reverse()
        .map((x) => x.toString()),
    [years]
  );

  const [currentYear, setCurrentYear] = useState(availableYears[0]);
  const [currentMonth, setCurrentMonth] = useState(years[currentYear][0]);

  function getDataset(year: string, month: string) {
    return data[`${year}-${month}`];
  }

  function updateYear(newYear: string) {
    const hasMonthInNewYear = years[newYear].includes(currentMonth);
    setCurrentYear(newYear);
    if (!hasMonthInNewYear) {
      setCurrentMonth(years[newYear][0]);
    }
  }

  const currentDataset = getDataset(currentYear, currentMonth);

  Object.entries(currentDataset.koszty); //?

  return (
    <div className="mt-4 flex flex-1 flex-col gap-4 relative">
      <h1 className="text-center">Monthly Financial Report</h1>
      <div className="absolute right-0 top-0">
        <ModeToggle />
      </div>
      <div className="flex gap-4 justify-end mt-4 ">
        <Select
          value={currentYear}
          onValueChange={(value) => updateYear(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Rok: ${currentYear}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {availableYears.map((year, index) => (
                <SelectItem value={year} key={year}>
                  Rok: {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>Podsumowanie roku {currentYear}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Miesiąc</TableHead>
            {Object.keys(currentDataset.summary).map((x) => (
              <TableHead key={getTranslations(x)}>
                {getTranslations(x)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {years[currentYear].map((month) => {
            const currentData = getDataset(currentYear, month);
            const { summary } = currentData;
            return (
              <TableRow key={currentYear + month}>
                <TableCell>{moment(month, "MM").format("MMMM")}</TableCell>
                {Object.entries(summary).map(([key, value], index) => (
                  <TableCell key={currentYear + month + key} className={ key === "bilans" || key === "safe_threshold_difference" ? ( value > 0 ? "text-[#a3e635]" : "text-[#f87171]") : ""}>
                    {new Decimal(value).toFixed(2)} zł
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex justify-end">
          <Select
            value={currentMonth}
            onValueChange={(value) => {
              setCurrentMonth(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Rok: ${currentMonth}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years[currentYear].map((month, index) => (
                  <SelectItem value={month} key={month}>
                    Miesiąc: {month}.{currentYear}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Table className="my-4">
          <TableCaption>Wydatki na miesiąc {moment(currentMonth, "MM").format("MMMM")}</TableCaption>
          <TableHeader>
            <TableRow>
              {Object.keys(currentDataset.koszty).map((x) => (
                <TableHead key={"costs" + currentMonth + x}>
                  {getTranslations(x)}
                </TableHead>
              ))}
              <TableHead>Suma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {Object.entries(currentDataset.koszty).map(
                ([key, value], index) => (
                  <TableCell key={"costs" + key + value} className={( value === "0" ? "text-[#9ca3af]" : "")}>
                    {new Decimal(-value).toFixed(2)} zł
                  </TableCell>
                )
              )}
              <TableCell>
                {Object.values(currentDataset.koszty)
                  .reduce((a: Decimal, b: string) => a.add(b), new Decimal(0))
                  .toFixed(2)}{" "}
                zł
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="my-4">
          <TableCaption>Wpływy na miesiąc {moment(currentMonth, "MM").format("MMMM")}</TableCaption>
          <TableHeader>
            <TableRow>
              {Object.keys(currentDataset.income).map((x) => (
                <TableHead key={"income" + currentMonth + x}>
                  {getTranslations(x)}
                </TableHead>
              ))}
              <TableHead>Suma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {Object.entries(currentDataset.income).map(([key, value]) => (
                <TableCell key={"income" + key + value} className={( value === "0" ? "text-[#9ca3af]" : "")}>
                  {new Decimal(value).toFixed(2)} zł
                </TableCell>
              ))}
              <TableCell>
                {Object.values(currentDataset.income)
                  .reduce((a: Decimal, b: string) => a.add(b), new Decimal(0))
                  .toFixed(2)}{" "}
                zł
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

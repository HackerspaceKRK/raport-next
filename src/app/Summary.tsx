"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
  Brush,
  ComposedChart,
  Line,
} from "recharts";

import { useTheme } from "next-themes";

import { DateTime } from "luxon";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableFooter,
} from "@/components/ui/table";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Decimal from "decimal.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HsKrkIcon } from "@/components/HsKrkIcon";
import {
  ChartItem,
  getPlotDataset,
  getWholePlotDataset,
} from "./charts/transformers";
import type {
  Summary,
  DataLegend,
  Stats,
  Described,
} from "./charts/transformers";

import { keyTranslations } from "./translations";

const COLORS_DARK = [
  "#f87171",
  "#fb923c",
  "#fde047",
  "#a3e635",
  "#4ade80",
  "#2dd4bf",
  "#60a5fa",
  "#a78bfa",
  "#e879f9",
  "#fb7185",
];

const COLORS_LIGHT = [
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#65a30d",
  "#16a34a",
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#c026d3",
  "#e11d48",
];

export function Summary({
  data,
  legend,
  stats,
}: {
  data: Summary;
  legend: DataLegend;
  stats: Stats;
}) {
  const getTranslations = useCallback(
    function getTranslations(key: string): string {
      return (legend as any)[key] || keyTranslations[key] || key;
    },
    [legend]
  );

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

  const { theme, setTheme, resolvedTheme } = useTheme();

  const returnPlotColors = useCallback(function returnPlotColors(
    theme?: string
  ) {
    const resultSorted = theme === "dark" ? COLORS_LIGHT : COLORS_DARK;
    const resultScrambled = resultSorted
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return resultScrambled;
  },
  []);

  const [currentYear, setCurrentYear] = useState(availableYears[1]);
  const [currentMonth, setCurrentMonth] = useState(years[currentYear][1]);

  const getDataset = useCallback(
    function getDataset(year: string, month: string) {
      return data[`${year}-${month}`];
    },
    [data]
  );

  function updateYear(newYear: string) {
    const hasMonthInNewYear = years[newYear].includes(currentMonth);
    setCurrentYear(newYear);
    if (!hasMonthInNewYear) {
      setCurrentMonth(years[newYear][0]);
    }
  }

  const getPieChartDataset = useCallback(
    function getPieChartDataset(year: string, month: string) {
      const inc: ChartItem[] = [];
      const cos: ChartItem[] = [];

      Object.entries(getDataset(year, month).income).map(
        ([key, value], index) => {
          if (Math.abs(Number(value)) != 0) {
            inc.push({
              name: getTranslations(key),
              value: Math.abs(Number(value)),
            });
          }
        }
      );

      Object.entries(getDataset(year, month).koszty).map(
        ([key, value], index) => {
          if (Math.abs(Number(value)) != 0) {
            cos.push({
              name: getTranslations(key),
              value: Math.abs(Number(value)),
            });
          }
        }
      );

      const r = { income: inc, cost: cos };
      return r;
    },
    [getDataset, getTranslations]
  );

  const currentDataset = getDataset(currentYear, currentMonth);

  const plotDataset = getPlotDataset(data, years, currentYear);
  const wholePlotDataset = getWholePlotDataset(data, years);

  const pieDataset = useMemo(
    () => getPieChartDataset(currentYear, currentMonth),
    [currentYear, currentMonth, getPieChartDataset]
  );

  const plotColors = useMemo(
    () => returnPlotColors(resolvedTheme),
    [returnPlotColors, resolvedTheme]
  );

  return (
    <div className="mt-4 flex flex-1 flex-col gap-4 relative">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <HsKrkIcon
          theme={resolvedTheme}
          className="h-20 w-20 dark:icon-white"
        />
        <h1 className="flex items-center text-5xl font-extrabold dark:text-white">
          Podsumowanie Finansowe
        </h1>
      </a>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        Opracowane {stats.parsing_date} na podstawie {stats.operations.all}{" "}
        przetworzonych operacji
      </p>

      <div className="absolute right-0 top-0">
        <ModeToggle />
      </div>

      <div
        id="alert-additional-content-4"
        className="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            Te dane nie zostały jeszcze zweryfikowane
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          Dane, które wyświetla poniższy dashboard nie zostały jeszcze
          skonsultowane z naszą księgowością. Dane tu wyświetlone liczy
          przekomplikowany kod, w którym cały czas znajduję coraz to nowe
          quirki, które bywa, że zmieniają kwoty. Niektóre wpływy i koszty nie
          są jeszcze opisane. Traktuj to, co tu zobaczysz ze szczyptą soli.
          Przeglądasz na własną odpowiedzialność!
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
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
                        <TableCell>
                          {DateTime.fromFormat(month, "LL")
                            .setLocale("pl")
                            .toFormat("LLLL")}
                        </TableCell>
                        {Object.entries(summary).map(([key, value], index) => (
                          <TableCell
                            key={currentYear + month + key}
                            className={
                              key === "bilans" ||
                              key === "safe_threshold_difference"
                                ? parseFloat(value) > 0
                                  ? "text-lime-600 dark:text-lime-400"
                                  : "text-red-600 dark:text-red-400"
                                : ""
                            }
                          >
                            {new Decimal(value).toFixed(2)} zł
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 700 }}>
                <ResponsiveContainer>
                  <ComposedChart
                    data={plotDataset}
                    accessibilityLayer
                    stackOffset="sign"
                    syncId="summary"
                  >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="2 2" />
                    <Bar
                      dataKey={keyTranslations["venue_expenses"]}
                      stackId="a"
                      fill={resolvedTheme === "dark" ? "#60a5fa" : "#2563eb"}
                    />
                    <Bar
                      dataKey={keyTranslations["other_expenses"]}
                      stackId="a"
                      fill={resolvedTheme === "dark" ? "#fbbf24" : "#d97706"}
                    />
                    <Bar
                      dataKey={keyTranslations["incomes"]}
                      stackId="a"
                      fill={resolvedTheme === "dark" ? "#34d399" : "#059669"}
                    />
                    <Line
                      type="monotone"
                      dataKey={keyTranslations["balance"]}
                      strokeWidth={3}
                      stroke="#ff0000"
                    />
                    <Legend />
                    <Tooltip
                      cursor={{ opacity: "0.3" }}
                      contentStyle={{
                        backgroundColor:
                          resolvedTheme === "dark" ? "#000" : "#FFF",
                      }}
                      itemStyle={{
                        color: resolvedTheme === "dark" ? "#FFF" : "#000",
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Tabs defaultValue="incomes_and_costs">
          <TabsList>
            <TabsTrigger value="incomes_and_costs">Wpływy i koszty</TabsTrigger>
            <TabsTrigger value="charts">Wykresy</TabsTrigger>
          </TabsList>
          <TabsContent value="incomes_and_costs">
            <Card>
              <CardContent>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Koszty (
                      {DateTime.fromFormat(currentMonth, "LL")
                        .setLocale("pl")
                        .toFormat("LLLL")}{" "}
                      {currentYear}){" "}
                    </CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Podział kosztów</CardTitle>
                            <CardDescription>na kategorie</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table className="my-4">
                              <TableHeader>
                                <TableRow>
                                  {Object.values(["Kategoria", "Wartość"]).map(
                                    (x) => (
                                      <TableHead
                                        key={"costs" + currentMonth + x}
                                      >
                                        {getTranslations(x)}
                                      </TableHead>
                                    )
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(currentDataset.koszty).map(
                                  ([key, value], index) =>
                                    parseFloat(value) < 0 && (
                                      <TableRow key={"costsRow" + key + value}>
                                        <TableCell
                                          key={"costsKey" + key + value}
                                        >
                                          {getTranslations(key)}
                                        </TableCell>
                                        <TableCell
                                          key={"costsValue" + key + value}
                                          className={
                                            value === "0"
                                              ? "text-[#9ca3af]"
                                              : ""
                                          }
                                        >
                                          {value} zł
                                        </TableCell>
                                      </TableRow>
                                    )
                                )}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell>Suma</TableCell>
                                  <TableCell>
                                    {Object.values(currentDataset.koszty)
                                      .reduce(
                                        (a: Decimal, b: string) => a.add(b),
                                        new Decimal(0)
                                      )
                                      .toFixed(2)}{" "}
                                    zł
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-2">
                        <Card>
                          <CardContent>
                            <div style={{ width: "100%", height: 900 }}>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    dataKey={"value"}
                                    label
                                    data={pieDataset.cost}
                                    paddingAngle={5}
                                    cx="50%"
                                    cy="50%"
                                  >
                                    {pieDataset.cost.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          plotColors[index % plotColors.length]
                                        }
                                      />
                                    ))}
                                  </Pie>
                                  <Legend />
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Opisane koszty</CardTitle>
                          </CardHeader>

                          <CardContent>
                            {currentDataset.koszty_described[0] != null && (
                              <Table className="my-4">
                                <TableHeader>
                                  <TableRow>
                                    {Object.keys(
                                      currentDataset.koszty_described[0]
                                    ).map(
                                      (x) =>
                                        x != "listed" && (
                                          <TableHead
                                            key={
                                              "koszty_described" +
                                              currentMonth +
                                              x
                                            }
                                          >
                                            {getTranslations(x)}
                                          </TableHead>
                                        )
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(
                                    currentDataset.koszty_described
                                  ).map(([key, value], index) => (
                                    <TableRow
                                      key={"koszty_described_row" + index}
                                    >
                                      {Object.keys(value).map(
                                        (k, i) =>
                                          k != "listed" && (
                                            <TableCell
                                              key={
                                                "koszty_described" +
                                                index +
                                                k +
                                                i
                                              }
                                            >
                                              {k === "value"
                                                ? value[
                                                    k as any as keyof Described
                                                  ] + " zł"
                                                : k === "category"
                                                ? getTranslations(
                                                    (value as any)[k]
                                                  )
                                                : value[
                                                    k as any as keyof Described
                                                  ]}
                                            </TableCell>
                                          )
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      Wpływy (
                      {DateTime.fromFormat(currentMonth, "LL")
                        .setLocale("pl")
                        .toFormat("LLLL")}{" "}
                      {currentYear})
                    </CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-5">
                      <div>
                        {" "}
                        <Card>
                          <CardHeader>
                            <CardTitle>Podział wpływów</CardTitle>
                            <CardDescription>na kategorie</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table className="my-4">
                              <TableHeader>
                                <TableRow>
                                  {Object.values(["Kategoria", "Wartość"]).map(
                                    (x) => (
                                      <TableHead
                                        key={"income" + currentMonth + x}
                                      >
                                        {getTranslations(x)}
                                      </TableHead>
                                    )
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(currentDataset.income).map(
                                  ([key, value], index) =>
                                    parseFloat(value) > 0 && (
                                      <TableRow key={"incomeRow" + key + value}>
                                        <TableCell
                                          key={"incomeKey" + key + value}
                                        >
                                          {getTranslations(key)}
                                        </TableCell>
                                        <TableCell
                                          key={"incomeValue" + key + value}
                                          className={
                                            value === "0"
                                              ? "text-[#9ca3af]"
                                              : ""
                                          }
                                        >
                                          {value} zł
                                        </TableCell>
                                      </TableRow>
                                    )
                                )}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell>Suma</TableCell>
                                  <TableCell>
                                    {Object.values(currentDataset.income)
                                      .reduce(
                                        (a: Decimal, b: string) => a.add(b),
                                        new Decimal(0)
                                      )
                                      .toFixed(2)}{" "}
                                    zł
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-span-2">
                        <Card>
                          <CardContent>
                            <div style={{ width: "100%", height: 700 }}>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    dataKey="value"
                                    label
                                    data={
                                      getPieChartDataset(
                                        currentYear,
                                        currentMonth
                                      ).income
                                    }
                                    paddingAngle={5}
                                    cx="50%"
                                    cy="50%"
                                  >
                                    {getPieChartDataset(
                                      currentYear,
                                      currentMonth
                                    ).income.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          plotColors[index % plotColors.length]
                                        }
                                      />
                                    ))}
                                  </Pie>
                                  <Legend />
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Opisane wpływy</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {currentDataset.income_described[0] != null && (
                              <Table className="my-4">
                                <TableHeader>
                                  <TableRow>
                                    {Object.keys(
                                      currentDataset.income_described[0]
                                    ).map(
                                      (x) =>
                                        x != "listed" && (
                                          <TableHead
                                            key={
                                              "income_described" +
                                              currentMonth +
                                              x
                                            }
                                          >
                                            {getTranslations(x)}
                                          </TableHead>
                                        )
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(
                                    currentDataset.income_described
                                  ).map(([key, value], index) => (
                                    <TableRow
                                      key={"income_described_row" + index}
                                    >
                                      {Object.keys(value).map(
                                        (k, i) =>
                                          k != "listed" && (
                                            <TableCell
                                              key={
                                                "income_described" +
                                                index +
                                                k +
                                                i
                                              }
                                            >
                                              {k === "value"
                                                ? value[
                                                    k as any as keyof Described
                                                  ] + " zł"
                                                : k === "category"
                                                ? getTranslations(
                                                    (value as any)[k]
                                                  )
                                                : value[
                                                    k as any as keyof Described
                                                  ]}
                                            </TableCell>
                                          )
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="charts">
            <Card>
              <CardContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo w roku {currentYear}</CardTitle>
                  </CardHeader>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={plotDataset}
                        accessibilityLayer
                        stackOffset="sign"
                        syncId="summary"
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="2 2" />
                        <Bar
                          dataKey={keyTranslations["saldo"]}
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Tooltip
                          cursor={{ opacity: "0.3" }}
                          contentStyle={{
                            backgroundColor:
                              resolvedTheme === "dark" ? "#000" : "#FFF",
                          }}
                          itemStyle={{
                            color: resolvedTheme === "dark" ? "#FFF" : "#000",
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo ogółem</CardTitle>
                  </CardHeader>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={wholePlotDataset}
                        accessibilityLayer
                        stackOffset="sign"
                        syncId="summary"
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="2 2" />
                        <Bar
                          dataKey={keyTranslations["saldo"]}
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                        <Tooltip
                          cursor={{ opacity: "0.3" }}
                          contentStyle={{
                            backgroundColor:
                              resolvedTheme === "dark" ? "#000" : "#FFF",
                          }}
                          itemStyle={{
                            color: resolvedTheme === "dark" ? "#FFF" : "#000",
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Wpływy ogółem</CardTitle>
                  </CardHeader>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={wholePlotDataset}
                        accessibilityLayer
                        stackOffset="sign"
                        syncId="summary"
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="2 2" />
                        <Bar
                          dataKey={keyTranslations["incomes"]}
                          stackId="a"
                          fill="#da3"
                        />
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                        <Tooltip
                          cursor={{ opacity: "0.3" }}
                          contentStyle={{
                            backgroundColor:
                              resolvedTheme === "dark" ? "#000" : "#FFF",
                          }}
                          itemStyle={{
                            color: resolvedTheme === "dark" ? "#FFF" : "#000",
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Bilans</CardTitle>
                  </CardHeader>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={wholePlotDataset}
                        accessibilityLayer
                        stackOffset="sign"
                        syncId="summary"
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="2 2" />
                        <Bar
                          dataKey={keyTranslations["balance"]}
                          stackId="a"
                          fill="#3a3"
                        />
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                        <Tooltip
                          cursor={{ opacity: "0.3" }}
                          contentStyle={{
                            backgroundColor:
                              resolvedTheme === "dark" ? "#000" : "#FFF",
                          }}
                          itemStyle={{
                            color: resolvedTheme === "dark" ? "#FFF" : "#000",
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
        <footer className="sticky right-0 bottom-0">
          <div className="justify-end bg-sky-500/10 m-4">
        <div className="flex gap-4 justify-end pr-4 pt-4 pl-4">
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
      <div className="flex justify-end pr-4 pb-4 pl-4">
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
        </div></div>
        </footer>
    </div>
  );
}

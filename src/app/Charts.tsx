"use client";
import React, { useState, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import Decimal from "decimal.js";

interface Month {
	dt: string;
	mi: string;
	mp: string;
	mr: string;
	sld: string;
}

// const keyTranslations: Record<string, string> = {
//   darowizny_celowe: "Darowizny Celowe",
//   darowizny_inne: "Darowizny Inne",
//   darowizny_koronawirus: "Darowizny Koronawirus",
//   darowizny_sponsoring: "Darowizny Sponsoring",
//   darowizny_statutowe: "Darowizny Statutowe",
//   eventy: "eventy",
//   inne_wplywy: "inne Wplywy",
//   warsztaty: "warsztaty",
//   administracyjne: "administracyjne",
//   bank: "bank",
//   covid: "covid",
//   hosting: "hosting",
//   inne_koszty: "inneKoszty",
//   internet: "internet",
//   ksiegowosc: "ksiegowosc",
//   lokal: "lokal",
//   ubezpieczenia: "ubezpieczenia",
//   income: "Dochód",
//   koszty: "Koszty",
//   summary: "Suma",
// };

export function Charts({ data }: { data: Month }) {
//   function getTranslations(key: string): string {
//     return (legend as any)[key] || keyTranslations[key] || key;
//   }

  // console.log(data)

//   const years = useMemo(() => {
//     const newYears: Record<string, string[]> = {};
//     Object.keys(data).forEach((entry) => {
//       const [year, month] = entry.split("-");
//       if (!newYears[year]) {
//         newYears[year] = [];
//       }
//       newYears[year].push(month);
//     });

//     return newYears;
//   }, [data]);

//   const availableYears = useMemo(
//     () =>
//       Object.keys(years)
//         .map((x) => parseInt(x))
//         .toSorted()
//         .reverse()
//         .map((x) => x.toString()),
//     [years]
//   );

//   const [currentYear, setCurrentYear] = useState(availableYears[0]);
//   const [currentMonth, setCurrentMonth] = useState(years[currentYear][0]);

//   function getDataset(year: string, month: string) {
//     return data[`${year}-${month}`];
//   }

//   function updateYear(newYear: string) {
//     const hasMonthInNewYear = years[newYear].includes(currentMonth);
//     setCurrentYear(newYear);
//     if (!hasMonthInNewYear) {
//       setCurrentMonth(years[newYear][0]);
//     }
//   }

//   const currentDataset = getDataset(currentYear, currentMonth);

//   Object.entries(currentDataset); //?

  return (
    <div className="mt-4 flex flex-1 flex-col gap-4 relative">
      <h1 className="text-center">Monthly Financial Report</h1>
      <div className="absolute right-0 top-0">
      <div className="flex gap-4 justify-end mt-4 ">
		{/* <ResponsiveContainer width="100%" aspect={4.0/3.0}> */}

	  	<LineChart width={1500} height={400} data={data}>
			<Line type="monotone" dataKey="sld" stroke="#000" />
		</LineChart>

		{/* </ResponsiveContainer> */}
      </div>
      </div>

    </div>
  );
}

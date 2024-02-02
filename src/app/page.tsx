import details from "../../detail.json";
import { Summary } from "./Summary";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Summary
        data={details.data}
        legend={details.legend}
        stats={details.stats}
      />
    </main>
  );
}

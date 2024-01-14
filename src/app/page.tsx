import Image from 'next/image'
import details from '../../detail.json'
import cursedplot from '../../cursed-plot.json'
import {Summary} from './Summary'
import { Charts } from './Charts'

export async function generateStaticParams() {
  return {
    data: details.data,
    legend: details.legend,
  }
}
 

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Summary data={details.data as any} legend={details.legend} />
    </main>
  )
}

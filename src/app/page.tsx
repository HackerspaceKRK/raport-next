import Image from 'next/image'
import details from '../../detail.json'
import {Summary} from './Summary'

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

import { log } from 'console';
import Image from 'next/image';

export type Country = {
  name: {
    common: string;
  };

  translations: {
    por: {
      common: string;
    };
  };

  flags: {
    svg: string;
    alt: string;
  };

  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages?: {
    [key: string]: string;
  };

  borders?: string[];
  cca3: string;
};

async function getCountries(): Promise<Country[]> {
  const response = await fetch('https://restcountries.com/v3.1/all');
  return response.json();
}

export default async function Home() {
  const countries = await getCountries();
  console.log(countries);
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      HOME
    </main>
  );
}

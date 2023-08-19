import type { Country } from '@/app/page';
import CountryCard from '@/components/country-card';
import Image from 'next/image';
import Link from 'next/link';

async function getCountryByName(name: string): Promise<Country> {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries: Country[] = await response.json();
  return countries.find((country: Country) => country.name.common === name)!;
}
async function getCountryBordersByName(name: string) {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries: Country[] = await response.json();
  const country = countries.find(
    (country: Country) => country.name.common === name,
  )!;
  return country.borders?.map((border) => {
    const borderCountry = countries.find((country) => country.cca3 === border)!;
    return {
      name: borderCountry.name.common,
      ptName: borderCountry.translations.por.common,
      flag: borderCountry.flags.svg,
      flagAlt: borderCountry.flags.alt,
    };
  });
}
export default async function CountryPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const country = await getCountryByName(decodeURI(name));
  const borderCountries = await getCountryBordersByName(decodeURI(name));
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return (
    <section className='flex flex-col container'>
      <h1 className='text-5xl text-center font-bold text-gray-800 my-16'>
        {country.translations.por.common}
      </h1>
      <Link className='flex items-center py-2 gap-2' href='/'>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M177.5 414c-8.8 3.8-19 2-26-4.6l-144-136C2.7 268.9 0 262.6 0 256s2.7-12.9 7.5-17.4l144-136c7-6.6 17.2-8.4 26-4.6s14.5 12.5 14.5 22l0 72 288 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-288 0 0 72c0 9.6-5.7 18.2-14.5 22z"/></svg>
        Voltar
      </Link>
      <article className='flex md:flex-row flex-col justify-between min-w-full p-10 bg-white rounded-xl'>
        <section>
          {country.capital && (
            <h2 className='text-xl text-gray-800 mt-3'>
              <b>🏙️ Capital:</b> {country.capital}
            </h2>
          )}
          <h2 className='text-xl text-gray-800 mt-3'>
            <b>🗺️ Continente:</b> {country.region}
            {country.subregion && `- ${country.subregion}`}
          </h2>
          <h2 className='text-xl text-gray-800 mt-3'>
            <b>👨‍👩‍👧‍👦 População:</b> {formatter.format(country.population)}
          </h2>
          {country.languages && (
            <h2 className='text-xl text-gray-800 mt-3'>
              <b>🗣️ Línguas faladas:</b>
              <br />
              {Object.values(country.languages).map((language) => (
                <span
                  key={language}
                  className='inline-block px-2 bg-indigo-700 mr-2 text-white text-sm rounded-full'
                >
                  {language}
                </span>
              ))}
            </h2>
          )}
        </section>
        <div className='relative h-48 my-2 md:h-auto w-96 shadow-md md:order-last order-first'>
          <Image
            src={country.flags.svg}
            alt={country.flags.alt}
            fill
            className='object-cover'
          />
        </div>
      </article>
      <section>
        <h3 className='mt-12 text-2xl font-semibold text-gray-800'>
          Países que fazem fronteira
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full container gap-2'>
          {borderCountries?.map((border) => (
            <CountryCard key={border.name} {...border} />
          ))}
        </div>
      </section>
    </section>
  );
}
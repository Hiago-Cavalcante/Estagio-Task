import { GlobeAltIcon } from '@heroicons/react/24/outline'
// If you have a fonts.ts file, ensure it exists and exports 'lusitana'.
// Otherwise, you can comment out or remove this line until the module is available.
// import { lusitana } from './fonts';
const lusitana = { className: '' } // Temporary fallback to avoid errors

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  )
}

import FirstStep from '@/components/quote/FirstStep'
import React from 'react'

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Get an Instant Quote | Hunky Butler Service",
  description:
    "Get instant, transparent pricing for buff butlers, cocktail masterclasses, life drawing and male strippers. Enter your postcode and date to book in minutes.",
  alternates: { canonical: SITE_URL + "/quote" },
  openGraph: {
    title: "Get an Instant Quote | Hunky Butler Service",
    description:
      "Get instant, transparent pricing for buff butlers, cocktail masterclasses, life drawing and male strippers.",
    url: SITE_URL + "/quote",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get an Instant Quote | Hunky Butler Service",
    description:
      "Get instant, transparent pricing for buff butlers, cocktail masterclasses, life drawing and male strippers.",
    images: [SITE_URL + "/logo.png"],
  },
};

export default function page() {
  return (
    <div className='min-h-screen'>

      <FirstStep/>


      </div>
  )
}

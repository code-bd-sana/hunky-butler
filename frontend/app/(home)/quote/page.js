import FirstStep from '@/components/quote/FirstStep'
import React from 'react'
import { base_url } from '@/utils/utils'

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

/**
 * The service list is fetched here rather than in the client component.
 *
 * Previously /quote shipped a shell containing 16 words and no service options.
 * The browser had to download and execute JS, then round-trip to a separate API
 * subdomain, before anything bookable appeared. The server answers in about
 * 30 ms and the payload is small, yet mobile Largest Contentful Paint measured
 * 9.1 seconds, because none of that work started until the client took over.
 *
 * Fetching server-side means the service cards are in the initial HTML. The
 * client component still owns interaction, and still falls back to its own
 * query if this fetch fails, so an API blip degrades to the previous behaviour
 * rather than an empty page.
 */
async function getServices() {
  try {
    const res = await fetch(`${base_url}/service`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const services = await getServices();

  return (
    <div className='min-h-screen'>
      <FirstStep initialServices={services} />
    </div>
  )
}

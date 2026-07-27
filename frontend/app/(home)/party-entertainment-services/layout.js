const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Party Entertainment Services UK | Buff Butlers, Cocktails, Life Drawing & Strippers",
  description:
    "Explore all our hen party entertainment services: buff butlers, cocktail masterclasses, life drawing classes and male strippers. Instant pricing, trusted entertainers nationwide.",
  alternates: { canonical: SITE_URL + "/party-entertainment-services" },
  openGraph: {
    title: "Party Entertainment Services UK | Hunky Butler Service",
    description:
      "Explore all our hen party entertainment services: buff butlers, cocktail masterclasses, life drawing and male strippers, nationwide.",
    url: SITE_URL + "/party-entertainment-services",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Party Entertainment Services UK | Hunky Butler Service",
    description:
      "Explore all our hen party entertainment services: buff butlers, cocktail masterclasses, life drawing and male strippers, nationwide.",
    images: [SITE_URL + "/logo.png"],
  },
};

export default function PartyEntertainmentServicesLayout({ children }) {
  return children;
}

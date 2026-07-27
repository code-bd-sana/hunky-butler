
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import ReduxProvider from "../provider/ReduxProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// export const metadata = {
//   title: "Hunky Butlers",
//   description: "Buff Butlers, Life Drawing, Cocktail Masterclasses & More, We Bring the Fun to You.",
// };

export const metadata = {
  title: 'Buff Butlers & Hen Party Entertainment | UK’s Hunky Butler Service',
  description:
    'Book buff butlers, topless waiters, life drawing classes, cocktail masterclasses & male strippers for hen parties across the UK. Transparent pricing, verified staff & 5-star reviews.',
  openGraph: {
    title: 'Buff Butlers & Hen Party Entertainment UK',
    description:
      'Hunky Butler Service provides buff butlers, topless waiters, cocktail masterclasses, life drawing and strippers nationwide. Book today.',
    url: '/',
    siteName: 'Hunky Butler Service',
    type: 'website',
        images: [{ url: 'https://www.hunkybutlerservice.co.uk/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buff Butlers & Hen Party Entertainment | UK',
    description:
      'Fun, cheeky and professional hen party entertainment — buff butlers, cocktail classes, life drawing and strippers.',
        images: ['https://www.hunkybutlerservice.co.uk/logo.png'],
  },

  keywords: [
    'buff butlers & hen party entertainment',
    'hire buff butlers',
    'topless waiters',
    'naked butlers',
    'hen party packages',
    'life drawing classes',
    'cocktail masterclasses',
    'male strippers UK',
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "Hunky Butler Service",
  "url": "https://www.hunkybutlerservice.co.uk",
  "logo": "https://www.hunkybutlerservice.co.uk/logo.png",
  "image": "https://www.hunkybutlerservice.co.uk/logo.png",
  "telephone": "+447745865352",
  "email": "info@hunkybutlerservice.co.uk",
  "description":
    "Hunky Butler Service is the UK's buff butler and hen party entertainment company, offering buff butlers, cocktail masterclasses, life drawing classes and male strippers nationwide.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "36a Renshaw Street",
    "addressLocality": "Liverpool",
    "postalCode": "L1 4EF",
    "addressCountry": "GB"
  },
  "areaServed": "GB"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
     <ReduxProvider>

          <Navbar />
        {children}
     </ReduxProvider>

      </body>
    </html>
  );
}

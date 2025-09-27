
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";

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
  alternates: { canonical: '/' },
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
    images: [{ url: '#' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buff Butlers & Hen Party Entertainment | UK',
    description:
      'Fun, cheeky and professional hen party entertainment — buff butlers, cocktail classes, life drawing and strippers.',
    images: ['#'],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
    
         <Navbar />
        {children}

      </body>
    </html>
  );
}

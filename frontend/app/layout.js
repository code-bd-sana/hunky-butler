import "./globals.css";
import { Poppins, Abhaya_Libre } from "next/font/google";
import Analytics, { AnalyticsNoScript } from "@/components/analytics/Analytics";
import CookieBanner from "@/components/analytics/CookieBanner";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});

const abhayaLibre = Abhaya_Libre({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-abhaya-libre",
    display: "swap",
});

export const metadata = {
    title: "Hunky Butler Service",
    description: "Buff Butlers across the UK",
};

export default function RootLayout({ children }) {
    return (
          <html lang='en' className={`${poppins.variable} ${abhayaLibre.variable}`}>
      <head>
        {/* Consent defaults and the container load, in that order. Both render
            nothing at all until NEXT_PUBLIC_GTM_ID is set. */}
        <Analytics />
      </head>
      <body className='font-sans'>
          {/* Must sit immediately inside body. */}
          <AnalyticsNoScript />
          <main>{children}</main>
          <CookieBanner />
  </body>
  </html>
  );
}

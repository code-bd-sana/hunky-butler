import "./globals.css";
import { Poppins, Abhaya_Libre } from "next/font/google";
import { SocketProvider } from "./provider/SocketProvider";
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
      {/* Consent defaults are set before the GTM container loads, so no tag
          can write a cookie before the visitor has chosen. */}
      <Analytics />
      <body className='font-sans'>
          <AnalyticsNoScript />
          <main>{children}</main>
          <CookieBanner />
  </body>
  </html>
  );
}

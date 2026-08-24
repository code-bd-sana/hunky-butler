import "./globals.css";
import { Poppins, Abhaya_Libre } from "next/font/google";

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
      <body className='font-sans'>
          <main>{children}</main>
  </body>
  </html>
  );
}

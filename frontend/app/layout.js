import Navbar from "@/components/shared/Navbar";
import "./globals.css";
import { Poppins } from "next/font/google";
import ReduxProvider from "./provider/ReduxProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Hunky Butler Service",
  description: "Buff Butlers across the UK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <ReduxProvider>
          <Navbar></Navbar>
        </ReduxProvider>
        {children}
      </body>
    </html>
  );
}

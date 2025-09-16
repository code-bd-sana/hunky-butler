
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
export const metadata = {
  title: "Hunky Butlers",
  description:
    "Buff Butlers, Life Drawing, Cocktail Masterclasses & More, We Bring the Fun to You.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

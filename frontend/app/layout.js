import "./globals.css";

export const metadata = {
  title: "Hunky Butler Service",
  description: "Buff Butlers across the UK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
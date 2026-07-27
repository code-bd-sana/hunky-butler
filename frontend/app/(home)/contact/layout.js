const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Contact Us | Hunky Butler Service",
  description:
    "Get in touch to book buff butlers, cocktail masterclasses, life drawing or male strippers for your hen party anywhere in the UK. Our team replies within 24 hours.",
  alternates: { canonical: SITE_URL + "/contact" },
  openGraph: {
    title: "Contact Us | Hunky Butler Service",
    description:
      "Get in touch to book buff butlers, cocktail masterclasses, life drawing or male strippers anywhere in the UK.",
    url: SITE_URL + "/contact",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Hunky Butler Service",
    description:
      "Get in touch to book buff butlers, cocktail masterclasses, life drawing or male strippers anywhere in the UK.",
    images: [SITE_URL + "/logo.png"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}

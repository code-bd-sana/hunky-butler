const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "Hen Party Ideas & Tips Blog | Hunky Butler Service",
  description:
    "Hen party inspiration, planning tips and entertainment ideas from the UK's leading buff butler and hen party entertainment company.",
  alternates: { canonical: SITE_URL + "/blog" },
  openGraph: {
    title: "Hen Party Ideas & Tips Blog | Hunky Butler Service",
    description:
      "Hen party inspiration, planning tips and entertainment ideas from the UK's leading buff butler and hen party entertainment company.",
    url: SITE_URL + "/blog",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hen Party Ideas & Tips Blog | Hunky Butler Service",
    description:
      "Hen party inspiration, planning tips and entertainment ideas from the UK's leading buff butler and hen party entertainment company.",
    images: [SITE_URL + "/logo.png"],
  },
};

export default function BlogLayout({ children }) {
  return children;
}

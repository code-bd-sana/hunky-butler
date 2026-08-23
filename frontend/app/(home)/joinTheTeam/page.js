import Footer from "@/components/homepage/Footer";
import img from "@/public/ImageGalary/pic2.jpeg";
import JoinForm from "@/components/JoinTheTeam/JoinForm";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import WorkWithUsSection from "@/components/JoinTheTeam/WorkWithUsSection";

// Without its own metadata this page inherited the homepage title and
// description verbatim, so several URLs competed on one title.
export const metadata = {
  title: "Buff Butler Jobs UK | Join The Team at Hunky Butler Service",
  description:
    "Apply to work as a buff butler, topless waiter, cocktail host or life drawing model. Flexible, well paid party entertainment work across the UK.",
  alternates: { canonical: "https://www.hunkybutlerservice.co.uk/joinTheTeam" },
  openGraph: {
    title: "Buff Butler Jobs UK | Join The Team at Hunky Butler Service",
    description:
      "Apply to work as a buff butler, topless waiter, cocktail host or life drawing model. Flexible, well paid party entertainment work across the UK.",
    url: "https://www.hunkybutlerservice.co.uk/joinTheTeam",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: "https://www.hunkybutlerservice.co.uk/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buff Butler Jobs UK | Join The Team at Hunky Butler Service",
    description:
      "Apply to work as a buff butler, topless waiter, cocktail host or life drawing model. Flexible, well paid party entertainment work across the UK.",
    images: ["https://www.hunkybutlerservice.co.uk/logo.png"],
  },
};


export default function joinTheTeam() {
  return (
    <div className="min-h-screen bg-white">
      <ServAndAboutBanner
        image={img}
        service={"Join The Team"}
        title={<>Join the Team – Buff Butler Jobs UK</>}
        description={"Looking for flexible, fun, and well-paid work? Hunky Butler Service is always on the lookout for confident, professional, and outgoing people to join our team. From buff butlers and topless waiters to cocktail masterclass hosts and strippers, we provide some of the best party entertainment jobs in the UK."}
      />
      <JoinForm />
      <WorkWithUsSection/>
      <Footer />
    </div>
  );
}

import Footer from "@/components/homepage/Footer";
import img from "@/public/ImageGalary/pic2.jpeg";
import JoinForm from "@/components/JoinTheTeam/JoinForm";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import WorkWithUsSection from "@/components/JoinTheTeam/WorkWithUsSection";

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

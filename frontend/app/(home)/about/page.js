import ImageGallery from "@/components/about/ImageGallery";
import OurMission from "@/components/about/OurMission";
import Footer from "@/components/homepage/Footer";
import HomeMarque from "@/components/homepage/HomeMarque";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import Banner from "@/components/shared/Banner";
import MainTitle from "@/components/shared/typography/MainTitle";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import img from "@/public/About/aboutBannerImg.jpeg";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

export const metadata = {
  title: "About Us | Hunky Butler Service, UK Hen Party Entertainment Since 2013",
  description:
    "Meet the team behind Hunky Butler Service, the UK's trusted name in buff butlers, cocktail masterclasses, life drawing and hen party entertainment since 2013. 12,000+ bookings, verified staff, 5-star reviews.",
  alternates: { canonical: SITE_URL + "/about" },
  openGraph: {
    title: "About Us | Hunky Butler Service",
    description:
      "The UK's trusted name in buff butlers, cocktail masterclasses, life drawing and hen party entertainment since 2013.",
    url: SITE_URL + "/about",
    siteName: "Hunky Butler Service",
    type: "website",
    images: [{ url: SITE_URL + "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Hunky Butler Service",
    description:
      "The UK's trusted name in buff butlers, cocktail masterclasses, life drawing and hen party entertainment since 2013.",
    images: [SITE_URL + "/logo.png"],
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <ServAndAboutBanner
        image={img}
        service={"About Us"}
        title={
          <>
            About Hunky Butler Service: The UK’s Go-To Place to Hire Buff
            <br />
            Butlers
          </>
        }
        description={
          "Founded in 2013, Hunky Butler Service has grown into the UK’s most trusted name for hen party entertainment. Whether you’re looking to hire buff butlers, book a cheeky cocktail masterclass, or host a life drawing class, our mission is simple: to make your celebration unforgettable. With 12,000+ bookings, verified staff, and five-star reviews, we’re here to bring the fun."
        }
      ></ServAndAboutBanner>
      <div className="max-w-7xl mx-auto py-24 text-center">
        <h2 className="text-xl md:text-2xl lg:text-5xl">
          Our Story and What We Do
        </h2>
        <p className="text-center font-medium pt-6 text-xl w-11/12 mx-auto">
          At Hunky Butler Service, we believe great parties should be
          effortless, fun, and full of laughter. Originally founded by Alex Ryan
          in 2013, the company has been under new ownership since 2024, with a
          fresh focus on growing nationwide and expanding across Europe. <br />
        </p>
        <p className="text-center font-medium pt-6 text-xl w-11/12 mx-auto">
          We specialise in creating unique experiences for hen parties,
          birthdays, and special events across the UK. From groups searching to
          hire buff butlers in Liverpool to party planners booking life drawing
          classes in Manchester, we make it easy to secure professional, cheeky
          entertainment tailored to your event.
        </p>
      </div>
      <WhyBookSection />
      <HomeMarque />
      <HowItWorkSection />
      <OurMission />
      <div>
        <div className="max-w-7xl mx-auto text-center pb-6 pt-26">
          <MainTitle text={"Looking Ahead: Expanding Beyond the UK"} />
          <p className="text-center capitalize mt-4 text-[#292929]">
            Since 2024, Hunky Butler Service has started branching into Europe,
            bringing our popular hen party experiences to international
            destinations such as Ibiza, Marbella and Albufeira . Our goal is to
            become the leading name in buff butler hire not just in the UK, but
            worldwide.
          </p>
        </div>
        <ImageGallery />
      </div>
      <Footer />
    </div>
  );
}

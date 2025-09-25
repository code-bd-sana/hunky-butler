import ImageGallery from "@/components/about/ImageGallery";
import OurMission from "@/components/about/OurMission";
import Footer from "@/components/homepage/Footer";
import HomeMarque from "@/components/homepage/HomeMarque";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import Banner from "@/components/shared/Banner";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import img from "@/public/About/aboutBannerImg.jpeg";

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
          "Founded in 2013, Hunky Butler Service has grown into the UK’s most trusted name for hen party entertainment. Whether you’re looking to hire buff butlers, book a cheeky cocktail masterclass, or host a life drawing class, our mission is simple — to make your celebration unforgettable. With 12,000+ bookings, verified staff, and five-star reviews, we’re here to bring the fun."
        }
      ></ServAndAboutBanner>
      <WhyBookSection />
      <HomeMarque />
      <HowItWorkSection />
      <OurMission />
      <ImageGallery />
      <Footer />
    </div>
  );
}

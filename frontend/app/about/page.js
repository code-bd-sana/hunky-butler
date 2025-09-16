import ImageGallery from "@/components/about/ImageGallery";
import OurMission from "@/components/about/OurMission";
import Footer from "@/components/homepage/Footer";
import HomeMarque from "@/components/homepage/HomeMarque";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import Banner from "@/components/shared/Banner";
import img from "../../public/About/aboutBannerImg.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Banner
        image={img}
        service={"About Us"}
        title={"About Us"}
        description={
          "We’re passionate about creating memorable celebrations by connecting hosts with talented professionals. With trusted performers and seamless booking, we make every event stress-free, fun, and one of a kind."
        }
      />
      <WhyBookSection />
      <HomeMarque />
      <HowItWorkSection />
      <OurMission />
      <ImageGallery />
      <Footer />
    </div>
  );
}

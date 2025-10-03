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
      <div className="max-w-7xl mx-auto py-28 text-center">
        <h1 className="text-xl md:text-2xl lg:text-5xl  font-semibold">
          Our Story and What We Do
        </h1>
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
      <ImageGallery />
      <Footer />
    </div>
  );
}

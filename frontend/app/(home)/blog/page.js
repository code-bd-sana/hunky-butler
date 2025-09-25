import ImageGallery from "@/components/about/ImageGallery";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import img from "@/public/Blog/BlogBg.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <ServAndAboutBanner
        image={img}
        service={"Blog"}
        title={
          <>
            Hen Party Ideas UK: Inspiration, Tips and
            <br />
            Ideas
          </>
        }
        description={
          "Welcome to the Hunky Butler Service blog — your go-to guide for hen party ideas across the UK. From cheeky buff butlers to cocktail masterclasses, life drawing, and strippers, we share expert tips, trending themes, and planning advice to help you create the ultimate celebration."
        }
      ></ServAndAboutBanner>
      <BlogSection />
      <ImageGallery />
      <Footer />
    </div>
  );
}

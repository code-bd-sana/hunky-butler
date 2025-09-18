import ImageGallery from "@/components/about/ImageGallery";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import img from "@/public/Blog/BlogBg.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Banner
        image={img}
        service={"Blog"}
        title={"Blog"}
        description={
          "Get tips, trends, and inspiration for planning unforgettable parties. From hen do ideas to cocktail recipes and entertainment guides, our blog keeps you ahead of the game in event planning."
        }
      />
      <BlogSection />
      <ImageGallery />
      <Footer />
    </div>
  );
}

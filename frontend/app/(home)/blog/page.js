"use client"
import ImageGallery from "@/components/about/ImageGallery";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import MainTitle from "@/components/shared/typography/MainTitle";
import SecondaryTitle from "@/components/shared/typography/SecondaryTitle";
import ServAndAboutBanner from "@/components/shared/typography/ServAndAboutBanner";
import SubTitle from "@/components/shared/typography/SubTitle";
import img from "@/public/Blog/BlogBg.jpeg";
import { store } from "@/store/store";
import { Provider } from "react-redux";

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


      <div className='text-center mb-12 pt-16'>
              <MainTitle
                text={"Planning the Perfect Hen Party or Event"}
              
              />
              <div className=' max-w-7xl mx-auto mt-4'>
                <SubTitle text={"Organising a hen do can feel overwhelming, but it doesn’t have to be. Here, you’ll find hen party entertainment ideas, fun games, and step-by-step guides to planning your night. Whether you’re hosting in Liverpool, Manchester, London, or anywhere else in the UK, our blog is designed to give you inspiration that’s practical and easy to follow.From stylish cocktail classes to cheeky life drawing sessions, we cover it all — so you can focus on making memories with your group."} />
              </div>
            </div>
      <Provider store={store}>
        <BlogSection />
      </Provider>
      <ImageGallery />
      <Footer />
    </div>
  );
}

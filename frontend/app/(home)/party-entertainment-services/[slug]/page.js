'use client'
import ImageGallery from "@/components/about/ImageGallery";
import BuffLocation from "@/components/BuffLocation/BuffLocation";
import Cocktail from "@/components/cocktail/Cocktail";
import Extra from "@/components/Extra/Extra";
import Footer from "@/components/homepage/Footer";
import Frequently from "@/components/homepage/Frequently";
import KeepTheFun from "@/components/KeepTheFun/KeepTheFun";
import Nationwide from "@/components/Nationwide/Nationwide";
import BookNowSection from "@/components/ServiceHeroSection/BookNowSection";
import HowItWorkSection from "@/components/ServiceHeroSection/HowItWorkSection";
import ReviewSection from "@/components/ServiceHeroSection/ReviewSection";
import WhyBookSection from "@/components/ServiceHeroSection/WhyBookSection";
import ServiceBanner from "@/components/shared/ServiceBanner";
import { useGetServiceJoyBanglaQuery } from "@/features/butler";
import { base_url } from "@/utils/utils";
import { useParams } from "next/navigation";
import React from "react";


export default function ServiceDetailspage() {


console.log('tomi sodo amar')
const {slug} = useParams();
console.log(slug, "tomi amar personal slug");
const {data} = useGetServiceJoyBanglaQuery(slug);
console.log(data, "please allah")

// if(loadiing){
//   return <p>Loading...</p>
// }
// if(error){
//   console.log(error, "ami tomar error")
// }


  return (
     <div>
      <ServiceBanner
        heading={"Buff Butlers for Hire – UK’s Top Hen Party & Event Hosts"}
        subTitle={
          "Fun, cheeky and professional butlers to keep your guests entertained, wherever you’re celebrating."
        }
        image={data?.banner}
        slug={data?.slug}
      />
      <BookNowSection
        name={data?.name}
        included={data?.included}
        banner={data?.banner}
        // bulletPoints={bulletPoints}
      />
      <HowItWorkSection
        text={"Enter postcode, date, and duration, Get instant pricing."}
        text1={"Choose your preferred butler & confirm."}
        text3={"Enjoy a fun, stress-free night with your Buff Butler."}
      />
      {/* <WhyBookSection />
      <KeepTheFun />
      <Cocktail />
      <BuffLocation/> */}
      {/* <ReviewSection />
      <Frequently /> */}
         {/* <BuffLocation/> */}
         <WhyBookSection />
 <KeepTheFun />
              <Cocktail />
    <ReviewSection />
  <Frequently />
        {/* <Nationwide /> */}
           <ImageGallery /> 
      <Footer />
    </div>
  )
}

"use client";
import JoinBlog from "@/components/JoinTheTeam/JoinBlog";
import ContactForm from "@/components/contact/ContactForm";
import WhyContactUsSection from "@/components/contact/WhyContactUsSection";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import MainTitle from "@/components/shared/typography/MainTitle";
import SubTitle from "@/components/shared/typography/SubTitle";
import bg from "@/public/Contact/contact-banner.jpeg";
const contact = () => {
  return (
    <div className="bg-[#f6f4f5] min-h-screen">
      <Banner image={bg.src} service={"contact us"} title={"Contact"} />
    <section className="px-6">

        <div className="text-center pt-16">
        <MainTitle text={"Have Any Questions? Get in Touch With Our Team?"} />
        <div className=" max-w-7xl mx-auto mt-4">
          <SubTitle
            text={
              "Planning a hen party, birthday, or special event? Whether you’re looking to hire buff butlers in Liverpool, book a cocktail masterclass in Manchester, or organise a life drawing class in London, our friendly team is here to help.Simply fill out the form below and one of our event coordinators will get back to you quickly. We aim to respond to all enquiries within 24 hours."
            }
          />
        </div>
      </div>    
      {/* <Card /> */}
      <ContactForm />
            <WhyContactUsSection></WhyContactUsSection>
      <JoinBlog/>
    </section>
 <div className="pt-96">
       <Footer />
 </div>
    </div>
  ); 
};

export default contact;

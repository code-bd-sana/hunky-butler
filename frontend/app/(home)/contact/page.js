"use client";
import Banner from "@/components/shared/Banner";
import img from "@/public/Blog/BlogSection/BlogSection9.jpeg";
import ContactForm from "@/components/contact/ContactForm";
import Card from "@/components/Dashboard/Card";
import Planning from "@/components/homepage/Planning";
import Footer from "@/components/homepage/Footer";
import MainTitle from "@/components/shared/typography/MainTitle";
import SubTitle from "@/components/shared/typography/SubTitle";
import JoinBlog from "@/components/JoinTheTeam/JoinBlog";
const contact = () => {
  return (
    <div className="bg-[#f6f4f5] min-h-screen">
      <Banner image={img} service={"contact us"} title={"Contact"} />
      <div className="text-center mb-12 pt-16">
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
      <Planning />
      <JoinBlog/>
      <Footer />
    </div>
  );
};

export default contact;

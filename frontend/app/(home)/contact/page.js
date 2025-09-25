"use client";
import Banner from "@/components/shared/Banner";
import img from "@/public/Blog/BlogSection/BlogSection9.jpeg";
import ContactForm from "@/components/contact/ContactForm";
import Card from "@/components/Dashboard/Card";
import Planning from "@/components/homepage/Planning";
import Footer from "@/components/homepage/Footer";
const contact = () => {
  return (
    <div className="bg-[#f6f4f5] min-h-screen">
      <Banner
        image={img}
        service={"contact us"}
        title={"Contact"}
      />
      {/* <Card /> */}
      <ContactForm />
      <Planning/>
      <Footer/>
    </div>
  );
};

export default contact;

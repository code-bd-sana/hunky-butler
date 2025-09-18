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
        description={
          "Have questions or ready to book? Our team is here to help with quotes, custom requests, and support. Reach out anytime and let us bring energy, style, and fun to your event."
        }
      />
      {/* <Card /> */}
      <ContactForm />
      <Planning/>
      <Footer/>
    </div>
  );
};

export default contact;

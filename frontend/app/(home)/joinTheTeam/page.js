import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import img from "@/public/ImageGalary/pic2.jpeg";
import JoinForm from "@/components/JoinTheTeam/JoinForm";

export default function joinTheTeam() {
  return (
    <div className="min-h-screen bg-white">
      <Banner
        image={img}
         service={"Blog Details"}
        title={"Cocktail Making: Tools You Need at Home"}
        description={"February 11, 2014 | Sara Ali"}
      />
      <JoinForm/>
      <Footer />
    </div>
  );
}
 
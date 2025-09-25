import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import img from "@/public/ImageGalary/pic2.jpeg";
import JoinForm from "@/components/JoinTheTeam/JoinForm";

export default function joinTheTeam() {
  return (
    <div className="min-h-screen bg-white">
      <Banner
        image={img}
        service={"Join The Team"}
        title={
          <>
            Join the Team – Buff Butler <br /> Jobs UK
          </>
        }
      />
      <JoinForm />
      <Footer />
    </div>
  );
}

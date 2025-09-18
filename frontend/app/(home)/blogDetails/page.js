import BlogDetails from "@/components/BlogDetails/BlogDetails";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import React from "react";
import img from "@/public/BlogDetails/pic.jpeg";
import Planning from "@/components/homepage/Planning";

const blogDetails = () => {
  return (
    <div className="min-h-screen bg-white">
      <Banner image={img} service={"Join"} title={"Join The Team"} />
      <BlogDetails />
      <Planning title="Related" highlight=" Blog" />
      <Footer />
    </div>
  );
};

export default blogDetails;

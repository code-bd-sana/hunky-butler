import BlogDetails from "@/components/BlogDetails/BlogDetails";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import React from "react";
import img from "@/public/BlogDetails/pic.jpeg";
import Planning from "@/components/homepage/Planning";

const blogDetails = () => {
  return (
    <div className="min-h-screen bg-white">
      <Banner
        image={img}
        service={"Blog"}
        title={"Cocktail Making: Tools You Need at Home"}
        description={"February 11, 2014 | Sara Ali"}
      />
      <BlogDetails />
      <Planning title="Related" highlight=" Blog" />
      <Footer />
    </div>
  );
};

export default blogDetails;


const WhyContactUsSection = () => {
  return (
    <div className="max-w-7xl mx-auto ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Side Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111]">
            Why Contact Us?
          </h2>
          <p className="text-lg text-[#555] leading-relaxed">
            With Over 12,000 Bookings Across The UK, We've Built A Reputation
            For Making Events Effortless And Unforgettable. By Contacting Us
            Directly, You'll Benefit From:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="text-[#ff4b5c] text-xl mr-2">•</span>
              Transparent, Upfront Pricing With No Hidden Fees
            </li>
            <li className="flex items-center">
              <span className="text-[#ff4b5c] text-xl mr-2">•</span>
              Verified, Insured, And Experienced Entertainers
            </li>
            <li className="flex items-center">
              <span className="text-[#ff4b5c] text-xl mr-2">•</span>
              Nationwide Coverage From Liverpool, Manchester, And Leeds To
              London, Birmingham, And Beyond
            </li>
            <li className="flex items-center">
              <span className="text-[#ff4b5c] text-xl mr-2">•</span>
              Flexible Booking Options To Suit Your Event
            </li>
          </ul>
          <p className="text-lg text-[#555]">
            Whether You're Ready To Book Or Just Need Advice, Our Team Will
            Guide You Through The Process And Help You Find The Perfect
            Entertainment For Your Celebration.
          </p>
        </div>

        {/* Right Side Image Gallery */}
        <div className=" flex flex-col items-center justify-center space-y-1 md:space-y-3">
          {/* Top Row */}
          <div className="flex flex-wrap w-full gap-1 md:gap-3">
            <div className="flex-[2] sm:flex-[2] md:flex-[2] lg:flex-[12]">
              <img
                src="/location/Scottish.jpeg"
                alt="pic1"
                className="w-full h-28 md:h-40 lg:h-[200px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
            <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[4]">
              <img
                src="/contact/why-contact-us2.jpeg"
                alt="pic2"
                className="w-full h-28 md:h-40 lg:h-[200px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap w-full  gap-1 md:gap-3">
            <div className="flex-[2.5] sm:flex-[3] md:flex-[2.5] lg:flex-[4] ">
              <img

                src="/contact/why-contact-us3.jpeg"
                alt="pic5"
                className="w-full h-28 md:h-40 lg:h-[200px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
            <div className="flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[12] ">
              <img

                src="/contact/contact-banner.jpeg"
                alt="pic6"
                className="w-full h-28 md:h-40 lg:h-[200px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyContactUsSection;

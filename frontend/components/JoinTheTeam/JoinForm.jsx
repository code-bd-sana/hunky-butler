import Image from "next/image";
import React from "react";
import { PiPaperclipDuotone } from "react-icons/pi";

const JoinForm = () => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/Contact/contactBg.png')",
        backgroundSize: "cover", // not backgroundImage: "cover"
        backgroundRepeat: "no-repeat", // optional
      }}
    >
      <img
        src="/Footer/loon.png"
        alt="Logo"
        className="w-[680px] absolute top-105 -left-91"
      />
      <img
        src="/Footer/loon.png"
        alt="Logo"
        className="w-[680px] absolute top-155 -right-144"
      />
      <div className="max-w-[1252px] mx-auto py-28">
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Image */}
          <div className="w-full h-[600px] md:w-[582px] md:h-[732px] relative">
            <Image
              src="/Join/join.png"
              alt="Contact"
              fill
              className="rounded-lg shadow-lg object-cover"
              c
            />
          </div>

          {/* Right Form */}
          <div>
            <h2 className="text-pink-600 font-semibold text-[32px] mb-4 capitalize">
              Fill out the form below to start you journey with hunky butler
              service
            </h2>
            <form className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="mb-2 text-base font-medium text-[#808080]"
                  >
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="mb-2 text-base font-medium text-[#808080]"
                  >
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>
              </div>

              {/* Email & Phone */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-2 text-base font-medium text-[#808080]"
                  >
                    E-Mail*
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-base font-medium text-[#808080]">
                    Phone *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="+55 0"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="mb-2 text-base font-medium text-[#808080]"
                >
                  Desired position*
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="attachment"
                  className="mb-2 text-base font-medium text-[#808080]"
                >
                  Attachments (Optional)
                </label>

                <label
                  htmlFor="attachment"
                  className="flex items-center gap-2 px-4 py-2 w-fit cursor-pointer border rounded-xl bg-white shadow-sm hover:bg-gray-50 text-gray-700"
                >
                  <PiPaperclipDuotone size={18} />
                  Click To Add File
                </label>

                <input id="attachment" type="file" className="hidden" />
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-2 text-base font-medium text-[#808080]"
                >
                  Describe why you are the best choice for this position
                </label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Message"
                  className="w-full p-3 border rounded-2xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                ></textarea>
              </div>

              {/* Button */}

              <div className="px-2">
                <button
                  type="submit"
                  className="w-1/3 bg-[#FF006A] text-white py-4 text-lg rounded-full hover:bg-white hover:text-[#FF006A] hover:border-3  transition"
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Info */}
      </div>
    </div>
  );
};

export default JoinForm;

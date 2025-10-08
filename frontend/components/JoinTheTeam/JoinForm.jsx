import Image from "next/image";
import React from "react";
import { PiPaperclipDuotone } from "react-icons/pi";

const JoinForm = () => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/Contact/contactBg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating Loons */}
      <img
        src="/Footer/loon.png"
        alt="Decorative balloon"
        className="hidden lg:block w-[680px] absolute top-105 -left-91"
      />
      <img
        src="/Footer/loon.png"
        alt="Decorative balloon"
        className="hidden lg:block w-[680px] absolute top-155 -right-144"
      />

      <div className="max-w-[1252px] mx-auto py-28 px-4">
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT IMAGE — stacked on top for md and below lg */}
          <div className="w-full h-[500px] md:h-[600px] lg:h-[732px] relative order-1 lg:order-none">
            <Image
              src="/Join/kissingBut.jpeg"
              alt="Buff butler entertainer working at UK hen party"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="relative order-2 lg:order-none">
            <h2 className="text-pink-600 font-semibold text-[28px] md:text-[32px] mb-6 capitalize leading-snug">
              Fill out the form below to start your journey with Hunky Butler
              Service
            </h2>

            <form className="space-y-5">
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
                  <label
                    htmlFor="phone"
                    className="mb-2 text-base font-medium text-[#808080]"
                  >
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="+55 0"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>
              </div>

              {/* Desired Position */}
              <div className="flex flex-col">
                <label
                  htmlFor="position"
                  className="mb-2 text-base font-medium text-[#808080]"
                >
                  Desired position*
                </label>
                <input
                  id="position"
                  type="text"
                  className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                />
              </div>

              {/* Attachments */}
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
                  className="w-1/3 bg-[#FF006A] text-white py-4 text-lg rounded-full hover:bg-white hover:text-[#FF006A] hover:border hover:border-[#FF006A] transition"
                >
                  Apply Now
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;

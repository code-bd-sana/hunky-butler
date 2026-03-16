"use client";
import { useGetServiceJoyBanglaQuery } from "@/features/butler";
import Image from "next/image";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const ContactForm = () => {
  const data = useGetServiceJoyBanglaQuery("cocktail-masterclasses");

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
      <div className="max-w-[1252px] mx-auto py-28 bg-[#f6f4f5]">
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Image */}
          <div className="w-full h-[600px] md:w-[582px] md:h-[732px] relative">
            <Image
              src="/Contact/contact.png"
              alt="Buff butler entertainer with party guests"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Right Form */}
          <div>
            <h2 className="text-pink-600 font-semibold text-[32px] mb-8 capitalize">
              fill out the form below to get in touch with our team and we will
              Reply
            </h2>
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="mb-2 text-lg font-medium text-[#808080]"
                  >
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="mb-2 text-lg font-medium text-[#808080]"
                  >
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                  />
                </div>
              </div>

              {/* Email & Phone */}

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 text-lg font-medium text-[#808080]"
                >
                  E-Mail*
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="mb-2 text-lg font-medium text-[#808080]"
                >
                  Phone*
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+55 0"
                  className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-2 text-lg font-medium text-[#808080]"
                >
                  Message*
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
                  className="w-full bg-[#FF006A] text-white py-4 text-lg rounded-full hover:bg-white hover:text-[#FF006A] hover:border-3  transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 text-center mt-40">
          {/* Email */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <span className="w-19 h-19 flex items-center justify-center rounded-full bg-white text-pink-600">
                <MdEmail size={30} />
              </span>
            </div>
            <h3 className="font-medium text-[#6B6B6B] text-lg">Email Us</h3>
            <p className="text-2xl font-medium">
              info@hunkybutlerservice.co.uk
            </p>
            <p className="text-2xl font-medium">
              Bookings@hunkybutlerservice.co.uk
            </p>
          </div>

          {/* Call Us */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <span className="w-19 h-19 flex items-center justify-center rounded-full bg-white text-pink-600">
                <MdPhone size={30} />
              </span>
            </div>
            <h3 className="font-medium text-[#6B6B6B] text-lg">Call Us</h3>
            <p className="text-2xl font-medium">+44 7745 865352</p>
            <p className="text-2xl font-medium">0800 046 2832</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <span className="w-19 h-19 flex items-center justify-center rounded-full bg-white text-pink-600">
                <MdLocationOn size={30} />
              </span>
            </div>
            {/* <h3 className="font-medium text-[#6B6B6B] text-lg">Drop in Us</h3>
            <p className="text-2xl font-medium">2464 Royal Ln. Mesa,</p>
            <p className="text-2xl font-medium">New Jersey 45463</p> */}
            <h3 className="font-medium text-[#6B6B6B] text-lg">Address</h3>
            <p className="text-2xl font-medium">
              36A Renshaw Street <br /> Liverpool l1
              <br /> 4EF United Kingdom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

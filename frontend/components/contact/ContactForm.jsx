"use client";
import Image from "next/image";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const ContactForm = () => {
  return (
    <div className="max-w-[1252px] mx-auto px-6 py-28 bg-[#f6f4f5]">
      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Image */}
        <div className="w-[582px] h-[732px] relative">
          <Image
            src="/ImageGalary/pic8.jpeg"
            alt="Contact"
            fill
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Right Form */}
        <div>
          <h2 className="text-pink-600 font-semibold text-3xl mb-8">
            You’ll Always Get Kindness In Every Interaction
          </h2>
          <form className="space-y-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="mb-1 text-lg font-medium text-gray-700"
                >
                  First Name
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
                  className="mb-1 text-lg font-medium text-gray-700"
                >
                  Last Name*
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name*"
                  className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none placeholder-black"
                />
              </div>
            </div>

            {/* Email & Phone */}

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-lg font-medium text-gray-700"
              >
                E-Mail*
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-mail*"
                className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="mb-1 text-lg font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+55 0"
                className="w-full p-3 border rounded-4xl bg-white focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-1 text-lg font-medium text-gray-700"
              >
                Message*
              </label>
              <textarea
                id="message"
                rows="4"
                placeholder="Message*"
                className="w-full p-3 border rounded-2xl bg-white focus:ring-2 focus:ring-pink-500 outline-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#FF006A] text-white py-3 text-lg rounded-full hover:bg-white hover:text-[#FF006A] hover:border-3  transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-8 text-center mt-16">
        {/* Email */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-pink-600">
              <MdEmail size={24} />
            </span>
          </div>
          <h3 className="font-semibold">Email Us</h3>
          <p>Info@Hunkybutlerservice.Com</p>
          <p>Help@Hunkybutlerservice.Com</p>
        </div>

        {/* Call Us */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-pink-600">
              <MdPhone size={24} />
            </span>
          </div>
          <h3 className="font-semibold">Call Us</h3>
          <p>+(807) 555-0101</p>
          <p>+(252) 555-0126</p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-pink-600">
              <MdLocationOn size={24} />
            </span>
          </div>
          <h3 className="font-semibold">Drop in Us</h3>
          <p>2464 Royal Ln. Mesa,</p>
          <p>New Jersey 45463</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

"use client";
import React, { useState } from "react";
import { GiHeartMinus } from "react-icons/gi";
import { GiHeartPlus } from "react-icons/gi";
const Frequently = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 2–4 weeks before your event, but last-minute bookings are often possible.",
    },
    {
      question: "Can I customize my service?",
      answer:
        'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
    },
    {
      question: "Are your performers verified?",
      answer:
        'Go to "My Account" settings and select "Edit Profile" to make changes.',
    },
    {
      question: "Are there any upfront charges needed?",
      answer:
        'Go to "My Account" settings and select "Edit Profile" to make changes.',
    },
  ];
  const faqs2 = [
    {
      question: "How long can I book a hunky butler for?",
      answer:
        "Typically 2 hours, but you can extend.Typically 2 hours but you can extend Typically 2 hours but you can extend.",
    },
    {
      question: "Do I need to provide costumes or props?",
      answer:
        'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
    },
    {
      question: "Can I book multiple butlers for one event?",
      answer:
        'Go to "My Account" settings and select "Edit Profile" to make changes.',
    },
    {
      question: "What areas do you cover?",
      answer:
        'Go to "My Account" settings and select "Edit Profile" to make changes.',
    },
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto mt-20 mb-20">
      <div className="text-center mb-8 md:mb-20 space-y-2 md:space-y-6">
        <h1 className="text-2xl md:text-5xl font-semibold">
          Frequently Asked
          <span className="text-[#FF006A] italic"> Questions</span>
        </h1>
        <p className="text-lg text-[#333333]">
          here We have cleared all your confusions
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-10">
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-2xl mb-4 bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-5 h-[100px] text-left font-semibold hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl md:text-3xl">{faq.question}</span>
                <span className="text-xl md:text-3xl">
                  {openIndex === index ? (
                    <GiHeartPlus className="text-[#FF006A]" />
                  ) : (
                    <GiHeartMinus className="text-[#FF006A]" />
                  )}
                </span>
              </button>

              <div
                className={`px-4 pb-3 text-base text-gray-600 overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        <div className="w-1 md:h-[490] bg-gray-200"></div>
        <div>
          {faqs2.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-2xl mb-4 bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-start px-5 h-[100px] text-left font-semibold hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl md:text-3xl">{faq.question}</span>
                <span className="text-xl md:text-3xl">
                  {openIndex === index ? (
                    <GiHeartPlus className="text-[#FF006A]" />
                  ) : (
                    <GiHeartMinus className="text-[#FF006A]" />
                  )}
                </span>
              </button>

              <div
                className={`px-4 pb-3 text-base text-gray-600 overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center my-4 md:my-10">
        <button className="bg-none text-[#FF006A] px-4 md:px-6 py-2 md:py-4 rounded-full font-medium text-base md:text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A]">
          Try a 30-second quote now
        </button>
      </div>
    </div>
  );
};

export default Frequently;

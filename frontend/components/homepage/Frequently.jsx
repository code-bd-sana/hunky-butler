"use client";
import Link from "next/link";
import { useState } from "react";
import { GiHeartMinus, GiHeartPlus } from "react-icons/gi";
const Frequently = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 2 to 4 weeks before your event, but last-minute bookings are often possible.",
    },
    {
      question: "Can I customize my service?",
      answer:
        "Yes, every booking can be tailored to your group, from the number of butlers and add-ons like cocktail masterclasses or life drawing, to specific games and photo requests. Just let us know your preferences when you book.",
    },
    {
      question: "Are your performers verified?",
      answer:
        "Yes, all of our butlers and entertainers are verified, insured and experienced professionals, we check references and experience before anyone joins the team.",
    },
    {
      question: "Are there any upfront charges needed?",
      answer:
        "No hidden fees. You'll get a fully transparent, instant quote covering time, staff, location and travel before you pay anything, with secure online booking.",
    },
  ];
  const faqs2 = [
    {
      question: "How long can I book a hunky butler for?",
      answer:
        "Typically 2 hours, but bookings can be extended to suit your event, just let us know when you enquire.",
    },
    {
      question: "Do I need to provide costumes or props?",
      answer:
        "No, our butlers arrive fully equipped with their signature uniform and any props needed for games or add-ons like cocktail masterclasses and life drawing sessions.",
    },
    {
      question: "Can I book multiple butlers for one event?",
      answer:
        "Absolutely. Many hen parties and larger events book two or more butlers, just let us know your group size when requesting a quote.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We cover major cities and towns across the UK, including Liverpool, Manchester, Birmingham, Leeds and London, get an instant quote for your postcode to check availability.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...faqs, ...faqs2].map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto mt-20 mb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="text-center mb-8 md:mb-20 space-y-2 md:space-y-6">
        <h2 className="text-2xl md:text-5xl font-semibold">
          Frequently Asked
          <span className="text-[#FF006A] italic"> Questions</span>
        </h2>
        <p className="text-lg text-[#333333] md:w-5/6 mx-auto">
          Got a question before booking? Here are answers to some of the most
          common queries about our Buff Butlers, Cocktail Classes, Life Drawing
          Parties and more.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-10 md:mx-3.5">
        <div className="cursor-pointer">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-2xl mb-4 bg-white shadow-sm cursor-pointer"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-5 h-[100px] text-left font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-xl md:text-3xl">{faq.question}</span>
                <span className="text-xl md:text-3xl">
                  {openIndex === index ? (

                           <GiHeartMinus className="text-[#FF006A]" />
                  ) : (
                             <GiHeartPlus className="text-[#FF006A]" />
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
                className="w-full flex justify-between items-center px-5 h-[100px] text-left font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-xl md:text-3xl">{faq.question}</span>
                <span className="text-xl md:text-3xl">
                  {openIndex === index ? (
                 <GiHeartMinus className="text-[#FF006A]" />
                  ) : (

                      <GiHeartPlus className="text-[#FF006A]" />
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
        <Link href={'/quote'}>
          <button className="cursor-pointer bg-none text-[#FF006A] px-4 md:px-6 py-2 md:py-4 rounded-full font-medium text-base md:text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A]">
            Try a 30-second quote now
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Frequently;

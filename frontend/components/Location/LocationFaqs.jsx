import React from "react";
import Link from "next/link";

/**
 * City-specific FAQ block, with FAQPage JSON-LD so the questions are eligible
 * for expanded results in Google.
 *
 * Renders nothing if the city has no faqs array in locations.json, so template
 * cities are unaffected.
 */
const LocationFaqs = ({ faqs, city, serviceName = "Buff Butler" }) => {
  if (!faqs || faqs.length === 0) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] text-center mb-12">
        {city} {serviceName} FAQs
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-6 py-5 font-semibold text-lg md:text-xl text-[#0A012A] flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
              <span>{faq.question}</span>
              <span className="text-[#FF006A] text-2xl shrink-0 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-6 pb-5 text-gray-700 leading-relaxed text-base md:text-lg">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/quote">
          <button className="cursor-pointer bg-none text-[#FF006A] px-4 md:px-6 py-2 md:py-4 rounded-full font-medium text-base md:text-xl hover:bg-pink-600 hover:text-white transition border-2 border-[#FF006A]">
            Try a 30-second quote now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LocationFaqs;

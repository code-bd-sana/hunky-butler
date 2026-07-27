import React from "react";
import Link from "next/link";

/**
 * Renders the city-specific SEO content blocks for a location page.
 *
 * Every section here is optional: a city only renders a block if that block
 * exists in locations.json. Cities that still use the shared template (i.e.
 * everything except Liverpool right now) pass nothing and render nothing, so
 * their pages are completely unaffected.
 */
const LocationLocalContent = ({ localSection, partnerVenues, areasServed }) => {
  if (!localSection && !partnerVenues && !areasServed) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Local planning advice */}
      {localSection && (
        <section>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-8">
            {localSection.heading}
          </h2>
          <div className="space-y-5">
            {localSection.paragraphs?.map((para, i) => (
              <p
                key={i}
                className="text-gray-700 leading-relaxed text-base md:text-lg"
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Partner accommodation venues */}
      {partnerVenues && (
        <section>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-6">
            {partnerVenues.heading}
          </h2>
          {partnerVenues.intro && (
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-8">
              {partnerVenues.intro}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerVenues.venues?.map((venue) => (
              <div
                key={venue.name}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col"
              >
                <h3 className="text-xl font-bold mb-3 text-[#0A012A]">
                  {venue.name}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base flex-grow">
                  {venue.description}
                </p>
                <a
                  href={venue.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-block text-[#FF006A] font-medium hover:underline"
                >
                  Visit {venue.name} &rarr;
                </a>
              </div>
            ))}
          </div>

          {partnerVenues.outro && (
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-8">
              {partnerVenues.outro}
            </p>
          )}
        </section>
      )}

      {/* Areas covered + internal links to nearby city pages */}
      {areasServed && (
        <section>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-6">
            {areasServed.heading}
          </h2>
          {areasServed.intro && (
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              {areasServed.intro}
            </p>
          )}

          {areasServed.nearby?.length > 0 && (
            <>
              {areasServed.nearbyIntro && (
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-5">
                  {areasServed.nearbyIntro}
                </p>
              )}
              <ul className="flex flex-wrap gap-3 mt-5">
                {areasServed.nearby.map((place) => (
                  <li key={place.slug}>
                    <Link
                      href={`/${place.slug}`}
                      className="inline-block border-2 border-[#FF006A] text-[#FF006A] rounded-full px-5 py-2 font-medium hover:bg-[#FF006A] hover:text-white transition"
                    >
                      {place.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default LocationLocalContent;

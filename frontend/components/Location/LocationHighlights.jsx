import React from "react";
import Image from "next/image";
import Link from "next/link";

import icon from "@/public/icons/arowright.png";
import perfect from "@/public/location/perfect.jpeg";

/**
 * Two-column highlights block: what makes this service in this city worth
 * booking, next to a photo, with the quote call to action.
 *
 * Matches the layout used on the database-driven /locations pages, but every
 * piece of copy comes from the page data. The original PerfectForAll component
 * hardcodes "Our Scottish Hunky Butlers" and "Make every Nottingham
 * celebration unforgettable" on every city, which is the same bug as the
 * hardcoded Dublin description.
 *
 * Renders nothing when a page supplies no highlights, so the legacy city pages
 * are untouched.
 */
const LocationHighlights = ({ city, serviceName, heading, intro, points = [] }) => {
  if (!points.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
        <div className="flex-1">
          <h2 className="max-w-2xl text-2xl font-medium leading-snug text-[#141414] md:text-3xl lg:text-4xl">
            {heading || "What Makes Our " + city + " " + serviceName + " Different"}
          </h2>

          {intro && (
            <p className="my-6 text-base text-[#333333] md:text-lg">{intro}</p>
          )}

          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-4">
                <Image
                  alt=""
                  aria-hidden="true"
                  src={icon}
                  width={20}
                  height={20}
                  className="mt-1 shrink-0"
                />
                <p className="font-medium text-[#333333]">{point}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              href="/quote"
              className="inline-block rounded-full border-2 border-[#FF006A] px-6 py-3 text-base font-medium text-[#FF006A] transition-colors hover:bg-[#FF006A] hover:text-white md:px-8 md:py-4 md:text-xl"
            >
              Try a 30-second quote now
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <Image
            alt={serviceName + " booking in " + city}
            src={perfect}
            width={600}
            height={700}
            className="h-[420px] w-full rounded-3xl object-cover md:h-[620px]"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationHighlights;

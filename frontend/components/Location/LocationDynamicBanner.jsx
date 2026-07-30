import React from "react";
import Link from "next/link";
import Image from "next/image";
import arrow from "@/public/icons/greaterthan.png";
import defaultBanner from "@/public/ImageGalary/pic6.jpeg";

/**
 * Hero banner for city pages.
 *
 * Matches the centred hero design used elsewhere on the site: breadcrumbs,
 * large centred heading, supporting copy and a call-to-action.
 *
 * Improvements over the original version of that design:
 *  - breadcrumbs are real links rather than plain text, so they work and pass
 *    link signals
 *  - the call button is an anchor styled as a button, rather than an anchor
 *    nested inside a button (which is invalid HTML)
 *  - a second CTA points at the quote flow, which is the actual conversion goal
 *  - the hero photo is a real <Image> with `priority`, not a CSS background.
 *    As a background the browser could not discover it until the CSS had
 *    parsed, Next could not optimise it, and both the city photo and the
 *    fallback were downloaded. Largest Contentful Paint on mobile was 5.9s.
 *  - the city image is used when one exists, falling back to the shared banner
 */
const LocationDynamicBanner = ({
  image,
  title,
  tagline,
  description,
  hubPath = "/buff-butlers",
  hubLabel = "Buff Butlers",
}) => {
  return (
    <div className="relative min-h-[620px] w-full overflow-hidden">
      <Image
        src={image || defaultBanner}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Gradient overlay for text legibility, previously part of the
          stacked background-image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/95"
      />
      <div className="relative z-10 flex min-h-[620px] flex-col items-center justify-end px-6 pb-12 pt-32 text-center">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex text-base md:text-xl gap-[12px] justify-center items-center font-medium text-white"
        >
          <Link href="/" className="tracking-[-1px] hover:underline">
            Home
          </Link>
          <Image
            className="-mb-1"
            alt=""
            aria-hidden="true"
            src={arrow}
            width={10}
            height={10}
          />
          <Link
            href={hubPath}
            className="tracking-[-1px] hover:underline"
          >
            {hubLabel}
          </Link>
        </nav>

        <h1 className="mb-2 max-w-5xl text-3xl capitalize tracking-[-1px] font-medium text-white md:text-5xl lg:text-[60px]">
          {title}
        </h1>

        {tagline && (
          <p className="mt-3 max-w-3xl text-lg md:text-2xl font-medium text-gray-200">
            {tagline}
          </p>
        )}

        <p className="mb-8 mt-5 max-w-4xl text-sm md:text-base lg:text-lg text-white leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/quote"
            className="rounded-full px-6 py-3 md:px-[24px] md:py-[16px] text-lg font-semibold bg-[#FF006A] text-white hover:bg-[#e00060] transition-colors"
          >
            Get An Instant Quote
          </Link>
          <a
            href="tel:+447745865352"
            className="rounded-full border-2 border-white px-6 py-3 md:px-[24px] md:py-[16px] text-lg font-semibold bg-white text-[#292929] hover:bg-gray-100 transition-colors"
          >
            Call +44 7745 865352
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationDynamicBanner;

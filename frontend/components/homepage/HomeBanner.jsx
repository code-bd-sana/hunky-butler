"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { AGGREGATE_RATING } from "@/lib/reviewProfiles";

export default function HomeBanner() {
  // The hero video is 7.2 MB and was downloading on phones too, dominating the
  // mobile payload (5.3 MB, LCP 6.2 s). A CSS `hidden md:block` is NOT enough:
  // browsers still fetch a display:none video's body (verified). So the <video>
  // is only MOUNTED on desktop, after hydration, once matchMedia confirms the
  // viewport. Phones render the poster only and never request the mp4.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className='relative h-[100vh] w-full overflow-hidden'>
      {/* The optimised poster is the hero image on every device and paints
          immediately (priority = LCP element). On desktop the video mounts on
          top of it once hydrated. */}
      <Image
        src='/videos/hero-poster.jpg'
        alt='Buff butlers and hen party entertainment across the UK'
        fill
        priority
        sizes='100vw'
        className='object-cover'
      />

      {/* Desktop only, mounted after hydration, so phones never request the
          7.2 MB mp4. */}
      {isDesktop && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='metadata'
          poster='/videos/hero-poster.jpg'
          className='absolute inset-0 h-full w-full object-cover'
          title='Buff Butlers Hen Party Entertainment UK'
          aria-label='Buff butlers and hen party entertainment across the UK'>
          <source src='/videos/HeroBannerVid.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Dark Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80'></div>

      {/* Content */}
      <div className='relative z-10 flex h-full flex-col justify-center lg:justify-end px-4 mt-36 md:mt-40 lg:mt-10 pb-32 text-white md:px-8 lg:px-20 md:pt-0'>
        <div className='flex w-full flex-col items-center md:items-start lg:flex-row lg:justify-between lg:items-center gap-10 mx-auto'>
          {/* Left Side: Heading + Buttons */}
          <div className='max-w-6xl md:text-left'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-abhaya-libre'>
              Buff Butlers & Hen Party <br className='hidden sm:block' />
              Entertainment Across the UK
            </h1>

            <p className='mt-4 text-base md:text-xl text-[#F6F4F5] capitalize lg:w-11/12'>
              Looking for the ultimate hen party entertainment? You’ve come to
              the right place. Hunky Butler Service is the UK’s most popular
              buff butler and hen party entertainment company. But the fun
              doesn’t stop there, we also offer topless waiters, life drawing
              classes, cocktail masterclasses, and much more.
            </p>
            <p className='hidden md:flex mt-3 md:mt-4 text-base md:text-xl text-[#F6F4F5] text-justify capitalize lg:w-11/12'>
              Our cheeky butlers aren’t just for show, they’re professional,
              friendly, and know how to keep your party flowing with games,
              drinks, and laughter. Whether you’re celebrating in Liverpool,
              Manchester, London, Birmingham, Leeds, or beyond, our team is
              ready to make your night unforgettable.
            </p>

            <div className='mt-10 md:mt-12 flex flex-row md:flex-wrap justify-center md:justify-start gap-3'>
              <Link href='/quote'>
                <button className='cursor-pointer rounded-full bg-[#FF006A] px-5 py-3 md:px-6 md:py-3 text-sm md:text-lg font-medium shadow-md transition'>
                  Get An Instant Quote
                </button>
              </Link>
              <Link href='/party-entertainment-services'>
                <button className='cursor-pointer rounded-full bg-white px-5 py-3 md:px-6 md:py-3 text-sm md:text-lg font-medium text-black shadow-md transition'>
                  Explore Services
                </button>
              </Link>
            </div>

            {/* Rating (mobile & mid) */}
            <div className='mt-4 md:mt-6 flex flex-col items-center md:items-start text-center md:text-left lg:hidden'>
              {/* Was a bare "5.00" that matched no source and contradicted the
                  4.9 marked up in schema. Google requires an aggregateRating to
                  reflect a rating visible on the page, so both now read from
                  lib/reviewProfiles.js. */}
              <div className='flex items-center gap-2'>
                <span className='text-4xl md:text-5xl font-semibold'>
                  {AGGREGATE_RATING.ratingValue}
                </span>
                <div className='flex text-yellow-400'>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar size={18} key={i} />
                    ))}
                </div>
              </div>
              <p className='mt-1 text-sm text-[#F6F4F5]'>
                from {AGGREGATE_RATING.reviewCount} reviews on{" "}
                {AGGREGATE_RATING.source}
              </p>
            </div>
          </div>

          {/* Rating (desktop right side) */}
          <div className='hidden lg:flex flex-col items-end text-right'>
            <div className='flex items-center gap-2'>
              <span className='text-4xl md:text-5xl font-semibold'>
                {AGGREGATE_RATING.ratingValue}
              </span>
              <div className='flex gap-1 text-yellow-400'>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar size={18} key={i} />
                  ))}
              </div>
            </div>
            <p className='mt-1 text-sm text-[#F6F4F5]'>
              from {AGGREGATE_RATING.reviewCount} reviews on{" "}
              {AGGREGATE_RATING.source}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

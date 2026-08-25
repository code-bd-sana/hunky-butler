"use client";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import nation1 from "../../public/Nationwide/nation1.png";

import path from "path";
import SubTitle from "../shared/typography/SubTitle";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import { useEffect, useState } from "react";
import { base_url } from "@/utils/utils";
import { useGetLocationsQuery } from "@/features/location";
import Link from "next/link";
import locations from "@/app/locations/locations.json";

/**
 * The locations API returns bare city slugs ("dudley") while the real pages are
 * generated from locations.json, which stores them prefixed
 * ("buff-butlers-dudley"). Resolving here means a card is only ever rendered
 * when a page exists for it, so this grid can never link to a 404.
 */
const canonicalSlug = (slug) => {
  if (!slug) return null;
  const match = locations.find(
    (loc) => loc.slug === slug || loc.slug === `buff-butlers-${slug}`
  );
  return match ? match.slug : null;
};
const Nationwide = ({ name, serviceSlug }) => {
  const { data: nations = [], isLoading, isError } = useGetLocationsQuery();
  // const [nations, setNations] = useState([]);

  // useEffect(() => {
  //   // Example: fetch from API or JSON file
  //   const fetchNations = async () => {
  //     try {
  //       const res = await fetch(`${base_url}/locations`); // JSON file in public folder
  //       const data = await res.json();
  //       setNations(data);
  //     } catch (err) {
  //       console.error("Error fetching nations:", err);
  //     }
  //   };

  //   fetchNations();
  // }, []);
  return (
    <section className='max-w-7xl mx-auto px-4 py-14 text-center'>
      <SecondaryTitle text1={`${name ? name : "Loading"} Locations We Cover`} />
      <SubTitle title='Life Drawing Available Nationwide' />
      <p className='max-w-3xl mx-auto text-gray-600 mb-12 leading-relaxed'>
        Looking for buff butlers in your area? We cover the whole of the UK,
        from Liverpool and Manchester to London, Birmingham, Leeds, Newcastle,
        and beyond. Wherever your event is, our butlers are ready to bring the
        fun.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {nations?.map((nation, i) => {
          // Was /locations/{slug}, the weaker duplicate route: client-rendered,
          // no generateMetadata, absent from the sitemap. That route is gone and
          // its URLs now 301 here, so link straight at the canonical page.
          const slug = canonicalSlug(nation?.slug);
          if (!slug) return null;
          return (
          <Link
            key={i}
            href={`/${slug}`}>
            <div
              key={i}
              className='bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 border border-gray-100 hover:border-pink-500'>
              <div className='overflow-hidden rounded-xl'>
                <h1>{nation?.title}</h1>
                <Image
                  src={nation?.image}
                  alt={nation?.name}
                  width={400}
                  height={250}
                  className='rounded-xl mb-4 object-cover w-full h-[220px] hover:scale-105 transition-transform duration-300'
                />
              </div>
              <div className='flex justify-between items-center text-pink-600 font-semibold mt-2 capitalize'>
                <p>
                  {serviceSlug.split("-").join(" ")}{" "}
                  <span> {nation?.city}</span>
                </p>
                <FaArrowRight />
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Nationwide;

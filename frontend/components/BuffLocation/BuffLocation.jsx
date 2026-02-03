"use client";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import nation1 from "../../public/service/nation.jpeg";
import SubTitle from "../shared/typography/SubTitle";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import { base_url } from "@/utils/utils";
import { useEffect, useState } from "react";
const BuffLocation = ({ name }) => {
  const [nations, setNations] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base_url}/locations`)
      .then((res) => res.json())
      .then((data) => setNations(data));
  }, []);

  return (
    <section className='max-w-7xl mx-auto px-4 py-12 text-center'>
      <SecondaryTitle text1={`${name ? name : "Loading"} Locations We Cover`} />
      <SubTitle title='Life Drawing Available Nationwide' />
      <p className='max-w-3xl mx-auto text-gray-600 mb-12 leading-relaxed'>
        We provide professional stripper hire across the UK. Popular locations
        include:
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {nations?.slice(0, 6).map((nation, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 border border-gray-100 hover:border-pink-500'>
            <div className='overflow-hidden rounded-xl'>
              <h1>{nation?.title}</h1>
              <Image
                src={nation1}
                alt={nation?.name || "Nation Image"}
                width={400}
                height={250}
                className='rounded-xl mb-4 object-cover w-full h-[220px] hover:scale-105 transition-transform duration-300'
              />
            </div>
            <div className='flex justify-between items-center text-pink-600 font-semibold mt-2'>
              <span>{nation.name}</span>
              <FaArrowRight />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuffLocation;

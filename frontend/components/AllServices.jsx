"use client";
import React from "react";
import Image from "next/image";
import icon from "@/public/icons/arowright.png";
import butlerImg from "@/public/service/buff.jpg";
import strippersImg from "@/public/service/Strippers.jpg";
import butlerImg2 from "@/public/ImageGalary/pic1.jpeg";
import butlerImg3 from "@/public/ImageGalary/pic5.jpeg";
import butlerImg4 from "@/public/ImageGalary/pic3.jpeg";
import background from "@/public/images/services/bg4.png";
import MainTitle from "./shared/typography/MainTitle";
import Link from "next/link";
import { useGetServicesQuery } from "@/features/services/servicesApi";
import { RiArrowDropRightLine } from "react-icons/ri";

export default function ALLServices() {
  const { data: services = [], isLoading, error } = useGetServicesQuery();

  console.log(services);

  return (
    <section className="pb-12 md:pb-24">
      <div style={{ backgroundImage: `url(${background.src})` }}>
        <div className="max-w-7xl mx-auto mt-10 pt-10">
          <h1 className="text-center text-[#141414] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug  max-w-7xl mx-auto  ">
            What Party Entertainment Services Do We Offer?
          </h1>
          <h1 className="text-center font-medium pt-6 text-base md:text-lg  lg:text-xl">
            Planning a hen party, birthday, or ladies night? At Hunky Butler
            Service, we’ve got you covered with a choice of entertainment
            packages to suit every group. Whether you’re after cheeky charm,
            creative fun, or all-out excitement, our Party Entertainment
            services are designed to make your celebration unforgettable. <br />
            <span>
              Explore our options below and click through to learn more about
              each service.
            </span>
          </h1>
        </div>

        <div className="max-w-7xl mx-auto pt-30 px-4 md:px-6 space-y-20">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              } md:items-center gap-10 md:gap-16`}
            >
              {/* Text */}
              <div className="flex-1">
                <MainTitle text={service.name} />
                <p className="text-[#3D3D3D] py-4 leading-[1.4] capitalize tracking-[-0.01em] text-lg">
                  {service.description} <br />
                  <Link href={`/party-entertainment-services/${service.slug}`}>
                    <span class="flex items-center text-[#FF006A] hover:underline">
                      Learn More <RiArrowDropRightLine className="text-3xl" />
                    </span>
                  </Link>
                </p>

                {service.included?.length > 0 && (
                  <>
                    <p className="font-semibold text-xl mt-8 md:mt-16 capitalize">
                      What included in this service
                    </p>
                    <ul className="mt-6 space-y-4">
                      {service.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <Image
                            src={icon}
                            alt="icon"
                            className="w-5 h-5 mt-1 flex-shrink-0"
                          />
                          <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-8">
                  <Link href={`/party-entertainment-services/${service.slug}`}>
                    <button className="bg-[#ff1673] hover:bg-[#e41468] text-white font-semibold rounded-full px-6 py-3 text-base shadow-[0_6px_20px_rgba(255,22,115,0.2)] transition-all">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative w-full aspect-[581/632] sm:aspect-[581/450] md:aspect-[581/632] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                  <Image
                    src={service?.banner || "/default.jpg"}
                    alt={service?.name}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

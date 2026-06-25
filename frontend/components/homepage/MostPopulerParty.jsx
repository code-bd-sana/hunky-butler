"use client";
import image4 from "@/public/stripper.png";
import image2 from "@/public/images/home/party1.png";
import image3 from "@/public/images/home/party2.png";
import image1 from "@/public/images/home/party4.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SecondaryTitle from "../shared/typography/SecondaryTitle";

export default function MostPopulerParty() {
  const partyData = [
    {
      image: image1,
      heading: "Buff Butlers",
      title:
        "Hire charming, professional buff butlers to host party games, serve drinks, and keep your guests entertained. Popular for hen parties, birthdays, and girls’ nights across the UK, from Liverpool to London, our butlers know how to strike the perfect balance between cheeky fun and classy entertainment.",
      alt: "Buff butler hosting hen party games",
      imageTitle: "Hire Buff Butlers UK",
      link: "/party-entertainment-services/buff-butlers",
    },
    {
      image: image2,
      heading: "Life Drawing",
      title:
        "Add a creative twist to your hen do or birthday celebration with a life drawing class led by one of our handsome male models. Our classes combine tasteful fun with plenty of laughs — and yes, your butler can stick around afterwards to pour drinks, play party games, and pose for photos.",
      alt: "Life drawing class with buff butler model",
      imageTitle: "Life Drawing Hen Party Class",
      link: "/party-entertainment-services/life-drawing",
    },
    {
      image: image3,
      heading: "Cocktail Masterclasses",
      title:
        "Shake, stir, and sip your way through an interactive cocktail masterclass hosted by skilled mixologists and buff butlers. Perfect for groups that want hands-on fun, our classes are available in Manchester, Liverpool, Birmingham, and London — and come with plenty of cheeky surprises along the way.",
      alt: "Cocktail masterclass hosted by topless waiter",
      imageTitle: "Cocktail Masterclass Hen Party",
      link: "/party-entertainment-services/cocktail-masterclasses",
    },
    {
      image: image4,
      heading: "Male Strippers",
      title:
        "Turn up the heat with our professional male strippers. From cheeky strip shows to themed performances, we tailor the entertainment to your group’s vibe. Whether you want playful fun or a full stage-style performance, our strippers know how to keep the atmosphere electric.",
      alt: "Male stripper performance at hen party",
      imageTitle: "Male Strippers UK",
      link: "/party-entertainment-services/strippers",
    },
  ];

  const router = useRouter();

  return (
    <div className='max-w-7xl overflow-hidden mx-auto px-4 md:px-6 py-12'>
      <div className='text-center mb-12'>
        <SecondaryTitle text1={"Our Most Popular Party Entertainment"} />
        <div className='max-w-2xl mx-auto mt-4'>
          {/* <SubTitle
            text={
              "From unforgettable buff butlers in Liverpool to fun and creative life drawing classes in Manchester, our entertainment packages are designed to bring energy, laughter, and a touch of cheekiness to every event. With nationwide coverage, it’s easy to book the perfect experience no matter where you’re celebrating.."
            }
          /> */}
          <p className='text-justify md:text-center capitalize'>
            From unforgettable buff butlers in Liverpool to fun and creative
            life drawing classes in Manchester, our entertainment packages are
            designed to bring energy, laughter, and a touch of cheekiness to
            every event. With nationwide coverage, it’s easy to book the perfect
            experience no matter where you’re celebrating.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {partyData.map((data, idx) => (
          <div
            onClick={() => {
              router.push(data.link);
            }}
            key={idx}
            className='relative cursor-pointer group overflow-hidden rounded-xl'>
            <div className='relative h-80 md:h-96'>
              <Image
                src={data.image}
                alt={data.alt}
                title={data.imageTitle}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />

              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 lg:via-transparent lg:to-transparent'></div>
            </div>

            <div className='absolute left-0 bottom-0 w-full p-2 md:p-6 text-white'>
              <h4 className='text-2xl md:text-3xl font-medium mb-1 md:mb-2'>
                {data.heading}
              </h4>
              <p className='text-xs md:text-base opacity-90 leading-relaxed'>
                {data.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

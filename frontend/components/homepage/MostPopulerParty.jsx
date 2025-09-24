import React from 'react';
import MainTitle from '../shared/typography/MainTitle';
import SubTitle from '../shared/typography/SubTitle';
import image1 from '@/public/images/home/party4.png';
import image2 from '@/public/images/home/party1.png';
import image3 from '@/public/images/home/party2.png';
import image4 from '@/public/images/home/party3.png';
import Image from 'next/image';
import SecondaryTitle from '../shared/typography/SecondaryTitle';

export default function MostPopulerParty() {
  const partyData = [
    {
      image: image1,
      heading: "Buff Butlers",
      title: "Hire charming, professional buff butlers to host party games, serve drinks, and keep your guests entertained. Popular for hen parties, birthdays, and girls’ nights across the UK, from Liverpool to London, our butlers know how to strike the perfect balance between cheeky fun and classy entertainment."
    },
    {
      image: image2,
      heading: "Life Drawing",
      title: "Add a creative twist to your hen do or birthday celebration with a life drawing class led by one of our handsome male models. Our classes combine tasteful fun with plenty of laughs — and yes, your butler can stick around afterwards to pour drinks, play party games, and pose for photos."
    },
    {
      image: image3,
      heading: "Cocktail Masterclasses",
      title: "Shake, stir, and sip your way through an interactive cocktail masterclass hosted by skilled mixologists and buff butlers. Perfect for groups that want hands-on fun, our classes are available in Manchester, Liverpool, Birmingham, and London — and come with plenty of cheeky surprises along the way."
    },
    {
      image: image4,
      heading: "Male Strippers",
      title: "Turn up the heat with our professional male strippers. From cheeky strip shows to themed performances, we tailor the entertainment to your group’s vibe. Whether you want playful fun or a full stage-style performance, our strippers know how to keep the atmosphere electric."
    }
  ];

  return (
    <div className='max-w-7xl overflow-hidden mx-auto px-4 md:px-6 py-12'>
      <div className='text-center mb-12'>
        <SecondaryTitle
          text1={"Our Most Popular Party Services"}
        
        />
        <div className='max-w-2xl mx-auto mt-4'>
          <SubTitle text={"From unforgettable buff butlers in Liverpool to fun and creative life drawing classes in Manchester, our entertainment packages are designed to bring energy, laughter, and a touch of cheekiness to every event. With nationwide coverage, it’s easy to book the perfect experience no matter where you’re celebrating.."} />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {partyData.map((data, idx) => (
          <div key={idx} className='relative group overflow-hidden rounded-xl'>
            <div className='relative h-80 md:h-96'>
              <Image 
                src={data.image} 
                alt={data.heading}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />
     
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent'></div>
            </div>

  
            <div className='absolute left-0 bottom-0 w-full p-5 text-white'>
              <h4 className='text-2xl md:text-3xl font-bold mb-2'>{data.heading}</h4>
              <p className='text-sm md:text-base opacity-90 leading-relaxed'>{data.title}</p>

     
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

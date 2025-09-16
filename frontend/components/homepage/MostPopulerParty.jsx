import React from 'react'
import MainTitle from '../shared/typography/MainTitle'
import SubTitle from '../shared/typography/SubTitle'
import image1 from '@/public/images/home/party4.png'
import image2 from '@/public/images/home/party1.png'
import image3 from '@/public/images/home/party2.png'
import image4 from '@/public/images/home/party3.png'
import Image from 'next/image'
import SecondaryTitle from '../shared/typography/SecondaryTitle'

export default function MostPopulerParty() {


    const partyData = [

        {
            image: image1,
            heading: "Buff Butlers",
            title: "Hire charming, professional Buff Butlers to host party games, serve drinks, and keep your hen party alive."
        },
        {
            image: image2,
            heading: "Life Drawing",
            title: "Add a cheeky twist to your celebration with a fun, tasteful life drawing class led by our handsome models."
        },
        {
            image: image3,
            heading: "Cocktail Masterclasses",
            title: "Shake, stir, and sip with an interactive cocktail-making session hosted by skilled mixologists and Buff Butlers."
        },
        {
            image: image4,
            heading: "Male Strippers",
            title: "Turn up the heat with our professional male strippers – from cheeky strip shows to themed entertainment, we tailor the performance to your group."
        }
    ]

    return (
        <div className='max-w-7xl mx-auto'>

            <div className='text-center mt-16 '>
                <SecondaryTitle
                    text1={"Our Valuable"}
                    text2={"Best Service"}
                />
                <div className='max-w-2xl px-4 md:px-0 mx-auto'>
                    <SubTitle text={"From Buff Butlers in London to Life Drawing Classes in Manchester, our entertainment packages are designed to bring fun, energy, and laughter to every event."} />
                </div>
            </div>


            <section className='grid md:grid-cols-2 gap-8 mt-16 px-4 md:px-0'>

                {
                    partyData.map((data, idx) => (

                        <div key={idx} className='relative'>

                            <div>
                                <Image src={data.image} />
                            </div>

                            {/* content */}

                            <div className='px-6 absolute left-0 bottom-6 text-[#FFFFFF]'>


                                <h4 className=' text-3xl leading-snug  font-medium '>{data.heading}</h4>
                                <p className='text-lg  leading-[1.4] tracking-[-0.01em]'>{data.title}</p>
                            </div>

                        </div>
                    ))
                }


            </section>
        </div>
    )
}

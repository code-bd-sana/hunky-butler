'use client'
import React, { useState } from 'react'
import image from "@/public/quote/bg.png";
import { IoLocationSharp } from "react-icons/io5";
import next from 'next';
import { useParams, usePathname } from 'next/navigation';
import { useBookingMutation } from '@/features/booking';
import toast, { Toaster } from 'react-hot-toast';


export default function SecondStep() {


    const [firstStep, setFirstStep ] = useState({});
    const [secondStep, setSecondStep ] = useState({})
    const [nextStep, setNextStep] = useState("firststep")
    const [booking, {isLoading, error}] = useBookingMutation();
    
const firstStepHandaler = async(e)=>{

    try {
  e.preventDefault();
  const firstName = e.target.firstname.value;
  const lastName = e.target.lastName.value;
  const email = e.target.email.value;
  const phone = e.target.phone.value;
  const postCode = e.target.postCode.value;
  const location = e.target.location.value;

  const firstStep = {
    firstName,
    lastName,
    email,
   phone,
    postCode : Number(postCode),
    location
  }
console.log(firstStep)
setFirstStep(firstStep);
setNextStep("secondstep")




    
        
    } catch (error) {
        console.log(error)
    }
}

const params = useParams();
console.log(params, "this is your params")

const secondStepHandaler = async(e)=>{
    try {
            e.preventDefault();

            const dateOfEvent = e.target.dateOfEvent.value;
            const numberOfStaff = e.target.numberOfStaff.value;
            const startTime = e.target.startTime.value;
            const durationHours = e.target.durationHours.value;
            const durationMinutes = e.target.durationMinutes.value;

            const secondStep = {
                dateOfEvent,
                numberOfStaff,
                startTime,
                durationHours,
                durationMinutes
            }

            console.log(secondStep, "hi")
            setSecondStep(secondStep);
            setNextStep("thirdstep")






        
    } catch (error) {
        console.log(error)
    }
}


const bookNowHandaler = async()=>{
    try {


        const finalData = {...firstStep, ...secondStep};
        finalData.slug = params.category
        finalData.serviceName = params.category
        finalData.price = secondStep.durationHours * secondStep.numberOfStaff
        console.log(finalData, "Final Data")

        const data = await booking(finalData).unwrap();
        console.log(data, "saved  ki hoise baca")

          toast.success('Booking Successfull')


        
    } catch (error) {
        console.log(error)
        toast.error(error?.message || "Something went wrong!")
    }
}


    
  return (


  
  <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
    >


<Toaster/>
      <div className="relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full">
        <h4 className="text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-12">
    { nextStep === "firststep" ?  "Let’s get the party started" : nextStep === "secondstep" ? "Your event information" : "Your Hunky Butler Service Quote & Party Details" }
        </h4>

        {/* Responsive grid for equal cards */}
     { nextStep === "firststep" &&  <section className="   w-full max-w-6xl px-6">
            <div className='   rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F]  backdrop-blur-md backdrop-saturate-15   border border-white/20 shadow-lg  '>


            <form onSubmit={firstStepHandaler} className='p-8'>


             <section className='md:flex items-center gap-4'>


                   <div className='text-left w-full'>

                    <label htmlFor='firstname' className='text-white text-left block'>First Name *</label>
                    <input required type="text"  name="firstname" id="firstname" placeholder='Name' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>



                </div>
                <div className='text-left w-full mt-6 md:mt-0'>

                    <label htmlFor='lastName' className='text-white text-left block'>Last Name *</label>
                    <input required type="text" name="lastName" id="lastName" placeholder='Name' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>



                </div>

             </section>
             <section className='md:flex items-center gap-4 mt-8'>


                   <div className='text-left w-full'>

                    <label htmlFor='email' className='text-white text-left block'>E-Mail *</label>
                    <input required type="email" name="email" id="email" placeholder='Email' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>



                </div>
                <div className='text-left w-full mt-6 md:mt-0'>

                    <label htmlFor='phone' className='text-white text-left block'>phone *</label>
                    <input required type="text" name="phone" id="phone" placeholder='Phone' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>



                </div>

             </section>
             <section className='md:flex items-center gap-4 mt-8'>


                   <div className='text-left w-full'>

                    <label htmlFor='postCode'  className='text-white text-left block'>Post Code *</label>
                    <input required type="number" name="postCode" id="postCode" placeholder='Enter Post Code' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>



                </div>
                <div className='text-left w-full mt-6 md:mt-0'>

                    <label htmlFor='location' className='text-white text-left block'>Location *</label>
                    <input required type="text" name="location" id="location" placeholder='Add Location' className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white placeholder:ml-28 border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'/>





                </div>

               

             </section>




   <button
              style={{ color: "rgba(255,0,106,1)" }}
              className="px-[16px] py-[8px] w-[164px] cursor-pointer mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            >
              Next
            </button>
            </form>
               
            </div>
    
        </section>}




  { nextStep === 'secondstep' && <section className="mt-28 w-full max-w-6xl px-6">
  <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F]  backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
    <form   onSubmit={secondStepHandaler} className="p-8">
      {/* Date + Staff */}
      <section className="md:flex items-center gap-4">
        {/* Date */}
        <div className="text-left w-full">
          <label htmlFor='date' className="text-white text-left block">Date of event *</label>
          <input
            required
            type="date"
            id='date'
            name="dateOfEvent"
            className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
          />
          
        </div>
        {/* Staff */}
        <div className="text-left mt-6 md:mt-0 w-full">
          <label className="text-white text-left block">Number of staff *</label>
          <input
            required
            type="number"
            name="numberOfStaff"
            placeholder="Enter number"
            className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
          />
        </div>
      </section>

      {/* Time + Duration */}
      <section className="md:flex items-center gap-4 mt-8">
        {/* Start Time */}
        <div className="text-left w-full">
          <label  htmlFor='time' className="text-white text-left block">Start Time *</label>
          <input
            required
            type="time"
            id='time'
            name="startTime"
            className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
          />
        </div>
        {/* Duration */}
        <div className="text-left w-full mt-6 md:mt-0">
          <label className="text-white text-left block">Duration*</label>
          <div className="flex items-center gap-4">
            <input
              required
              type="number"
              min="0"
              name="durationHours"
              placeholder="Hours"
              className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
            />
            <input
              required
              type="number"
              min="0"
              max="59"
              name="durationMinutes"
              placeholder="Minutes"
              className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
            />
          </div>
        </div>
      </section>

      {/* Button */}
      <button
      type='submit'
        style={{ color: "rgba(255,0,106,1)" }}
        className="px-[16px] py-[8px] w-[164px] mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
      >
        Next
      </button>
    </form>
  </div>
</section>
}


  { nextStep === 'thirdstep' && <section className="mt-8 w-full max-w-xl px-6">
  <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F]  backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">

<section className='text-white p-12'>

      <h6>Your total price</h6>
      <h6 className='text-5xl font-bold py-6'> $ {secondStep.durationHours * secondStep.numberOfStaff  }</h6>

      <div className='border-1  border-white'>

      </div>


      <div className='py-4 space-y-4'>
        <h4 className='font-medium text-sm md:text-xl text-left'><span className='mr-4'>Event start on    </span>  <span className='text-right ml-[10px] '>  : <span className='ml-4'>{secondStep.dateOfEvent} At {secondStep.startTime }</span> </span></h4>
        <h4 className='font-medium  text-sm md:text-xl text-left'><span className='mr-4'>Event Duration </span>  <span className='-ml-[1px]'>  : <span className='ml-4'>{secondStep.durationHours} Hours</span> </span></h4>
        <h4 className='font-medium text-sm md:text-xl text-left'><span className='md:mr-4'> Stuff  </span>  <span className=' ml-[73px] md:ml-[82px]'>  : <span className='ml-4'>{secondStep.numberOfStaff} Butlers </span></span></h4>
        <h4 className='font-medium text-sm md:text-xl  text-left'> <span className='md:mr-4'>Quote ID </span>  <span className='ml-12'> :  <span className='ml-4'> {params?.category}</span>  </span></h4>


            <button
            onClick={bookNowHandaler}
              style={{ color: "rgba(255,0,106,1)" }}
              className="px-[16px] py-[8px] w-[164px] mt-12 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            >
              {
                isLoading ? "Loading..." : "Book  Now"
              }
            </button>

      </div>
</section>
  
  </div>
</section>
}





      </div>
    </div>
  )
}

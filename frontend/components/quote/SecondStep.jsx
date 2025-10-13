'use client'
import React, { useState } from 'react'
import image from "@/public/quote/bg.png";
import { IoLocationSharp } from "react-icons/io5";
import { useParams } from 'next/navigation';
import { useBookingMutation } from '@/features/booking';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { base_url } from '@/utils/utils';

const stripePromise = loadStripe('pk_test_51RWA5gFVdJBgYBDxRIUNli1dDlicyaiOTCEECLujXMHTyVEujYQJ2pZ9DFlUeNPpaKzy7cPYJ1QlA6cUe7A9m6Eg00nP3ZNUFM');

// Step Indicator Component (keep as is)
const StepIndicator = ({ currentStep, bookingSuccess }) => {
  const steps = [
    { id: "selectservice", number: 1, label: "Select Service" },
    { id: "firststep", number: 2, label: "Your Information" },
    { id: "secondstep", number: 3, label: "Event Information" },
    { id: "thirdstep", number: 4, label: "Confirmation" }
  ];

  const getStepIndex = (step) => {
    return steps.findIndex(s => s.id === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex justify-center items-center space-x-4 mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                step.id === currentStep && !bookingSuccess
                  ? "bg-[#FF3388] border-[#FF3388] text-white"
                  : index < currentIndex || bookingSuccess
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-400 text-gray-400"
              } font-semibold transition-all duration-300`}
            >
              {(index < currentIndex || bookingSuccess) ? "✓" : step.number}
            </div>
            <span
              className={`text-sm mt-2 ${
                step.id === currentStep && !bookingSuccess 
                  ? "text-[#FF3388]" : 
                (index < currentIndex || bookingSuccess)
                  ? "text-green-500" 
                  : "text-gray-400"
              } font-medium hidden sm:block`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-1 ${
                (index < currentIndex || bookingSuccess) ? "bg-green-500" : "bg-gray-400"
              } transition-all duration-300`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function SecondStep() {
  const [firstStep, setFirstStep] = useState({});
  const [secondStep, setSecondStep] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [nextStep, setNextStep] = useState("firststep");
  const [booking, { isLoading, error }] = useBookingMutation();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pay_now'); // 'pay_now' or 'pay_later'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const params = useParams();
  const { data: session } = useSession();

  const firstStepHandler = async (e) => {
    try {
      e.preventDefault();
      const form = e.target;
      const firstName = form.firstname.value;
      const lastName = form.lastName.value;
      const email = form.email.value;
      const phone = form.phone.value;
      const postCode = form.postCode.value;
      const location = form.location.value;

      const firstStepData = {
        firstName,
        lastName,
        email,
        phone,
        postCode: Number(postCode),
        location
      };

      setFirstStep(firstStepData);
      setNextStep("secondstep");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save personal information");
    }
  };

  const secondStepHandler = async (e) => {
    try {
      e.preventDefault();
      const form = e.target;
      const dateOfEvent = form.dateOfEvent.value;
      const numberOfStaff = form.numberOfStaff.value;
      const startTime = form.startTime.value;
      const durationHours = form.durationHours.value;
      const durationMinutes = form.durationMinutes.value;

      const secondStepData = {
        dateOfEvent,
        numberOfStaff: Number(numberOfStaff),
        startTime,
        durationHours: Number(durationHours),
        durationMinutes: Number(durationMinutes)
      };

      setSecondStep(secondStepData);
      setNextStep("thirdstep");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save event information");
    }
  };

const handlePayment = async () => {
  try {
    setIsProcessingPayment(true);
    
    const finalData = {
      ...firstStep,
      ...secondStep,
      slug: params.category,
      serviceName: params.category,
      price: secondStep.durationHours * secondStep.numberOfStaff,
      paymentMethod,
      paid: paymentMethod === 'pay_now' ? 'pending' : 'unpaid'
    };

    if (paymentMethod === 'pay_now') {
      // Create Stripe checkout session
      const response = await fetch(`${base_url}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData: finalData,
          successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/booking/cancel`,
        }),
      });

      const { sessionId, success, error, checkoutUrl } = await response.json();
      
      if (!success) {
        throw new Error(error || 'Failed to create checkout session');
      }
      
      // Method 2: Use the checkout URL directly from backend
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        // Method 3: Construct the URL manually
        window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
      }
      
    } else {
      // Pay later - create booking directly
      await bookNowHandler(finalData);
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.message || "Payment processing failed");
  } finally {
    setIsProcessingPayment(false);
  }
};

  const bookNowHandler = async (finalData = null) => {
    try {
      const dataToSend = finalData || {
        ...firstStep,
        ...secondStep,
        slug: params.category,
        serviceName: params.category,
        price: secondStep.durationHours * secondStep.numberOfStaff,
        paymentMethod,
        paid: paymentMethod === 'pay_now' ? 'pending' : 'unpaid'
      };

      const data = await booking(dataToSend).unwrap();
      
      setBookingData(dataToSend);
      setBookingSuccess(true);
      
      toast.success(paymentMethod === 'pay_now' 
        ? 'Redirecting to payment...' 
        : 'Booking Successful!'
      );
      
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  const getStepTitle = () => {
    switch (nextStep) {
      case "firststep":
        return "Let's get the party started";
      case "secondstep":
        return "Your event information";
      case "thirdstep":
        return bookingSuccess ? "Booking Confirmed!" : "Complete Your Booking";
      default:
        return "Let's get the party started";
    }
  };

  const totalPrice = secondStep.durationHours * secondStep.numberOfStaff;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
    >
      <Toaster />
      
      <div className="relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full">
        <StepIndicator currentStep={nextStep} bookingSuccess={bookingSuccess} />
        
        <h4 className="text-3xl md:text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-8 md:mb-12">
          {getStepTitle()}
        </h4>

        {/* Step 1: Personal Information (keep as is) */}
        {nextStep === "firststep" && (
          <section className="w-full max-w-4xl px-6">
            <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
              <form onSubmit={firstStepHandler} className="p-6 md:p-8">
                <section className="md:flex items-center gap-4">
                  <div className="text-left w-full">
                    <label htmlFor="firstname" className="text-white text-left block">First Name *</label>
                    <input
                      required
                      type="text"
                      name="firstname"
                      id="firstname"
                      placeholder="First Name"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                  <div className="text-left w-full mt-6 md:mt-0">
                    <label htmlFor="lastName" className="text-white text-left block">Last Name *</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Last Name"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                </section>

                <section className="md:flex items-center gap-4 mt-6 md:mt-8">
                  <div className="text-left w-full">
                    <label htmlFor="email" className="text-white text-left block">E-Mail *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={session?.user?.email}
                      placeholder="Email"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                  <div className="text-left w-full mt-6 md:mt-0">
                    <label htmlFor="phone" className="text-white text-left block">Phone *</label>
                    <input
                      required
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Phone"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                </section>

                <section className="md:flex items-center gap-4 mt-6 md:mt-8">
                  <div className="text-left w-full">
                    <label htmlFor="postCode" className="text-white text-left block">Post Code *</label>
                    <input
                      required
                      type="number"
                      name="postCode"
                      id="postCode"
                      placeholder="Enter Post Code"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                  <div className="text-left w-full mt-6 md:mt-0 relative">
                    <label htmlFor="location" className="text-white text-left block">Location *</label>
                    <input
                      required
                      type="text"
                      name="location"
                      id="location"
                      placeholder="Add Location"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669] pl-12"
                    />
                    <IoLocationSharp className="absolute left-4 bottom-4 text-white text-xl" />
                  </div>
                </section>

                <button
                  type="submit"
                  style={{ color: "rgba(255,0,106,1)" }}
                  className="px-[16px] py-[8px] w-[164px] cursor-pointer mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
                >
                  Next
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Step 2: Event Information (keep as is) */}
        {nextStep === "secondstep" && (
          <section className="mt-8 md:mt-28 w-full max-w-4xl px-6">
            <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
              <form onSubmit={secondStepHandler} className="p-6 md:p-8">
                <section className="md:flex items-center gap-4">
                  <div className="text-left w-full">
                    <label htmlFor="dateOfEvent" className="text-white text-left block">Date of event *</label>
                    <input
                      required
                      type="date"
                      id="dateOfEvent"
                      name="dateOfEvent"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                  <div className="text-left mt-6 md:mt-0 w-full">
                    <label className="text-white text-left block">Number of staff *</label>
                    <input
                      required
                      type="number"
                      name="numberOfStaff"
                      placeholder="Enter number"
                      min="1"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                </section>

                <section className="md:flex items-center gap-4 mt-6 md:mt-8">
                  <div className="text-left w-full">
                    <label htmlFor="startTime" className="text-white text-left block">Start Time *</label>
                    <input
                      required
                      type="time"
                      id="startTime"
                      name="startTime"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                  </div>
                  <div className="text-left w-full mt-6 md:mt-0">
                    <label className="text-white text-left block">Duration *</label>
                    <div className="flex items-center gap-2 md:gap-4">
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

                <button
                  type="submit"
                  style={{ color: "rgba(255,0,106,1)" }}
                  className="px-[16px] py-[8px] w-[164px] mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
                >
                  Next
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Step 3: Booking Confirmation with Payment Options */}
        {nextStep === "thirdstep" && (
          <section className="mt-8 w-full max-w-2xl px-6">
            <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
              <section className="text-white p-6 md:p-12">
                
                {bookingSuccess ? (
                  // Success State
                  <>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    
                    <h6 className="text-2xl md:text-3xl font-bold mb-4">Booking Confirmed!</h6>
                    <p className="text-lg mb-6">
                      {paymentMethod === 'pay_now' 
                        ? "Thank you for your payment! We're excited to make your event special!" 
                        : "Thank you for your booking! You can pay later."
                      }
                    </p>

                    <div className="border-t border-white/20 my-6"></div>

                    <div className="space-y-4 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium">Service:</span>
                        <span className="capitalize">{params?.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">${totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment Status:</span>
                        <span className={`font-bold ${
                          paymentMethod === 'pay_now' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {paymentMethod === 'pay_now' ? 'Paid' : 'Pay Later'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = '/'}
                      style={{ color: "rgba(255,0,106,1)" }}
                      className="px-[16px] py-[8px] w-[164px] mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
                    >
                      Back to Home
                    </button>
                  </>
                ) : (
                  // Before booking confirmation
                  <>
                    <h6 className="text-lg font-semibold">Your total price</h6>
                    <h6 className="text-4xl md:text-5xl font-bold py-4 md:py-6">
                      ${totalPrice}
                    </h6>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-lg font-medium mb-4">Choose Payment Option</label>
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('pay_now')}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentMethod === 'pay_now'
                              ? 'border-[#FF3388] bg-[#FF3388] text-white'
                              : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                          }`}
                        >
                          Pay Now
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('pay_later')}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentMethod === 'pay_later'
                              ? 'border-[#FF3388] bg-[#FF3388] text-white'
                              : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                          }`}
                        >
                          Pay Later
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/20 my-4"></div>

                    <div className="py-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Event starts on</span>
                        <span className="text-right">
                          {secondStep.dateOfEvent} at {secondStep.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Event Duration</span>
                        <span className="text-right">
                          {secondStep.durationHours} Hours {secondStep.durationMinutes > 0 && `${secondStep.durationMinutes} Minutes`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Staff</span>
                        <span className="text-right">{secondStep.numberOfStaff} Butlers</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Service Type</span>
                        <span className="text-right capitalize">{params?.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      style={{ color: "rgba(255,0,106,1)" }}
                      className="px-[16px] py-[8px] w-[164px] mt-8 md:mt-12 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap disabled:opacity-50"
                      disabled={isProcessingPayment || isLoading}
                    >
                      {isProcessingPayment ? "Processing..." : 
                       paymentMethod === 'pay_now' ? "Pay Now" : "Confirm Booking"}
                    </button>

                    {paymentMethod === 'pay_later' && (
                      <p className="text-sm text-gray-300 mt-4">
                        You can pay for this booking later. Your booking will be confirmed immediately.
                      </p>
                    )}
                  </>
                )}
              </section>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
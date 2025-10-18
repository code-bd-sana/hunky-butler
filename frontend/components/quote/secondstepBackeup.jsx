'use client'
import React, { useState, useEffect, useRef } from 'react'
import image from "@/public/quote/bg.png";
import { IoLocationSharp } from "react-icons/io5";
import { useParams } from 'next/navigation';
import { useBookingMutation } from '@/features/booking';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { base_url } from '@/utils/utils';
import { useGetServiceQuery } from '@/features/services/servicesApi';

const stripePromise = loadStripe('pk_test_51RWA5gFVdJBgYBDxRIUNli1dDlicyaiOTCEECLujXMHTyVEujYQJ2pZ9DFlUeNPpaKzy7cPYJ1QlA6cUe7A9m6Eg00nP3ZNUFM');

// Price Calculation Function based on service type, duration, and number of butlers
const calculatePrice = (serviceSlug, durationHours, numberOfStaff) => {
  // Fixed price services
  if (serviceSlug === 'life-drawing') {
    return 230; // Fixed price for life drawing
  }
  
  if (serviceSlug === 'cocktail-masterclasses') {
    return 140; // Fixed price for cocktail masterclasses
  }

  // Buff Butlers pricing matrix for 1-5 butlers and 1-3 hours
  if (serviceSlug === 'buff-butlers') {
    const pricingMatrix = {
      1: { 1: 110, 2: 150, 3: 170 }, // 1 butler
      2: { 1: 190, 2: 250, 3: 300 }, // 2 butlers
      3: { 1: 250, 2: 350, 3: 420 } , 
     4: { 1: 440, 2: 600, 3: 680 } , // 3 butlers
      5: { 1: 550, 2: 750, 3: 850 }  // 3 butlers
    };
    const duration = Math.ceil(durationHours);
    const butlerCount = Math.min(Math.max(numberOfStaff, 1), 5); // Limit to 1-5 butlers
    const availableDurations = [1, 2, 3];
    const selectedDuration = availableDurations.includes(duration) ? duration : 3;
    
    return pricingMatrix[butlerCount]?.[selectedDuration] || pricingMatrix[butlerCount]?.[3] || 420;
  }

  // Default pricing for other services (strippers, etc.)
  return 100; // Fallback price
};

// Butler Fee Calculation Function
const calculateButlerFee = (serviceName, durationHours, numberOfStaff) => {
  // Fixed fees for specific services
  if (serviceName === 'cocktail-masterclasses') {
    return 140;
  }
  if (serviceName === 'strippers') {
    return 100;
  }
  
  // Hour-based fees for other services
  const hourlyRates = {
    1: 60,   // 1 hour: £60 per butler
    2: 90,   // 2 hours: £90 per butler
    3: 110   // 3 hours: £110 per butler
  };
  
  // Find the closest duration rate (round up to nearest hour for pricing)
  const duration = Math.ceil(durationHours);
  const rate = hourlyRates[duration] || hourlyRates[3]; // Default to 3 hours rate if longer
  
  return rate * numberOfStaff;
};

// Service duration options mapping
const getServiceDurationOptions = (serviceSlug) => {
  if (serviceSlug === 'strippers') {
    return [0.25]; // Only 15 minutes for strippers
  }
  
  if (serviceSlug === 'cocktail-masterclasses') {
    return [1.5]; // Only 90 minutes for cocktail masterclasses
  }
  
  if (serviceSlug === 'life-drawing') {
    return [2]; // Only 2 hours for life drawing
  }
  
  // For buff butlers and other services, allow 1-3 hours
  return [1, 2, 3];
};

// Default duration for each service
const getDefaultDuration = (serviceSlug) => {
  const durations = {
    'cocktail-masterclasses': 1.5,  // 90 minutes fixed
    'life-drawing': 2,              // 2 hours fixed
    'strippers': 0.25,              // 15 minutes fixed
    'buff-butlers': 2               // Default 2 hours for buff butlers
  };
  return durations[serviceSlug] || 2;
};

// Format duration for display
const formatDuration = (hours) => {
  if (hours === 0.25) return "15 minutes";
  if (hours === 1.5) return "90 minutes";
  if (hours === 1) return "1 hour";
  return `${hours} hours`;
};

// Google Places Autocomplete Component
const GooglePlacesAutocomplete = ({ onLocationSelect, value }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA1KF6rwYd2Za6Xyh3qZC7y-hDKUxFSStA&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeServices();
      };
    } else {
      initializeServices();
    }

    function initializeServices() {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, []);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const fetchPredictions = (input) => {
    if (!autocompleteService.current || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    autocompleteService.current.getPlacePredictions(
      {
        input: input,
        componentRestrictions: { country: 'gb' }, // UK only
        types: ['geocode'] // addresses only
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 8)); // Show top 8 results
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 1) {
        fetchPredictions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getPlaceDetails = (placeId) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: placeId,
        fields: ['formatted_address', 'name', 'geometry', 'address_components']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const fullAddress = place.formatted_address;
          setQuery(fullAddress);
          setShowSuggestions(false);
          
          if (onLocationSelect) {
            onLocationSelect({
              fullAddress: fullAddress,
              placeId: placeId,
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng()
            });
          }
        }
      }
    );
  };

  const handleSelect = (prediction) => {
    getPlaceDetails(prediction.place_id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // If user is typing manually, update the location
    if (onLocationSelect) {
      onLocationSelect({ fullAddress: value });
    }
  };

  const handleInputFocus = () => {
    if (query.length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for click
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Alternative: Simple UK cities list as fallback
  const ukCities = [
    "London, UK", "Manchester, UK", "Birmingham, UK", "Liverpool, UK", 
    "Leeds, UK", "Sheffield, UK", "Bristol, UK", "Glasgow, UK",
    "Edinburgh, UK", "Cardiff, UK", "Newcastle upon Tyne, UK", "Nottingham, UK"
  ];

  const getFallbackSuggestions = (input) => {
    return ukCities.filter(city =>
      city.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 8);
  };

  const handleFallbackSelect = (location) => {
    setQuery(location);
    setShowSuggestions(false);
    
    if (onLocationSelect) {
      onLocationSelect({
        fullAddress: location
      });
    }
  };

  const displaySuggestions = suggestions.length > 0 ? suggestions : 
    (query.length > 1 ? getFallbackSuggestions(query) : []);

  return (
    <div className="text-left w-full mt-6 md:mt-0 relative">
      <label htmlFor="location" className="text-white text-left block">Location *</label>
      <div className="relative">
        <input
          required
          type="text"
          name="location"
          id="location"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Enter UK address or city (e.g., London, Manchester)"
          className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669] pl-12 pr-10"
        />
        <IoLocationSharp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl" />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && displaySuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#000000ee] border border-[#6D6669] rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
          {displaySuggestions.map((item, index) => (
            <div
              key={index}
              className="px-4 py-3 cursor-pointer hover:bg-[#FF3388] text-white border-b border-[#6D6669] last:border-b-0 transition-colors duration-200"
              onClick={() => 
                item.place_id ? handleSelect(item) : handleFallbackSelect(item)
              }
              onMouseDown={(e) => e.preventDefault()}
            >
              {item.description || item}
            </div>
          ))}
        </div>
      )}
      
      {showSuggestions && displaySuggestions.length === 0 && query.length > 1 && (
        <div className="absolute z-50 w-full mt-1 bg-[#000000ee] border border-[#6D6669] rounded-lg shadow-lg backdrop-blur-md">
          <div className="px-4 py-3 text-gray-400 text-center">
            No locations found
          </div>
        </div>
      )}
    </div>
  );
};

// Step Indicator Component
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
 <div className="block sm:flex justify-center items-center space-x-4 space-y-4 md:space-y-0 mb-8 sm:mb-12">
  {steps.map((step, index) => (
    <React.Fragment key={step.id}>
      <div className="flex items-center sm:flex-col sm:items-center">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${
            step.id === currentStep && !bookingSuccess
              ? "bg-[#FF3388] border-[#FF3388] text-white"
              : index < currentIndex || bookingSuccess
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-400 text-gray-400"
          } font-semibold transition-all duration-300 text-sm sm:text-base flex-shrink-0`}
        >
          {(index < currentIndex || bookingSuccess) ? "✓" : step.number}
        </div>
        <span
          className={`text-xs sm:text-sm ml-2 sm:ml-0 sm:mt-2 ${
            step.id === currentStep && !bookingSuccess 
              ? "text-[#FF3388]" : 
            (index < currentIndex || bookingSuccess)
              ? "text-green-500" 
              : "text-gray-400"
          } font-medium`}
        >
          {step.label}
        </span>
      </div>
      {index < steps.length - 1 && (
        <div
          className={`hidden sm:block w-8 sm:w-16 h-1 ${
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
  const [paymentMethod, setPaymentMethod] = useState('pay_now');
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'deposit'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const params = useParams();
  const { data: session } = useSession();
  const { data: serviceData } = useGetServiceQuery(params?.category);

  // Get duration options for current service
  const durationOptions = getServiceDurationOptions(params.category);
  const defaultDuration = getDefaultDuration(params.category);

  // Initialize secondStep with default duration
  useEffect(() => {
    if (params.category && !secondStep.durationHours) {
      setSecondStep(prev => ({
        ...prev,
        durationHours: defaultDuration
      }));
    }
  }, [params.category, defaultDuration]);

  // Calculate prices based on service type
  const totalPrice = calculatePrice(
    params.category, 
    secondStep.durationHours || defaultDuration, 
    secondStep.numberOfStaff || 1
  );
  
  const butlerFee = calculateButlerFee(
    params.category, 
    secondStep.durationHours || defaultDuration, 
    secondStep.numberOfStaff || 1
  );
  
  const depositAmount = 20; // £20 deposit
  const balanceDue = totalPrice - depositAmount;

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

      // Phone number validation
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        toast.error("Please enter a valid phone number");
        return;
      }

      // Post code validation
      const postCodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
      if (!postCodeRegex.test(postCode)) {
        toast.error("Please enter a valid UK postcode");
        return;
      }

      // Location validation
      if (!location.trim()) {
        toast.error("Please enter your location");
        return;
      }

      const firstStepData = {
        firstName,
        lastName,
        email,
        phone,
        postCode: postCode.toUpperCase(),
        location: location.trim()
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
      const durationHours = form.durationHours ? parseFloat(form.durationHours.value) : defaultDuration;

      // Validate date is not in the past
      const selectedDate = new Date(dateOfEvent);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error("Please select a future date");
        return;
      }

      const secondStepData = {
        dateOfEvent,
        numberOfStaff: Number(numberOfStaff),
        startTime,
        durationHours
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
        price: totalPrice,
        butlerFee: butlerFee, // Add butler fee to the booking data
        paymentMethod,
        paid: paymentMethod === 'pay_now' ? 'pending' : 'unpaid',
        profit: totalPrice - butlerFee
      };

      if (paymentMethod === 'pay_now') {
        const response = await fetch(`${base_url}/payment/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingData: finalData,
            successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/booking/cancel`,
            paymentType: paymentType
          }),
        });

        const { sessionId, success, error, checkoutUrl } = await response.json();
        
        if (!success) {
          throw new Error(error || 'Failed to create checkout session');
        }
        
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
        }
        
      } else {
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
        price: totalPrice,
        butlerFee: butlerFee, // Add butler fee to the booking data
        paymentMethod,
        paid: paymentMethod === 'pay_now' ? 'pending' : 'unpaid',
        paymentType: paymentType,
        profit: price - butlerFee
      };

      const data = await booking(dataToSend).unwrap();
      
      setBookingData(dataToSend);
      setBookingSuccess(true);
      
      toast.success(paymentMethod === 'pay_now' 
        ? `Redirecting to ${paymentType === 'deposit' ? 'deposit' : ''} payment...` 
        : 'Booking Successful!'
      );
      
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  const handleLocationSelect = (locationData) => {
    setFirstStep(prev => ({
      ...prev,
      location: locationData.fullAddress
    }));
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

  // Get price breakdown for display
  const getPriceBreakdown = () => {
    const serviceSlug = params.category;
    const duration = secondStep.durationHours || defaultDuration;
    const staffCount = secondStep.numberOfStaff || 1;
    
    if (serviceSlug === 'life-drawing') {
      return "Fixed price for 2 hours";
    }
    
    if (serviceSlug === 'cocktail-masterclasses') {
      return "Fixed price for 90 minutes";
    }
    
    if (serviceSlug === 'buff-butlers') {
      const durationHours = Math.ceil(duration);
      return `${staffCount} butler${staffCount > 1 ? 's' : ''} for ${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    }
    
    return "Service price";
  };

  // Get butler fee breakdown for display
  const getButlerFeeBreakdown = () => {
    const serviceName = params.category;
    const duration = secondStep.durationHours || defaultDuration;
    const staffCount = secondStep.numberOfStaff || 1;
    
    if (serviceName === 'cocktail-masterclasses') {
      return `£140 × ${staffCount} butler${staffCount > 1 ? 's' : ''}`;
    }
    if (serviceName === 'strippers') {
      return `£100 × ${staffCount} butler${staffCount > 1 ? 's' : ''}`;
    }
    
    const hourlyRates = { 1: 60, 2: 90, 3: 110 };
    const rate = hourlyRates[Math.ceil(duration)] || hourlyRates[3];
    return `£${rate} × ${staffCount} butler${staffCount > 1 ? 's' : ''} (${formatDuration(duration)})`;
  };

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

        {/* Step 1: Personal Information */}
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
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="e.g., 07123456789"
                      pattern="[0-9+\-\s()]{10,}"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter a valid UK phone number</p>
                  </div>
                </section>

                <section className="md:flex items-center gap-4 mt-6 md:mt-8">
                  <div className="text-left w-full">
                    <label htmlFor="postCode" className="text-white text-left block">Post Code *</label>
                    <input
                      required
                      type="text"
                      name="postCode"
                      id="postCode"
                      placeholder="e.g., SW1A 1AA"
                      pattern="[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669] uppercase"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter a valid UK postcode</p>
                  </div>
                  <GooglePlacesAutocomplete 
                    onLocationSelect={handleLocationSelect}
                    value={firstStep.location}
                  />
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

        {/* Step 2: Event Information */}
        {nextStep === "secondstep" && (
          <section className="mt-8 md:mt-28 w-full max-w-4xl px-6">
            <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
              <form onSubmit={secondStepHandler} className="p-6 md:p-8">
                <section className="md:flex items-center gap-4">
                  <div className="text-left w-full">
                    <label htmlFor="dateOfEvent" className="text-white text-left block">Date of event *</label>
                    <div className="relative">
                      <input
                        required
                        type="date"
                        id="dateOfEvent"
                        name="dateOfEvent"
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669] appearance-none cursor-pointer"
                      />
                      {/* Custom calendar icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Click to open calendar</p>
                  </div>
                  <div className="text-left mt-6 md:mt-0 w-full">
                    <label className="text-white text-left block">Number of staff *</label>
                    <select
                      required
                      name="numberOfStaff"
                      className="bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669] cursor-pointer"
                    >
                      <option value="">Select number of staff</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Butler' : 'Butlers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                <section className="md:flex items-center gap-4 mt-6 md:mt-8">
                  <div className="text-left w-full">
                    <label htmlFor="startTime" className="text-white text-left block">Start Time *</label>
                    <div className="relative">
                      <input
                        required
                        type="time"
                        id="startTime"
                        name="startTime"
                        className="bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669] appearance-none cursor-pointer"
                      />
                      {/* Custom clock icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Click to select time</p>
                  </div>
                  <div className="text-left w-full mt-6 md:mt-0">
                    <label className="text-white text-left block">Duration *</label>
                    {durationOptions.length === 1 ? (
                      // Fixed duration for services with only one option
                      <div className="bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669]">
                        {formatDuration(defaultDuration)}
                      </div>
                    ) : (
                      // Selectable duration for services with multiple options
                      <select
                        required
                        name="durationHours"
                        className="bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669] cursor-pointer"
                        defaultValue={defaultDuration}
                      >
                        {durationOptions.map(duration => (
                          <option key={duration} value={duration}>
                            {formatDuration(duration)}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {durationOptions.length === 1 
                        ? `Fixed duration for ${params.category} service`
                        : 'Select duration for your event'
                      }
                    </p>
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
                        ? paymentType === 'deposit'
                          ? "Thank you for your deposit! We're excited to make your event special!"
                          : "Thank you for your payment! We're excited to make your event special!"
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
                        <span className="font-medium">Location:</span>
                        <span className="text-right max-w-[200px] break-words">{firstStep.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">£{totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Price Breakdown:</span>
                        <span className="text-right text-sm text-gray-300">{getPriceBreakdown()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Butler Fee:</span>
                        <span className="font-bold text-blue-400">£{butlerFee}</span>
                      </div>
                      {paymentType === 'deposit' && (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">Deposit Paid:</span>
                            <span className="font-bold text-green-400">£{depositAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Balance Due:</span>
                            <span className="font-bold text-yellow-400">£{balanceDue}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium">Payment Status:</span>
                        <span className={`font-bold ${
                          paymentMethod === 'pay_now' 
                            ? paymentType === 'deposit' 
                              ? 'text-yellow-400' 
                              : 'text-green-400'
                            : 'text-yellow-400'
                        }`}>
                          {paymentMethod === 'pay_now' 
                            ? paymentType === 'deposit' ? 'Deposit Paid' : 'Paid' 
                            : 'Pay Later'
                          }
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
                      £{totalPrice}
                    </h6>

                    {/* Payment Type Selection */}
                    <div className="mb-6">
                      <label className="block text-lg font-medium mb-4">Choose Payment Option</label>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <button
                          type="button"
                          onClick={() => setPaymentType('full')}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentType === 'full'
                              ? 'border-[#FF3388] bg-[#FF3388] text-white'
                              : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                          }`}
                        >
                          Pay Full Amount
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType('deposit')}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentType === 'deposit'
                              ? 'border-[#FF3388] bg-[#FF3388] text-white'
                              : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                          }`}
                        >
                          Pay £20 Deposit
                        </button>
                      </div>
                      {paymentType === 'deposit' && (
                        <p className="text-sm text-gray-300 mt-2">
                          Pay £20 now and the remaining £{balanceDue} later
                        </p>
                      )}
                    </div>

                    <div className="border-t border-white/20 my-4"></div>

                    {/* Payment Summary */}
                    <div className="py-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Service Price</span>
                        <div className="text-right">
                          <span className="font-bold">£{totalPrice}</span>
                          <p className="text-xs text-gray-400">{getPriceBreakdown()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Butler Fee</span>
                        <div className="text-right">
                          <span className="font-bold">£{butlerFee}</span>
                          <p className="text-xs text-gray-400">{getButlerFeeBreakdown()}</p>
                        </div>
                      </div>
                      {paymentType === 'deposit' && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm md:text-lg">Deposit Amount</span>
                            <span className="text-right text-green-400 font-bold">£{depositAmount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm md:text-lg">Balance Due</span>
                            <span className="text-right text-yellow-400 font-bold">£{balanceDue}</span>
                          </div>
                          <div className="border-t border-white/20 pt-2"></div>
                        </>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Total Amount</span>
                        <span className="text-right font-bold">£{totalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Event starts on</span>
                        <span className="text-right">
                          {secondStep.dateOfEvent} at {secondStep.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Event Duration</span>
                        <span className="text-right">
                          {formatDuration(secondStep.durationHours || defaultDuration)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Staff</span>
                        <span className="text-right">{secondStep.numberOfStaff} {secondStep.numberOfStaff === 1 ? 'Butler' : 'Butlers'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Location</span>
                        <span className="text-right max-w-[200px] break-words">{firstStep.location}</span>
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
                      {isProcessingPayment 
                        ? "Processing..." 
                        : paymentType === 'deposit' 
                          ? `Pay £${depositAmount} Deposit` 
                          : `Pay £${totalPrice}`
                      }
                    </button>
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
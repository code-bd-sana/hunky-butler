"use client";
import { useBookingMutation } from "@/features/booking";
import { useGetServiceQuery } from "@/features/services/servicesApi";
import image from "@/public/quote/bg.png";
import { base_url } from "@/utils/utils";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";

const stripePromise = loadStripe(
  "pk_test_51RWA5gFVdJBgYBDxRIUNli1dDlicyaiOTCEECLujXMHTyVEujYQJ2pZ9DFlUeNPpaKzy7cPYJ1QlA6cUe7A9m6Eg00nP3ZNUFM",
);

// Hub Network Configuration
const HUB_NETWORK = [
  {
    name: "London",
    postcode: "EC1A 1BB",
    lat: 51.5155,
    lng: -0.0922,
    region: "South-East England",
  },
  {
    name: "Brighton",
    postcode: "BN1 1AA",
    lat: 50.8225,
    lng: -0.1372,
    region: "South Coast",
  },
  {
    name: "Bournemouth",
    postcode: "BH2 5AA",
    lat: 50.7192,
    lng: -1.8801,
    region: "Dorset",
  },
  {
    name: "Portsmouth",
    postcode: "PO1 1AA",
    lat: 50.7989,
    lng: -1.0913,
    region: "Hampshire",
  },
  {
    name: "Bristol",
    postcode: "BS1 4ST",
    lat: 51.4545,
    lng: -2.5879,
    region: "South-West",
  },
  {
    name: "Cardiff",
    postcode: "CF10 1AA",
    lat: 51.4816,
    lng: -3.1791,
    region: "South Wales",
  },
  {
    name: "Birmingham",
    postcode: "B1 1AA",
    lat: 52.4786,
    lng: -1.9081,
    region: "Midlands",
  },
  {
    name: "Nottingham",
    postcode: "NG1 1AA",
    lat: 52.9538,
    lng: -1.1505,
    region: "East Midlands",
  },
  {
    name: "Leicester",
    postcode: "LE1 1AA",
    lat: 52.6343,
    lng: -1.1319,
    region: "Midlands",
  },
  {
    name: "Leeds",
    postcode: "LS1 4DY",
    lat: 53.7974,
    lng: -1.5438,
    region: "Yorkshire",
  },
  {
    name: "Manchester",
    postcode: "M1 1AA",
    lat: 53.4781,
    lng: -2.2446,
    region: "North-West",
  },
  {
    name: "Liverpool",
    postcode: "L1 4EF",
    lat: 53.4055,
    lng: -2.9805,
    region: "Merseyside",
  },
  {
    name: "Chester",
    postcode: "CH1 1AA",
    lat: 53.1934,
    lng: -2.8931,
    region: "NW Border",
  },
  {
    name: "Newcastle",
    postcode: "NE1 4LP",
    lat: 54.9783,
    lng: -1.6178,
    region: "North-East",
  },
  {
    name: "Middlesbrough",
    postcode: "TS1 1AA",
    lat: 54.5742,
    lng: -1.235,
    region: "Teesside",
  },
  {
    name: "Glasgow",
    postcode: "G1 1XX",
    lat: 55.8609,
    lng: -4.2514,
    region: "Scotland West",
  },
  {
    name: "Edinburgh",
    postcode: "EH1 1YZ",
    lat: 55.9533,
    lng: -3.1883,
    region: "Scotland East",
  },
  {
    name: "Aberdeen",
    postcode: "AB10 1AA",
    lat: 57.1497,
    lng: -2.0943,
    region: "North Scotland",
  },
  {
    name: "Cambridge",
    postcode: "CB2 1AA",
    lat: 52.2053,
    lng: 0.1218,
    region: "East Anglia",
  },
  {
    name: "Plymouth",
    postcode: "PL1 1AA",
    lat: 50.3704,
    lng: -4.1427,
    region: "Devon / Cornwall",
  },
];

// Pricing Configuration
const PRICING_CONFIG = {
  localCoverageRadiusMiles: 15,
  distanceSensitivityKm: 250,
  distanceCap: 2.0,
  longDistanceThresholdMiles: 60,
};

// Utility Functions
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestHub = (lat, lng) => {
  let nearestHub = null;
  let minDistance = Infinity;

  HUB_NETWORK.forEach((hub) => {
    const distance = haversineDistance(lat, lng, hub.lat, hub.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestHub = { ...hub, distanceKm: distance };
    }
  });

  return nearestHub;
};

const calculateDistanceMultiplier = (distanceKm) => {
  const { localCoverageRadiusMiles, distanceSensitivityKm, distanceCap } =
    PRICING_CONFIG;

  console.log(distanceKm, "distane km");

  const distanceMiles = distanceKm;
  console.log(distanceMiles, "distancemile");

  // Check if within local coverage radius
  if (distanceMiles <= localCoverageRadiusMiles) {
    return {
      multiplier: 1.0,
      reason: "local_coverage",
      capped: false,
      distanceMiles: parseFloat(distanceMiles.toFixed(2)),
    };
  }

  // Calculate continuous multiplier
  const rawMultiplier = 1.0 + distanceKm / distanceSensitivityKm;
  const multiplier = Math.min(rawMultiplier, distanceCap);

  return {
    multiplier: parseFloat(multiplier.toFixed(2)),
    reason: multiplier >= distanceCap ? "capped" : "continuous",
    capped: multiplier >= distanceCap,
    distanceMiles: parseFloat(distanceMiles.toFixed(2)),
  };
};

const applyLongDistanceMinimum = (
  selectedDuration,
  distanceMiles,
  serviceSlug,
) => {
  const { longDistanceThresholdMiles } = PRICING_CONFIG;

  if (
    distanceMiles > longDistanceThresholdMiles &&
    selectedDuration < 2 &&
    serviceSlug === "buff-butlers"
  ) {
    return {
      billableDuration: 2,
      minimumApplied: true,
    };
  }

  return {
    billableDuration: selectedDuration,
    minimumApplied: false,
  };
};

// Postcode to coordinates lookup
const lookupPostcodeCoordinates = async (postcode) => {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
    );
    const data = await response.json();
    console.log(data, "KM ");

    if (data.status === 200) {
      return {
        lat: data.result.latitude,
        lng: data.result.longitude,
        success: true,
      };
    } else {
      throw new Error("Postcode not found");
    }
  } catch (error) {
    console.error("Postcode lookup failed:", error);
    return {
      success: false,
      error: "Unable to lookup postcode coordinates",
    };
  }
};

// Base Price Calculation (without distance multiplier)
const calculateBasePrice = (serviceSlug, durationHours, numberOfStaff) => {
  if (serviceSlug === "life-drawing") {
    return 230;
  }

  if (serviceSlug === "cocktail-masterclasses") {
    return 140;
  }

  if (serviceSlug === "buff-butlers") {
    const pricingMatrix = {
      1: { 1: 110, 2: 150, 3: 170 },
      2: { 1: 190, 2: 250, 3: 300 },
      3: { 1: 250, 2: 350, 3: 420 },
      4: { 1: 440, 2: 600, 3: 680 },
      5: { 1: 550, 2: 750, 3: 850 },
    };
    const duration = Math.ceil(durationHours);
    const butlerCount = Math.min(Math.max(numberOfStaff, 1), 5);
    const availableDurations = [1, 2, 3];
    const selectedDuration = availableDurations.includes(duration)
      ? duration
      : 3;

    return (
      pricingMatrix[butlerCount]?.[selectedDuration] ||
      pricingMatrix[butlerCount]?.[3] ||
      420
    );
  }

  return 150;
};

const getRoadDistanceInMiles = async (lat1, lon1, lat2, lon2) => {
  try {
    // First try HTTPS OSRM if available
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("OSRM API failed");

    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const meters = data.routes[0].distance;
      const miles = meters * 0.000621371;
      console.log("✅ OSRM distance calculated:", miles);
      return miles;
    }
    throw new Error("No route found");
  } catch (err) {
    console.error("OSRM failed, using fallback:", err);

    // Fallback: Haversine with road factor
    const haversineKm = haversineDistance(lat1, lon1, lat2, lon2);
    const roadFactor = 1.3; // Realistic road distance multiplier
    const estimatedMiles = haversineKm * roadFactor * 0.621371;

    console.log("📍 Fallback distance calculated:", {
      straightLineKm: haversineKm.toFixed(2),
      estimatedRoadMiles: estimatedMiles.toFixed(2),
      factor: roadFactor,
    });

    return estimatedMiles;
  }
};
// Main Price Calculation Function
const calculatePrice = async (
  serviceSlug,
  durationHours,
  numberOfStaff,
  postcode,
) => {
  try {
    // Lookup postcode coordinates
    const coordinates = await lookupPostcodeCoordinates(postcode);

    const customerLat = coordinates.lat;
    const customerLng = coordinates.lng;

    console.log(coordinates, "coordinates");
    if (!coordinates.success) {
      throw new Error(coordinates.error);
    }

    // Find nearest hub
    const nearestHub = findNearestHub(coordinates.lat, coordinates.lng);

    const hubLat = nearestHub.lat;
    const hubLng = nearestHub.lng;

    console.log(nearestHub, "Near Hub");

    const a = { latitude: customerLat, longitude: customerLng };
    const b = { latitude: hubLat, longitude: hubLng };

    const miles = await getRoadDistanceInMiles(
      customerLat,
      customerLng,
      hubLat,
      hubLng,
    );
    console.log(miles, "Tihs is the final");

    // Calculate distance multiplier

    console.log(nearestHub.distanceKm, "eta holo ager");
    const distanceInfo = calculateDistanceMultiplier(miles);

    // Apply long distance minimum duration
    const durationInfo = applyLongDistanceMinimum(
      durationHours,
      distanceInfo.distanceMiles,
      serviceSlug,
    );

    // Calculate base price
    const basePrice = calculateBasePrice(
      serviceSlug,
      durationInfo.billableDuration,
      numberOfStaff,
    );

    // Apply distance multiplier
    const totalPrice = Math.round(basePrice * distanceInfo.multiplier);

    return {
      totalPrice,
      basePrice,
      distanceInfo: {
        ...distanceInfo,
        nearestHub: nearestHub.name,
        hubDistanceKm: parseFloat(nearestHub.distanceKm.toFixed(2)),
      },
      durationInfo,
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
    };
  } catch (error) {
    console.error("Price calculation failed:", error);
    // Fallback to basic calculation
    const basePrice = calculateBasePrice(
      serviceSlug,
      durationHours,
      numberOfStaff,
    );
    return {
      totalPrice: basePrice,
      basePrice,
      distanceInfo: {
        multiplier: 1.15,
        reason: "fallback",
        capped: false,
        distanceMiles: 0,
        nearestHub: "Unknown",
        hubDistanceKm: 0,
      },
      durationInfo: {
        billableDuration: durationHours,
        minimumApplied: false,
      },
      coordinates: null,
      error: error.message,
    };
  }
};

// Butler Fee Calculation Function
const calculateButlerFee = (serviceName, durationHours, numberOfStaff) => {
  if (serviceName === "cocktail-masterclasses") {
    return 140;
  }
  if (serviceName === "strippers") {
    return 150;
  }

  const hourlyRates = {
    1: 60,
    2: 90,
    3: 110,
  };

  const duration = Math.ceil(durationHours);
  const rate = hourlyRates[duration] || hourlyRates[3];
  return rate * numberOfStaff;
};

// Service duration options mapping
const getServiceDurationOptions = (serviceSlug) => {
  if (serviceSlug === "strippers") {
    return [0.25];
  }

  if (serviceSlug === "cocktail-masterclasses") {
    return [1.5];
  }

  if (serviceSlug === "life-drawing") {
    return [2];
  }

  return [1, 2, 3];
};

// Default duration for each service
const getDefaultDuration = (serviceSlug) => {
  const durations = {
    "cocktail-masterclasses": 1.5,
    "life-drawing": 2,
    strippers: 0.25,
    "buff-butlers": 2,
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
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  const initializeServices = () => {
    autocompleteService.current =
      new window.google.maps.places.AutocompleteService();
    placesService.current = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
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
  }, []);

  useEffect(() => {
    setQuery(value || "");
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
        componentRestrictions: { country: "gb" },
        types: ["geocode"],
      },
      (predictions, status) => {
        setIsLoading(false);
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions.slice(0, 8));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      },
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
        fields: ["formatted_address", "name", "geometry", "address_components"],
      },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          const fullAddress = place.formatted_address;
          setQuery(fullAddress);
          setShowSuggestions(false);

          if (onLocationSelect) {
            onLocationSelect({
              fullAddress: fullAddress,
              placeId: placeId,
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng(),
            });
          }
        }
      },
    );
  };

  const handleSelect = (prediction) => {
    getPlaceDetails(prediction.place_id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

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
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const ukCities = [
    "London, UK",
    "Manchester, UK",
    "Birmingham, UK",
    "Liverpool, UK",
    "Leeds, UK",
    "Sheffield, UK",
    "Bristol, UK",
    "Glasgow, UK",
    "Edinburgh, UK",
    "Cardiff, UK",
    "Newcastle upon Tyne, UK",
    "Nottingham, UK",
  ];

  const getFallbackSuggestions = (input) => {
    return ukCities
      .filter((city) => city.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 8);
  };

  const handleFallbackSelect = (location) => {
    setQuery(location);
    setShowSuggestions(false);

    if (onLocationSelect) {
      onLocationSelect({
        fullAddress: location,
      });
    }
  };

  const displaySuggestions =
    suggestions.length > 0
      ? suggestions
      : query.length > 1
        ? getFallbackSuggestions(query)
        : [];

  return (
    <div className='text-left w-full mt-6 md:mt-0 relative'>
      <label htmlFor='location' className='text-white text-left block'>
        Address *
      </label>
      <div className='relative'>
        <input
          required
          type='text'
          name='location'
          id='location'
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder='Enter UK address or city (e.g., London, Manchester)'
          className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669] pl-12 pr-10'
        />
        <IoLocationSharp className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl' />

        {isLoading && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
          </div>
        )}
      </div>

      {showSuggestions && displaySuggestions.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-[#000000ee] border border-[#6D6669] rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-md'>
          {displaySuggestions.map((item, index) => (
            <div
              key={index}
              className='px-4 py-3 cursor-pointer hover:bg-[#FF3388] text-white border-b border-[#6D6669] last:border-b-0 transition-colors duration-200'
              onClick={() =>
                item.place_id ? handleSelect(item) : handleFallbackSelect(item)
              }
              onMouseDown={(e) => e.preventDefault()}>
              {item.description || item}
            </div>
          ))}
        </div>
      )}

      {showSuggestions &&
        displaySuggestions.length === 0 &&
        query.length > 1 && (
          <div className='absolute z-50 w-full mt-1 bg-[#000000ee] border border-[#6D6669] rounded-lg shadow-lg backdrop-blur-md'>
            <div className='px-4 py-3 text-gray-400 text-center'>
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
    { id: "thirdstep", number: 4, label: "Confirmation" },
  ];

  const getStepIndex = (step) => {
    return steps.findIndex((s) => s.id === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className='block sm:flex justify-center items-center space-x-4 space-y-4 md:space-y-0 mb-8 sm:mb-12'>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className='flex items-center sm:flex-col sm:items-center'>
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${
                step.id === currentStep && !bookingSuccess
                  ? "bg-[#FF3388] border-[#FF3388] text-white"
                  : index < currentIndex || bookingSuccess
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-400 text-gray-400"
              } font-semibold transition-all duration-300 text-sm sm:text-base flex-shrink-0`}>
              {index < currentIndex || bookingSuccess ? "✓" : step.number}
            </div>
            <span
              className={`text-xs sm:text-sm ml-2 sm:ml-0 sm:mt-2 ${
                step.id === currentStep && !bookingSuccess
                  ? "text-[#FF3388]"
                  : index < currentIndex || bookingSuccess
                    ? "text-green-500"
                    : "text-gray-400"
              } font-medium`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`hidden sm:block w-8 sm:w-16 h-1 ${
                index < currentIndex || bookingSuccess
                  ? "bg-green-500"
                  : "bg-gray-400"
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
  const [paymentMethod, setPaymentMethod] = useState("pay_now");
  const [paymentType, setPaymentType] = useState("full");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [savedBookingId, setSavedBookingId] = useState(null);

  const params = useParams();
  const { data: session } = useSession();
  const { data: serviceData } = useGetServiceQuery(params?.category);

  const durationOptions = getServiceDurationOptions(params.category);
  const defaultDuration = getDefaultDuration(params.category);

  useEffect(() => {
    if (params.category) {
      setSecondStep((prev) => ({
        ...prev,
        durationHours: prev.durationHours || defaultDuration,
        numberOfStaff: prev.numberOfStaff || 1,
      }));
    }
  }, [params.category, defaultDuration]);

  // Calculate price when relevant data changes
  useEffect(() => {
    const calculatePricing = async () => {
      if (
        firstStep.postCode &&
        secondStep.durationHours &&
        secondStep.numberOfStaff
      ) {
        setIsCalculatingPrice(true);
        try {
          const result = await calculatePrice(
            params.category,
            secondStep.durationHours,
            secondStep.numberOfStaff,
            firstStep.postCode,
          );
          setPriceCalculation(result);
          setDistanceInfo(result.distanceInfo);
        } catch (error) {
          console.error("Price calculation error:", error);
          toast.error("Failed to calculate price");
        } finally {
          setIsCalculatingPrice(false);
        }
      }
    };

    calculatePricing();
  }, [
    firstStep.postCode,
    secondStep.durationHours,
    secondStep.numberOfStaff,
    params.category,
  ]);

  const totalPrice = priceCalculation?.totalPrice || 0;

  const basePrice = priceCalculation?.basePrice || 0;

  const butlerFee = calculateButlerFee(
    params.category,
    secondStep.durationHours || defaultDuration,
    secondStep.numberOfStaff || 1,
  );

  const depositAmount = 20;
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

      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        toast.error("Please enter a valid phone number");
        return;
      }

      const postCodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
      if (!postCodeRegex.test(postCode)) {
        toast.error("Please enter a valid UK postcode");
        return;
      }

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
        location: location.trim(),
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
      const durationHours = form.durationHours
        ? parseFloat(form.durationHours.value)
        : defaultDuration;

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
        durationHours,
      };

      setSecondStep(secondStepData);

      // Calculate the final price explicitly using form values to prevent using 0 or outdated pricing in initial booking save
      setIsCalculatingPrice(true);
      const calcResult = await calculatePrice(
        params.category,
        durationHours,
        Number(numberOfStaff),
        firstStep.postCode,
      );

      setPriceCalculation(calcResult);
      setDistanceInfo(calcResult.distanceInfo);
      setIsCalculatingPrice(false);

      const computedTotalPrice = calcResult.totalPrice;
      const computedBasePrice = calcResult.basePrice;
      const computedButlerFee = calculateButlerFee(
        params.category,
        durationHours,
        Number(numberOfStaff),
      );
      const travelFee = computedTotalPrice - computedBasePrice;

      // TRIGGER IMMEDIATE BOOKING SAVE (to send notification)
      const initialBookingData = {
        ...firstStep,
        ...secondStepData,
        slug: params.category,
        serviceName: params.category,
        price: computedTotalPrice,
        basePrice: computedBasePrice,
        distanceInfo: calcResult.distanceInfo,
        durationInfo: calcResult.durationInfo,
        butlerFee: computedButlerFee,
        paymentMethod: "pay_now",
        paid: "unpaid",
        paymentStatus: "pending",
        profit: computedTotalPrice - (computedButlerFee + travelFee),
        travelFee: travelFee,
        coordinates: calcResult.coordinates,
      };

      const result = await booking(initialBookingData).unwrap();
      if (result?.data?._id) {
        setSavedBookingId(result.data._id);
        console.log("✅ Initial booking saved with ID:", result.data._id);
      }

      setNextStep("thirdstep");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save event information");
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);

      if (!savedBookingId) {
        // Fallback if initial save failed for some reason
        await bookNowHandler();
        return;
      }

      console.log(
        "🔄 Initiating payment for existing booking:",
        savedBookingId,
      );
      const response = await fetch(
        `${base_url}/payment/create-checkout-session-exist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: savedBookingId,
            successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/booking/cancel`,
          }),
        },
      );

      const result = await response.json();
      const { sessionId, success, error, checkoutUrl } = result;

      if (!success) {
        throw new Error(error || "Failed to create checkout session");
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else if (sessionId) {
        window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
      } else {
        throw new Error("No checkout URL or session ID received");
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
      if (savedBookingId) {
        // Booking already exists in DB from Step 2 auto-save
        setBookingSuccess(true);
        toast.success("Booking saved! You can pay later.");
        return;
      }

      const travelFee = totalPrice - basePrice;

      const dataToSend = finalData || {
        ...firstStep,
        ...secondStep,
        slug: params.category,
        serviceName: params.category,
        price: totalPrice,
        basePrice: basePrice,
        distanceInfo: distanceInfo,
        durationInfo: priceCalculation?.durationInfo,
        butlerFee: butlerFee,
        paymentMethod,
        paid: paymentMethod === "pay_now" ? "pending" : "unpaid",
        paymentType: paymentType,
        profit: totalPrice - (butlerFee + travelFee),
        travelFee: travelFee,
        coordinates: priceCalculation?.coordinates,
      };

      const data = await booking(dataToSend).unwrap();

      setBookingData(dataToSend);
      setBookingSuccess(true);

      toast.success(
        paymentMethod === "pay_now"
          ? `Redirecting to ${paymentType === "deposit" ? "deposit" : ""} payment...`
          : "Booking Successful!",
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  const handleLocationSelect = (locationData) => {
    setFirstStep((prev) => ({
      ...prev,
      location: locationData.fullAddress,
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

  const getPriceBreakdown = () => {
    const serviceSlug = params.category;
    const duration = secondStep.durationHours || defaultDuration;
    const staffCount = secondStep.numberOfStaff || 1;

    if (serviceSlug === "life-drawing") {
      return "Fixed price for 2 hours";
    }

    if (serviceSlug === "cocktail-masterclasses") {
      return "Fixed price for 90 minutes";
    }

    if (serviceSlug === "buff-butlers") {
      const durationHours = Math.ceil(duration);
      return `${staffCount} butler${staffCount > 1 ? "s" : ""} for ${durationHours} hour${durationHours > 1 ? "s" : ""}`;
    }

    return "Service price";
  };

  const getButlerFeeBreakdown = () => {
    const serviceName = params.category;
    const duration = secondStep.durationHours || defaultDuration;
    const staffCount = secondStep.numberOfStaff || 1;

    if (serviceName === "cocktail-masterclasses") {
      return `£140 × ${staffCount} butler${staffCount > 1 ? "s" : ""}`;
    }
    if (serviceName === "strippers") {
      return `£150 × ${staffCount} butler${staffCount > 1 ? "s" : ""}`;
    }

    const hourlyRates = { 1: 60, 2: 90, 3: 110 };
    const rate = hourlyRates[Math.ceil(duration)] || hourlyRates[3];
    return `£${rate} × ${staffCount} butler${staffCount > 1 ? "s" : ""} (${formatDuration(duration)})`;
  };

  const getDistanceDisplayInfo = () => {
    if (!distanceInfo) return null;

    const { multiplier, reason, distanceMiles, nearestHub, hubDistanceKm } =
      distanceInfo;

    if (reason === "local_coverage") {
      return {
        title: "Local Coverage Area",
        description: `Within ${PRICING_CONFIG.localCoverageRadiusMiles} miles of our ${nearestHub} hub — no travel uplift`,
        color: "text-green-400",
      };
    }

    if (reason === "capped") {
      return {
        title: "Maximum Travel Fee Applied",
        description: `Long distance from ${nearestHub} (${distanceMiles} miles) — maximum multiplier applied`,
        color: "text-yellow-400",
      };
    }

    return {
      title: "Distance-Based Pricing",
      description: `${distanceMiles} miles from ${nearestHub} hub — continuous distance multiplier applied`,
      color: "text-blue-400",
    };
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image.src})`,
      }}
      className='relative min-h-screen w-full overflow-hidden bg-cover bg-center'>
      <Toaster />

      <div className='relative z-10 flex flex-col items-center justify-end pt-40 pb-10 text-center h-full'>
        <StepIndicator currentStep={nextStep} bookingSuccess={bookingSuccess} />

        <h4 className='text-3xl md:text-5xl text-white font-medium leading-snug max-w-4xl mx-auto mb-8 md:mb-12'>
          {getStepTitle()}
        </h4>

        {/* Step 1: Personal Information */}
        {nextStep === "firststep" && (
          <section className='w-full max-w-4xl px-6'>
            <div className='rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg'>
              <form onSubmit={firstStepHandler} className='p-6 md:p-8'>
                <section className='md:flex items-center gap-4'>
                  <div className='text-left w-full'>
                    <label
                      htmlFor='firstname'
                      className='text-white text-left block'>
                      First Name *
                    </label>
                    <input
                      required
                      type='text'
                      name='firstname'
                      id='firstname'
                      placeholder='First Name'
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'
                    />
                  </div>
                  <div className='text-left w-full mt-6 md:mt-0'>
                    <label
                      htmlFor='lastName'
                      className='text-white text-left block'>
                      Last Name *
                    </label>
                    <input
                      required
                      type='text'
                      name='lastName'
                      id='lastName'
                      placeholder='Last Name'
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'
                    />
                  </div>
                </section>

                <section className='md:flex items-center gap-4 mt-6 md:mt-8'>
                  <div className='text-left w-full'>
                    <label
                      htmlFor='email'
                      className='text-white text-left block'>
                      E-Mail *
                    </label>
                    <input
                      required
                      type='email'
                      name='email'
                      id='email'
                      defaultValue={session?.user?.email}
                      placeholder='Email'
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'
                    />
                  </div>
                  <div className='text-left w-full mt-6 md:mt-0'>
                    <label
                      htmlFor='phone'
                      className='text-white text-left block'>
                      Phone *
                    </label>
                    <input
                      required
                      type='tel'
                      name='phone'
                      id='phone'
                      placeholder='e.g., 07123456789'
                      pattern='[0-9+\-\s()]{10,}'
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669]'
                    />
                    <p className='text-xs text-gray-400 mt-1'>
                      Enter a valid UK phone number
                    </p>
                  </div>
                </section>

                <section className='md:flex items-center gap-4 mt-6 md:mt-8'>
                  <div className='text-left w-full'>
                    <label
                      htmlFor='postCode'
                      className='text-white text-left block'>
                      Post Code *
                    </label>
                    <input
                      required
                      type='text'
                      name='postCode'
                      id='postCode'
                      placeholder='e.g., SW1A 1AA'
                      pattern='[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}'
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border-1 py-3.5 px-4 rounded-lg border-[#6D6669] uppercase'
                    />
                    <p className='text-xs text-gray-400 mt-1'>
                      Enter a valid UK postcode
                    </p>
                    {firstStep.postCode && distanceInfo && (
                      <div className='text-xs mt-1'>
                        <p
                          className={`${getDistanceDisplayInfo()?.color || "text-[#FF3388]"}`}>
                          {getDistanceDisplayInfo()?.title}
                        </p>
                        <p className='text-gray-400'>
                          {getDistanceDisplayInfo()?.description}
                        </p>
                        {distanceInfo.multiplier > 1 && (
                          <p className='text-[#FF3388]'>
                            Distance Multiplier: ×{distanceInfo.multiplier}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <GooglePlacesAutocomplete
                    onLocationSelect={handleLocationSelect}
                    value={firstStep.location}
                  />
                </section>

                <button
                  type='submit'
                  style={{ color: "rgba(255,0,106,1)" }}
                  className='px-[16px] py-[8px] w-[164px] cursor-pointer mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap'>
                  Next
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Step 2: Event Information */}
        {nextStep === "secondstep" && (
          <section className='mt-8 md:mt-0 w-full max-w-4xl px-6'>
            <div className='rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg'>
              <form onSubmit={secondStepHandler} className='p-6 md:p-8'>
                <section className='md:flex items-center gap-4'>
                  <div className='text-left w-full'>
                    <label
                      htmlFor='dateOfEvent'
                      className='text-white text-left block'>
                      Date of event *
                    </label>
                    <div className='relative'>
                      <input
                        required
                        type='date'
                        id='dateOfEvent'
                        name='dateOfEvent'
                        value={secondStep.dateOfEvent || ""}
                        onChange={(e) => setSecondStep(prev => ({ ...prev, dateOfEvent: e.target.value }))}
                        min={new Date().toISOString().split("T")[0]}
                        className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669] appearance-none cursor-pointer'
                      />
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                        </svg>
                      </div>
                    </div>
                    <p className='text-xs text-gray-400 mt-1'>
                      Click to open calendar
                    </p>
                  </div>
                  <div className='text-left mt-6 md:mt-0 w-full'>
                    <label className='text-white text-left block'>
                      Number of staff *
                    </label>
                    <select
                      required
                      name='numberOfStaff'
                      value={secondStep.numberOfStaff || 1}
                      onChange={(e) => setSecondStep(prev => ({ ...prev, numberOfStaff: Number(e.target.value) }))}
                      className='bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669] cursor-pointer'>
                      {durationOptions.length === 1
                        ? [1].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Butler" : "Butlers"}
                            </option>
                          ))
                        : [1, 2, 3].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Butler" : "Butlers"}
                            </option>
                          ))}
                    </select>
                  </div>
                </section>

                <section className='md:flex items-center gap-4 mt-6 md:mt-8'>
                  <div className='text-left w-full'>
                    <label
                      htmlFor='startTime'
                      className='text-white text-left block'>
                      Start Time *
                    </label>
                    <div className='relative'>
                      <input
                        required
                        type='time'
                        id='startTime'
                        name='startTime'
                        value={secondStep.startTime || ""}
                        onChange={(e) => setSecondStep(prev => ({ ...prev, startTime: e.target.value }))}
                        className='bg-[#00000066] text-white mt-1 outline-0 w-full placeholder:text-white border py-3.5 px-4 rounded-lg border-[#6D6669] appearance-none cursor-pointer'
                      />
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          className='w-5 h-5 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                        </svg>
                      </div>
                    </div>
                    <p className='text-xs text-gray-400 mt-1'>
                      Click to select time
                    </p>
                  </div>
                  <div className='text-left w-full mt-6 md:mt-0'>
                    <label className='text-white text-left block'>
                      Duration *
                    </label>
                    {durationOptions.length === 1 ? (
                      <div className='bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669]'>
                        {formatDuration(defaultDuration)}
                        {priceCalculation?.durationInfo?.minimumApplied && (
                          <p className='text-xs text-yellow-400 mt-1'>
                            2-hour minimum applied for long distance
                          </p>
                        )}
                      </div>
                    ) : (
                      <select
                        required
                        name='durationHours'
                        value={secondStep.durationHours || defaultDuration}
                        onChange={(e) => setSecondStep(prev => ({ ...prev, durationHours: parseFloat(e.target.value) }))}
                        className='bg-[#00000066] text-white mt-1 outline-0 w-full border py-3.5 px-4 rounded-lg border-[#6D6669] cursor-pointer'>
                        {durationOptions.map((duration) => (
                          <option key={duration} value={duration}>
                            {formatDuration(duration)}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className='text-xs text-gray-400 mt-1'>
                      {durationOptions.length === 1
                        ? `Fixed duration for ${params.category} service`
                        : "Select duration for your event"}
                      {priceCalculation?.durationInfo?.minimumApplied && (
                        <span className='text-yellow-400 block'>
                          2-hour minimum applied for long distance travel
                        </span>
                      )}
                    </p>
                  </div>
                </section>

                {/* Distance Information Display */}
                {distanceInfo && (
                  <div className='mt-6 p-4 bg-black/30 rounded-lg border border-white/20'>
                    <h4 className='text-white font-semibold mb-2'>
                      Location & Distance Information
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-gray-400'>Nearest Hub:</span>
                        <span className='text-white ml-2'>
                          {distanceInfo.nearestHub}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-400'>Distance:</span>
                        <span className='text-white ml-2'>
                          {distanceInfo.distanceMiles} miles (
                          {distanceInfo.hubDistanceKm} km)
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-400'>Multiplier:</span>
                        <span className='text-[#FF3388] ml-2'>
                          ×{distanceInfo.multiplier}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-400'>Pricing Type:</span>
                        <span
                          className={`ml-2 ${
                            distanceInfo.reason === "local_coverage"
                              ? "text-green-400"
                              : distanceInfo.reason === "capped"
                                ? "text-yellow-400"
                                : "text-blue-400"
                          }`}>
                          {distanceInfo.reason === "local_coverage"
                            ? "Local Coverage"
                            : distanceInfo.reason === "capped"
                              ? "Maximum Fee"
                              : "Continuous Pricing"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isLoading || isCalculatingPrice}
                  style={{ color: "rgba(255,0,106,1)" }}
                  className='px-[16px] py-[8px] w-[164px] mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap disabled:opacity-50'>
                  {isLoading ? "Saving..." : "Next"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Step 3: Booking Confirmation with Payment Options */}
        {nextStep === "thirdstep" && (
          <section className='mt-8 w-full max-w-2xl px-6'>
            <div className='rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg'>
              <section className='text-white p-6 md:p-12'>
                {bookingSuccess ? (
                  // Success State
                  <>
                    <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <svg
                        className='w-10 h-10 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'></path>
                      </svg>
                    </div>

                    <h6 className='text-2xl md:text-3xl font-bold mb-4'>
                      Booking Confirmed!
                    </h6>
                    <p className='text-lg mb-6'>
                      {paymentMethod === "pay_now"
                        ? paymentType === "deposit"
                          ? "Thank you for your deposit! We're excited to make your event special!"
                          : "Thank you for your payment! We're excited to make your event special!"
                        : "Thank you for your booking! You can pay later."}
                    </p>

                    <div className='border-t border-white/20 my-6'></div>

                    <div className='space-y-4 text-left'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Service:</span>
                        <span className='capitalize'>{params?.category}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Location:</span>
                        <span className='text-right max-w-[200px] break-words'>
                          {firstStep.location}
                        </span>
                      </div>
                      {distanceInfo && (
                        <div className='flex justify-between'>
                          <span className='font-medium'>Nearest Hub:</span>
                          <div className='text-right'>
                            <span className='font-bold'>
                              {distanceInfo.nearestHub}
                            </span>
                            <p className='text-xs text-gray-400'>
                              {distanceInfo.distanceMiles} miles away
                            </p>
                          </div>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <span className='font-medium'>Base Price:</span>
                        <span className='font-bold'>£{basePrice}</span>
                      </div>
                      {distanceInfo && distanceInfo.multiplier > 1 && (
                        <div className='flex justify-between'>
                          <span className='font-medium'>Travel Fee:</span>
                          <span className='font-bold text-yellow-400'>
                            +£{totalPrice - basePrice}
                          </span>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <span className='font-medium'>Total Amount:</span>
                        <span className='font-bold'>£{totalPrice}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Price Breakdown:</span>
                        <span className='text-right text-sm text-gray-300'>
                          {getPriceBreakdown()}
                        </span>
                      </div>

                      {paymentType === "deposit" && (
                        <>
                          <div className='flex justify-between'>
                            <span className='font-medium'>Deposit Paid:</span>
                            <span className='font-bold text-green-400'>
                              £{depositAmount}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='font-medium'>Balance Due:</span>
                            <span className='font-bold text-yellow-400'>
                              £{balanceDue}
                            </span>
                          </div>
                        </>
                      )}
                      <div className='flex justify-between'>
                        <span className='font-medium'>Payment Status:</span>
                        <span
                          className={`font-bold ${
                            paymentMethod === "pay_now"
                              ? paymentType === "deposit"
                                ? "text-yellow-400"
                                : "text-green-400"
                              : "text-yellow-400"
                          }`}>
                          {paymentMethod === "pay_now"
                            ? paymentType === "deposit"
                              ? "Deposit Paid"
                              : "Paid"
                            : "Pay Later"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => (window.location.href = "/")}
                      style={{ color: "rgba(255,0,106,1)" }}
                      className='px-[16px] py-[8px] w-[164px] mt-8 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap'>
                      Back to Home
                    </button>
                  </>
                ) : (
                  // Before booking confirmation
                  <>
                    <h6 className='text-lg font-semibold'>Your total price</h6>
                    <h6 className='text-4xl md:text-5xl font-bold py-4 md:py-6'>
                      {isCalculatingPrice ? (
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                          Calculating...
                        </div>
                      ) : (
                        `£${totalPrice}`
                      )}
                    </h6>

                    {/* Payment Type Selection */}
                    <div className='mb-6'>
                      <label className='block text-lg font-medium mb-4'>
                        Choose Payment Option
                      </label>
                      <div className='flex gap-4 justify-center flex-wrap'>
                        <button
                          type='button'
                          onClick={() => setPaymentType("full")}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentType === "full"
                              ? "border-[#FF3388] bg-[#FF3388] text-white"
                              : "border-gray-400 text-gray-400 hover:border-[#FF3388]"
                          }`}>
                          Pay Full Amount
                        </button>
                        <button
                          type='button'
                          onClick={() => setPaymentType("deposit")}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            paymentType === "deposit"
                              ? "border-[#FF3388] bg-[#FF3388] text-white"
                              : "border-gray-400 text-gray-400 hover:border-[#FF3388]"
                          }`}>
                          Pay £20 Deposit
                        </button>
                      </div>
                      {paymentType === "deposit" && (
                        <p className='text-sm text-gray-300 mt-2'>
                          Pay £20 now and the remaining £{balanceDue} later
                        </p>
                      )}
                    </div>

                    <div className='border-t border-white/20 my-4'></div>

                    {/* Payment Summary */}
                    <div className='py-4 space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Base Service Price
                        </span>
                        <div className='text-right'>
                          <span className='font-bold'>£{basePrice}</span>
                          <p className='text-xs text-gray-400'>
                            {getPriceBreakdown()}
                          </p>
                        </div>
                      </div>

                      {distanceInfo && distanceInfo.multiplier > 1 && (
                        <div className='flex justify-between items-center'>
                          <span className='font-medium text-sm md:text-lg'>
                            Travel Fee
                          </span>
                          <div className='text-right'>
                            <span className='font-bold text-yellow-400'>
                              +£{totalPrice - basePrice}
                            </span>
                            <p className='text-xs text-gray-400'>
                              {distanceInfo.distanceMiles} miles from{" "}
                              {distanceInfo.nearestHub}
                              {distanceInfo.reason === "capped" &&
                                " (Maximum fee applied)"}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className='flex justify-between items-center'></div>

                      {priceCalculation?.durationInfo?.minimumApplied && (
                        <div className='flex justify-between items-center bg-yellow-400/20 p-3 rounded-lg'>
                          <span className='font-medium text-sm md:text-lg text-yellow-400'>
                            2-Hour Minimum Applied
                          </span>
                          <div className='text-right'>
                            <p className='text-xs text-yellow-400'>
                              Long distance travel requires minimum 2-hour
                              booking
                            </p>
                          </div>
                        </div>
                      )}

                      {paymentType === "deposit" && (
                        <>
                          <div className='flex justify-between items-center'>
                            <span className='font-medium text-sm md:text-lg'>
                              Deposit Amount
                            </span>
                            <span className='text-right text-green-400 font-bold'>
                              £{depositAmount}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='font-medium text-sm md:text-lg'>
                              Balance Due
                            </span>
                            <span className='text-right text-yellow-400 font-bold'>
                              £{balanceDue}
                            </span>
                          </div>
                          <div className='border-t border-white/20 pt-2'></div>
                        </>
                      )}

                      <div className='flex justify-between items-center border-t border-white/20 pt-2'>
                        <span className='font-medium text-sm md:text-lg'>
                          Total Amount
                        </span>
                        <span className='text-right font-bold text-lg'>
                          £{totalPrice}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Event starts on
                        </span>
                        <span className='text-right'>
                          {secondStep.dateOfEvent} at {secondStep.startTime}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Event Duration
                        </span>
                        <span className='text-right'>
                          {formatDuration(
                            secondStep.durationHours || defaultDuration,
                          )}
                          {priceCalculation?.durationInfo?.minimumApplied &&
                            " (2-hour minimum)"}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Staff
                        </span>
                        <span className='text-right'>
                          {secondStep.numberOfStaff}{" "}
                          {secondStep.numberOfStaff === 1
                            ? "Butler"
                            : "Butlers"}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Location
                        </span>
                        <span className='text-right max-w-[200px] break-words'>
                          {firstStep.location}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-sm md:text-lg'>
                          Service Type
                        </span>
                        <span className='text-right capitalize'>
                          {params?.category}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col items-center gap-4 mt-8 md:mt-12'>
                      <button
                        onClick={handlePayment}
                        style={{ color: "rgba(255,0,106,1)" }}
                        className='px-[16px] py-[8px] w-full md:w-[250px] h-[54px] bg-white rounded-full font-bold text-lg transition-transform duration-200 hover:scale-105 whitespace-nowrap disabled:opacity-50'
                        disabled={
                          isProcessingPayment || isLoading || isCalculatingPrice
                        }>
                        {isProcessingPayment
                          ? "Processing..."
                          : paymentType === "deposit"
                            ? `Pay £${depositAmount} Deposit Now`
                            : `Pay £${totalPrice} Full Amount`}
                      </button>

                      <button
                        onClick={() => {
                          setPaymentMethod("pay_later");
                          setBookingSuccess(true);
                          toast.success("Booking saved! You can pay later.");
                        }}
                        className='text-white hover:text-[#FF3388] transition-colors font-medium underline underline-offset-4'
                        disabled={isProcessingPayment || isLoading}>
                        I'll Pay Later
                      </button>
                    </div>
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

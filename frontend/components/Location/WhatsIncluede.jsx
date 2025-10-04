import React from "react";

const WhatsIncluede = ({ city }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 ">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-6">
        What’s Included with Your {city} Buff Butler Booking
      </h2>

      {/* List */}
      <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
        <li>Handsome, professional butler(s) in traditional cheeky uniform</li>
        <li>1–3 hour bookings available (or more if needed!)</li>
        <li>Hosting, serving drinks, posing for photos & party games</li>
        <li>Optional add-ons: cocktail masterclass, life drawing, strippers</li>
        <li>Available at homes, hotels, apartments & venues across {city}</li>
      </ul>
    </div>
  );
};

export default WhatsIncluede;

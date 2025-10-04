import React from "react";

const WhatsIncluede = ({ city }) => {
  return (
    <div className="max-w-7xl text-center mx-auto py-24 ">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-6">
        What’s Included with Your {city} Buff Butler Booking
      </h2>

      {/* List */}
      <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
        <ul>Handsome, professional butler(s) in traditional cheeky uniform</ul>
        <ul>1–3 hour bookings available (or more if needed!)</ul>
        <ul>Hosting, serving drinks, posing for photos & party games</ul>
        <ul>Optional add-ons: cocktail masterclass, life drawing, strippers</ul>
        <ul>Available at homes, hotels, apartments & venues across {city}</ul>
      </ul>
    </div>
  );
};

export default WhatsIncluede;

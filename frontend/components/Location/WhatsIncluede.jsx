import React from "react";

// Default bullets used by every city that doesn't define its own `whatsIncluded`
// array in locations.json.
const defaultItems = (city) => [
  "Handsome, professional butler(s) in traditional cheeky uniform",
  "1–3 hour bookings available (or more if needed!)",
  "Hosting, serving drinks, posing for photos & party games",
  "Optional add-ons: cocktail masterclass, life drawing, strippers",
  `Available at homes, hotels, apartments & venues across ${city}`,
];

const WhatsIncluede = ({ city, items }) => {
  const listItems = items && items.length > 0 ? items : defaultItems(city);

  return (
    <div className="max-w-7xl text-center mx-auto py-24 ">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A012A] mb-6">
        What’s Included with Your {city} Buff Butler Booking
      </h2>

      {/* List */}
      <ul className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
        {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default WhatsIncluede;

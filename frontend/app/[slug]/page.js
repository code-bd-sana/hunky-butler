import locations from "@/app/locations/locations.json";
import Image from "next/image";
import Link from "next/link";


export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}


export default function LocationPage({ params }) {
  const location = locations.find((loc) => loc.slug === params.slug);

  if (!location) {
    return <div className="p-8 text-center">Location not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-[#0A014F] mb-6">
        {location.name}
      </h1>

      {location.image && (
        <Image
          src={location.image}
          alt={location.name}
          width={800}
          height={400}
          className="rounded-2xl shadow-md mb-6"
        />
      )}

      <p className="text-lg text-gray-700 mb-6">{location.description}</p>
      

      <Link
        href="/location"
        className="inline-block px-6 py-3 bg-[#FF006A] text-white rounded-xl hover:bg-pink-700 transition"
      >
        ← Back to Locations
      </Link>
    </div>
  );
}

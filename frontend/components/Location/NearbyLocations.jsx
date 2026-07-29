import Link from "next/link";

/**
 * Internal links out of a location page: the other services available in the
 * same city, and the neighbouring places we cover.
 *
 * Both lists are resolved against locations.json in the page before they reach
 * this component, so a link is only ever rendered for a page that actually
 * exists. A new city therefore gains inbound links from its neighbours on the
 * day it is published, and we can never ship a link to a 404 in the meantime.
 *
 * Renders nothing at all when there is nothing to link to, so the 30-odd
 * legacy city pages are unaffected.
 */
const NearbyLocations = ({ city, sameCityServices = [], nearbyPlaces = [] }) => {
  if (!sameCityServices.length && !nearbyPlaces.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {sameCityServices.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
            Other Services in {city}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {sameCityServices.map((item) => (
              <li key={item.slug}>
                <Link
                  href={"/" + item.slug}
                  className="inline-block rounded-full border border-[#FF006A] px-5 py-2 font-medium text-[#FF006A] transition-colors hover:bg-[#FF006A] hover:text-white"
                >
                  {item.label} in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {nearbyPlaces.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl">
            Nearby Areas We Cover
          </h2>
          <ul className="flex flex-wrap gap-3">
            {nearbyPlaces.map((item) => (
              <li key={item.slug}>
                <Link
                  href={"/" + item.slug}
                  className="inline-block rounded-full border border-gray-300 px-5 py-2 transition-colors hover:border-gray-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default NearbyLocations;

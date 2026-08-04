import SecondaryTitle from "../shared/typography/SecondaryTitle";

/**
 * Embedded map for a location page.
 *
 * The embed URL matters. www.google.com/maps?...&output=embed is refused in an
 * iframe and renders as an empty grey box, which is what this component was
 * doing. maps.google.com/maps?...&output=embed is the form that renders without
 * needing an API key.
 */
const Map = ({ latitude, longitude, city }) => {
  if (!latitude || !longitude) return null;

  const query = latitude + "," + longitude;
  const mapSrc =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(query) +
    "&z=13&output=embed";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10">
      <div className="mb-6 text-center">
        <SecondaryTitle text1={"Where We Cover in " + (city || "the UK")}  as="h3"/>
      </div>

      <iframe
        src={mapSrc}
        title={"Map of " + (city || "our coverage area")}
        width="100%"
        height="420"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-2xl border"
      ></iframe>
    </div>
  );
};

export default Map;

import SecondaryTitle from "../shared/typography/SecondaryTitle";

const Map = ({ latitude, longitude,city }) => {
  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="w-full h-[400px] mt-20 mb-72 md:mb-[600px]">

        <div className="text-center mb-6">
          <SecondaryTitle
            text1={`Trusted by Thousands of Party Planners in ${city || "UK"}`}
          />
        </div>
     
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg border"
      ></iframe>
    </div>
  );
};

export default Map;

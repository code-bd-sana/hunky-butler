import React from "react";

// Descriptive alt text for each gallery image. Previously these were "pic1"
// through "pic8", which passed automated alt-text checks but carried no SEO or
// accessibility value.
const galleryImages = [
  {
    src: "/ImageGalary/pic1.jpeg",
    alt: "Buff butler serving drinks to guests at a hen party",
  },
  {
    src: "/ImageGalary/pic2.jpeg",
    alt: "Hen party group posing with their buff butler",
  },
  {
    src: "/ImageGalary/pic3.jpeg",
    alt: "Buff butler hosting party games for a celebration",
  },
  {
    src: "/ImageGalary/pic4.jpeg",
    alt: "Buff butler in signature apron and cuffs at a private event",
  },
  {
    src: "/ImageGalary/pic5.jpeg",
    alt: "Hen party guests enjoying drinks served by a topless waiter",
  },
  {
    src: "/ImageGalary/pic6.jpeg",
    alt: "Buff butler entertaining a birthday celebration group",
  },
  {
    src: "/ImageGalary/pic7.jpeg",
    alt: "Group photo with buff butlers at a UK hen party",
  },
  {
    src: "/ImageGalary/pic8.jpeg",
    alt: "Buff butler pouring champagne for hen party guests",
  },
];

const ImageGallery = () => {
  const topRow = galleryImages.slice(0, 4);
  const bottomRow = galleryImages.slice(4, 8);

  const topFlex = [
    "flex-[2] sm:flex-[2] md:flex-[2] lg:flex-[3]",
    "flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[3.5] ",
    "flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[3.5] ",
    "flex-[2] sm:flex-[2] md:flex-[2] lg:flex-[3] ",
  ];

  const bottomFlex = [
    "flex-[2.5] sm:flex-[3] md:flex-[2.5] lg:flex-[4.8] ",
    "flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[4.8] ",
    "flex-[4] sm:flex-[4] md:flex-[4] lg:flex-[4.6] ",
    "flex-[1.5] sm:flex-[2] md:flex-[1.5] lg:flex-[3.6] ",
  ];

  return (
    <div className="w-full">
      <div className=" bg-white flex flex-col items-center justify-center p-1 md:p-4 space-y-1 md:space-y-3 mb-96 md:mb-[500px] my-10 md:my-20">
        {/* Top Row */}
        <div className="flex flex-wrap w-full gap-1 md:gap-3">
          {topRow.map((image, index) => (
            <div key={image.src} className={topFlex[index]}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap w-full  gap-1 md:gap-3">
          {bottomRow.map((image, index) => (
            <div key={image.src} className={bottomFlex[index]}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-28 md:h-40 lg:h-[502px] object-cover rounded-lg md:rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;

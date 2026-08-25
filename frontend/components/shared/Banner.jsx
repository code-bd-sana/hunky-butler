import arrow from "@/public/icons/greaterthan.png";
import TrackedContactLink from "@/components/shared/TrackedContactLink";
import Image from "next/image";
export default function Banner({ service, title, description, image }) {
  console.log(image);
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 13%, rgba(0,0,0,1) 95%), url(${image})`,
      }}
      className="relative h-[620px] w-full overflow-hidden bg-cover bg-center"
    >
      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 text-center">
        {/* Breadcrumbs */}
        <div className="mb-4 flex text-xl gap-[12px] justify-center items-center font-medium text-white">
          <p className="tracking-[-1px]">Home</p>
          <Image
            className="-mb-1"
            alt="arrow"
            src={arrow}
            width={10}
            height={10}
          />
          <p className="tracking-[-1px]">{service}</p>
        </div>

        <h1 className="mb-2 max-w-7xl text-3xl capitalize tracking-[-1px] font-medium text-white md:text-5xl lg:text-[60px]">
          {title}
        </h1>

        <p className="mb-8 mt-4 max-w-7xl text-xs md:text-base lg:text-lg text-white">
          {description}
        </p>
   
          <button className="rounded-full border-2 border-white px-4 py-2 md:px-[24px] md:py-[16px] text-lg font-semibold bg-white text-[#292929]">
           <TrackedContactLink href="tel:+447745865352" method="phone" placement="page_banner">
  Call +44 7745 865352
</TrackedContactLink>
          </button>
   
      </div>
    </div>
  );
}

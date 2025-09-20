import Image from "next/image";
const BlogDetails = () => {
  return (
    <div
      className="py-10 px-4 flex justify-center relative"
      style={{
        backgroundImage: "url('/BlogDetails/blogDetailsBg.png')",
        backgroundSize: "cover", // not backgroundImage: "cover"
        backgroundRepeat: "no-repeat", // optional
        backgroundPosition: "top",
      }}
    >
      <div className="max-w-[1240px] w-full bg-white rounded-2xl shadow-md overflow-hidden  mt-[620px]">
        {/* Top Image */}
        <Image
          src="/Planning/planningPic1.jpeg"
          alt="Cocktail Banner"
          width={1240}
          height={220}
          className="h-[655px] object-cover rounded-[16px] absolute -top-8"
        />

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-[32px] font-bold mb-2">
              Cocktail Making Tools You Need At Home
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Planning a party? Look into experimenting with drinks! Having the
              right tools makes all the difference between a basic drink and a
              professional cocktail. Here are the essential cocktail-making
              tools that can help impress your guests.
            </p>
          </div>

          {/* Cocktail Shaker */}
          <div>
            <h3 className="text-[32px] font-semibold">Cocktail Shaker</h3>
            <p className="text-gray-600 text-lg">
              The heart of every cocktail night. A shaker lets you mix
              ingredients, chill them quickly, and create that perfect frothy
              texture.
            </p>
          </div>

          {/* Jigger */}
          <div>
            <h3 className="text-[32px] font-semibold">
              Jigger (Measuring Tool)
            </h3>
            <p className="text-gray-600 text-lg">
              Consistency is what bartenders do. A jigger helps you measure
              spirits accurately, so your drinks are neither too weak nor too
              strong.
            </p>
            <p className="text-gray-600 text-lg">
              Standard size: 25ml (single) / 50ml (double).
            </p>
          </div>

          {/* Bar Spoon */}
          <div>
            <h3 className="text-[32px] font-semibold">Bar Spoon</h3>
            <p className="text-gray-600 text-lg">
              With its long handle, a bar spoon is perfect for stirring
              cocktails and layering drinks beautifully. It also doubles up for
              gentle muddling.
            </p>
          </div>

          {/* Muddler */}
          <div>
            <h3 className="text-[32px] font-semibold">Muddler</h3>
            <p className="text-gray-600 text-lg">
              Want to release the magic? You’ll need a muddler to crush mint
              leaves, fruits, and sugar without tearing them apart. It releases
              natural flavors for refreshing cocktails.
            </p>
          </div>

          {/* Strainer */}
          <div>
            <h3 className="text-[32px] font-semibold">Strainer</h3>
            <p className="text-gray-600 text-lg">
              Want smoother cocktails? You’ll need a strainer to catch mint
              leaves, fruits, and sugar without tearing them apart. It releases
              natural flavors for refreshing cocktails.
            </p>
          </div>

          {/* Glassware */}
          <div>
            <h3 className="text-[32px] font-semibold">Glassware</h3>
            <p className="text-gray-600 text-lg">
              Every cocktail deserves the right glass. Martini, Highball, or Old
              Fashioned — the right glassware elevates the drinking experience.
            </p>
          </div>

          {/* Try Them Out */}
          <div>
            <h3 className="text-[32px] font-semibold">
              Ready To Try Them Out?
            </h3>
            <p className="text-gray-600 text-lg">
              The right tools can turn your kitchen into your mini cocktail bar.
              But if you’d rather let the experts do the shaking and stirring,
              why not book a cocktail masterclass?
            </p>
          </div>

          <div>
            <p className="text-xl font-bold">
              👉 [Book a Cocktail Masterclass Now]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

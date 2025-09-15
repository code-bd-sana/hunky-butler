'use client'
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import img from '@/public/icons/memoji.png'
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: img,
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: img,
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img:  img,
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img:  img,
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: img,
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: img,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export const ReviewCard = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-full cursor-pointer overflow-hidden rounded-xl bg-white border p-4",
        // light styles
        "bg-white",
        // dark styles
        "bg-white",
      )}
    >
      <div className="flex flex-row items-center gap-2">

       
      </div>
      <div>
        

        {/* review */}

        <section className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#FFAF1B] "/>
            <FaStar className="text-[#FFAF1B] "/>
            <FaStar className="text-[#FFAF1B] "/>
            <FaStar className="text-[#FFAF1B] "/>
            <FaStar className="text-[#FFAF1B] "/>
          </div>

          <div>
           <p className=" leading-[1.4] tracking-[-0.01em]"> 4.5 (345)</p>
          </div>


        </section>


      </div>
      <blockquote className="mt-2 text-2xl max-w-96 py-4 mx-auto">{body}</blockquote>
       <div className="flex flex-col">
           
          <figcaption className="text-sm font-medium dark:text-white">
           <div className="flex justify-between pt-12">
               <div className="flex items-center gap-2">
                   <img className="rounded-full" width="32" height="32" alt="" src={img} />
            {name}
              </div>

              <div>
                <h4 className="font-light text-[#575757]">Client</h4>
              </div>
           </div>
          </figcaption>
        
        
        </div>
    </figure>
  );
};



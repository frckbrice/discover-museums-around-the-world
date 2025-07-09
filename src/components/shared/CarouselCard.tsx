import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      containerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const cards = [
    {
      title: "Travel to Egypt",
      img: "./images/egypt.jpeg",
      text: "Explore the beauty and charm of Egypt.",
    },
    {
      title: "Travel to South Africa",
      img: "./images/south-africa.jpeg",
      text: "Experience the vibrant life and safaris of South Africa.",
    },
    {
      title: "Travel to Cameroon",
      img: "./images/yaounde.jpg",
      text: "Discover Cameroon's rich culture and landscapes.",
    },
    {
      title: "Travel to Nigeria",
      img: "./images/badagry.jpg",
      text: "Explore Nigeria’s vibrant heritage and people.",
    },
  ];

  // Detect active center card
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollLeft, clientWidth } = containerRef.current;
      const center = scrollLeft + clientWidth / 2;

      const cardWidth = 280 + 24; // card width + gap (Tailwind space-x-6 = 1.5rem = 24px)

      const index = Math.round(center / cardWidth) - 1;
      setActiveIndex(Math.max(0, Math.min(index, cards.length - 1)));
    };

    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      // Trigger it once initially
      handleScroll();
    }

    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [cards.length]);

  return (
    <div className="relative w-full lg:w-1/2 px-4">
      {/* Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#5b5a2d] text-white p-2 rounded-full shadow-md hover:bg-[#4e4d24]"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#5b5a2d] text-white p-2 rounded-full shadow-md hover:bg-[#4e4d24]"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden space-x-6 py-6 px-2 snap-x snap-mandatory scroll-smooth"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`min-w-[280px] max-w-[280px] bg-white rounded-xl shadow-xl snap-start cursor-pointer transition-transform duration-300 transform ${index === activeIndex
                ? "scale-105 z-20"
                : "scale-95 opacity-80 z-10"
              }`}
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 text-foreground">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{card.text}</p>
              <button className="mt-auto bg-[#5b5a2d] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-[#4e4d24] transition-all">
                Read More <span>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

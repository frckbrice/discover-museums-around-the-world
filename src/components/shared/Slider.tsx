import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "../../styles/sliders.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  currentSlide?: number;
  slideCount?: number;
}

const GalleryPrevArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div className={className || "custom-prevArrow"} onClick={onClick}>
      <ChevronLeft size={35} style={{ color: "#f4f4f4" }} className="h-5 w-5 bg-primary rounded-full mr-2 hover:bg-slate-900" />
    </div>
  );
};

const GalleryNextArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div className={className || "custom-nextArrow"} onClick={onClick}>
      <ChevronRight size={35} style={{ color: "#f4f4f4" }} className="h-5 w-5 bg-primary rounded-full ml-2 hover:bg-slate-900" />
    </div>
  );
};

const sliderData = [
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

const Sliders: React.FC = () => {
  const slickRef = useRef<Slider | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const settings: Settings = {
    centerMode: true,
    infinite: true,
    centerPadding: "100px",
    slidesToShow: 2,
    speed: 500,
    nextArrow: <GalleryNextArrow />,
    prevArrow: <GalleryPrevArrow />,
    afterChange: (index: number) => setActiveIndex(index),
  };

  return (
    <Slider {...settings} ref={slickRef}>
      {sliderData.map((card, index) => (
        <div
          key={index}
          className={`mx-2 min-w-[220px] max-w-[280px] bg-white rounded-sm shadow-md snap-start cursor-pointer transition-transform duration-300 ${index === activeIndex
              ? "scale-[1.15] z-20"
              : "scale-95 opacity-80 z-10"
            } transform`}
        >
          <img
            src={card.img}
            alt={card.title}
            className="image w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-4 text-center">
            <h4 className="text-lg font-bold mb-2 text-foreground">
              {card.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">{card.text}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Sliders;

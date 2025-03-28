import Image from "next/image";
import { useEffect, useState } from "react";
import GamingInterface from "./ActivityIcon";


interface ImageData {
  url: string;
  alt: string;
  label: string;
}

const GridLayout = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const mockImages: ImageData[] = [
      { url: "/1.jpg", alt: "", label: "Photography" },
      { url: "/2.jpeg", alt: "", label: "Spotted Flower" },
      { url: "/3.jpeg", alt: "", label: "Cactus Flower" },
      { url: "/4.jpeg", alt: "", label: "Flower" },
      { url: "/5.jpeg", alt: "", label: "Yellow Flower" },
    ];

    setImages(mockImages);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-2 gap-6 sm:mx-4">
      {/* Animated Heading */}
      <div className="sr-heading flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">
          Beyond the Code
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white/80">
          Explore my interest & hobbies beyond the digital realm
        </p>
      </div>

      {/* Non-animated Gaming Interface */}
      <div className="flex-grow rounded-md w-full mt-12 h-auto mb-4">
        <GamingInterface />
      </div>
    </div>
  );
};

export default GridLayout;

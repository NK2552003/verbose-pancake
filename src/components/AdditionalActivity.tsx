import Image from "next/image";
import { useEffect, useState } from "react";
import GamingInterface from "./ActivityIcon";
import Cards from "./cards";

interface ImageData {
  url: string;
  alt: string;
  label: string;
}

const GridLayout = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const mockImages: ImageData[] = [
      { url: "./1.jpg", alt: "", label: "Photography" },
      { url: "./2.jpeg", alt: "", label: "Spotted Flower" },
      { url: "./3.jpeg", alt: "", label: "Cactus Flower" },
      { url: "./4.jpeg", alt: "", label: "Flower" },
      { url: "./5.jpeg", alt: "", label: "Yellow Flower" },
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

      {/* Image Grid with Animations */}
      <div className="text-white px-8 rounded-md w-full">
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 overflow-hidden">
          {/* Left Column */}
          <div className="sr-left relative md:rounded-l-xl overflow-hidden h-[200px] sm:h-[400px] rounded-tl-xl rounded-tr-xl sm:rounded-tr-[0px] border-[0.5px] border-white/50">
            {images[0] && (
              <Image
                src={images[0].url}
                alt={images[0].alt}
                width={150}
                height={300}
                className="object-cover w-full h-full"
              />
            )}
            <div className="absolute bottom-2 left-2 text-white/80 font-semibold">
              {images[0]?.label}
            </div>
          </div>

          {/* Middle Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="sr-bottom relative overflow-hidden h-[120px] sm:h-full border-[0.5px] border-white/50">
              {images[1] && (
                <Image
                  src={images[1].url}
                  alt={images[1].alt}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute bottom-2 left-2 text-white/80 font-semibold">
                {images[1]?.label}
              </div>
            </div>
            <div className="sr-bottom relative overflow-hidden h-[120px] sm:h-full border-[0.5px] border-white/50">
              {images[2] && (
                <Image
                  src={images[2].url}
                  alt={images[2].alt}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute bottom-2 left-2 text-white/80 font-semibold">
                {images[2]?.label}
              </div>
            </div>
            <div className="sr-bottom relative overflow-hidden col-span-2 sm:h-auto h-[150px] md:rounded-l-[0px] rounded-bl-xl border-[0.5px] border-white/50 sm:block hidden">
              {images[3] && (
                <Image
                  src={images[3].url}
                  alt={images[3].alt}
                  width={150}
                  height={100}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute bottom-2 left-2 text-white/80 font-semibold">
                {images[3]?.label}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="sr-right relative md:rounded-r-xl overflow-hidden h-[200px] sm:h-[400px] rounded-b-xl sm:rounded-bl-[0px] border-[0.5px] border-white/50">
            {images[4] && (
              <Image
                src={images[4].url}
                alt={images[4].alt}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            )}
            <div className="absolute bottom-2 left-2 text-white/80 font-semibold">
              {images[4]?.label}
            </div>
          </div>
        </div>

        {/* Non-animated Cards Component */}
        <Cards />
      </div>
    </div>
  );
};

export default GridLayout;

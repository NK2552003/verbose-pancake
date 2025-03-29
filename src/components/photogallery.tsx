import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useWillChange } from 'framer-motion';
import Image from 'next/image';

const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });

  const [isMobile, setIsMobile] = useState(false);
  const willChange = useWillChange();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Animation values
  const translateX = useTransform(scrollYProgress, [0, 1], isMobile ? ['10%', '-10%'] : ['20%', '-50%']);
  const translateXOpposite = useTransform(scrollYProgress, [0, 1], isMobile ? ['-10%', '10%'] : ['-20%', '20%']);
  
  // Photo data
  const photos1 = useMemo(() => [
    { id: 1, src: './1.jpg', alt: 'Flower Photography', title: 'Lonely Sunshine' },
    { id: 2, src: './2.jpeg', alt: 'Flower Photography', title: 'Urban Spotted Rose' },
    { id: 3, src: './3.jpeg', alt: 'Flower Photography', title: 'Crown Queen' },
    { id: 4, src: './4.jpeg', alt: 'Flower Photography', title: 'Pink Petals' },
  ], []);

  const photos2 = useMemo(() => [
    { id: 5, src: './5.jpeg', alt: 'Flower Photography', title: 'Golden Dusk' },
    { id: 6, src: './6.jpg', alt: 'Flower Photography', title: 'Red Beauty' },
    { id: 7, src: './7.jpg', alt: 'Flower Photography', title: 'Dandelion' },
    { id: 8, src: './8.jpg', alt: 'Flower Photography', title: 'Purple Queen' },
  ], []);

  const photos3 = useMemo(() => [
    { id: 9, src: './9.jpg', alt: 'Flower Photography', title: 'Red Sunflower Type' },
    { id: 10, src: './10.jpg', alt: 'Mountain Photography', title: 'Mountains' },
    { id: 11, src: './11.jpg', alt: 'Flower Photography', title: 'Yellow Blossom' },
    { id: 12, src: './12.png', alt: 'Mountain Photography', title: 'Mountain in UK' },
  ], []);

  const renderPhoto = useCallback((photo: typeof photos1[number], index: number) => (
    <motion.div
      key={photo.id}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: { 
          duration: 0.4, 
          ease: "easeOut",
          delay: index * 0.03 
        }
      }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      whileHover={{ scale: isMobile ? 1 : 1.03 }}
      className="flex-shrink-0 w-[240px] md:w-[320px] lg:w-[360px] relative group"
      style={{ willChange }}
    >
      <div className="relative pb-[56.25%]">
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gray-100">
          <Image 
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover"
            priority={index < 2}
            loading={index < 2 ? undefined : 'lazy'}
            quality={isMobile ? 75 : 85}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
            <h3 className="text-base md:text-lg font-semibold text-white">{photo.title}</h3>
            <p className="text-gray-200 text-xs md:text-sm mt-1">{photo.alt}</p>
          </div>
        </div>
      </div>
    </motion.div>
  ), [isMobile, willChange]);

  const renderRow = useCallback((
    photos: typeof photos1,
    motionStyle: typeof translateX
  ) => (
    <motion.div 
      style={{ x: motionStyle }} 
      className="flex gap-3 md:gap-6 mb-4 md:mb-6"
      initial={false}
    >
      {photos.map((photo, index) => renderPhoto(photo, index))}
    </motion.div>
  ), [renderPhoto]);

  return (
    <section ref={galleryRef} className="relative w-full bg-transparent py-8 md:py-12 overflow-x-hidden">
      <div className="container mx-auto px-3 md:px-4">
        {renderRow(photos1, translateX)}
        {renderRow(photos2, translateXOpposite)}
        {renderRow(photos3, translateX)}
      </div>
    </section>
  );
};

export default PhotoGallery;
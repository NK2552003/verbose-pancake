import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const photos1 = [
  { id: 1, src: '/1.jpg', alt: 'Flower Photography', title: 'Lonely Sunshine' },
  { id: 2, src: '/2.jpeg', alt: 'Flower Photography', title: 'Urban Spotted Rose' },
  { id: 3, src: '/3.jpeg', alt: 'Flower Photography', title: 'Crown Queen' },
  { id: 4, src: '/4.jpeg', alt: 'Flower Photography', title: 'Pink Peatels' },
];

const photos2 = [
  { id: 5, src: '/5.jpeg', alt: 'Flower Photography', title: 'Golden Dusk' },
  { id: 6, src: '/6.jpg', alt: 'Flower Photography', title: 'Red Beauty' },
  { id: 7, src: '/7.jpg', alt: 'Flower Photography', title: 'Dandelion' },
  { id: 8, src: '/8.jpg', alt: 'Flower Photography', title: 'Purple Queen' },
];

const photos3 = [
  { id: 9, src: '/9.jpg', alt: 'Flower Photography', title: 'Red Sunflower Type' },
  { id: 10, src: '/10.jpg', alt: 'Mountain Photography', title: 'Mountains' },
  { id: 11, src: '/11.jpg', alt: 'Flower Photography', title: 'Yellow Bloosom' },
  { id: 12, src: '/12.png', alt: 'Mountain Photography', title: 'Mountain in Uk' },
];

const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });

  // Animation ranges
  const translateX = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const translateXOpposite = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);

  const renderRow = (photos: typeof photos1, motionStyle: any) => (
    <motion.div 
      style={{ x: motionStyle }} 
      className="flex gap-4 md:gap-8 cursor-grab active:cursor-grabbing mb-6 md:mb-8"
    >
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
          }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } }}
          className="flex-shrink-0 w-[300px] md:w-[400px] relative group"
        >
          <div className="relative pb-[56.25%]">
            <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                priority={index < 3}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-white">{photo.title}</h3>
                <p className="text-gray-200 text-sm md:text-base mt-1">{photo.alt}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section ref={galleryRef} className="relative w-full bg-transparent py-16 overflow-hidden">
      <div className="container">
        {renderRow(photos1, translateX)}
        {renderRow(photos2, translateXOpposite)}
        {renderRow(photos3, translateX)}
      </div>
    </section>
  );
};

export default PhotoGallery;

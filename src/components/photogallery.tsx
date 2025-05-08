import { useEffect, useRef } from 'react';

// Define type for LocomotiveScroll
declare const LocomotiveScroll: any;

interface ImageItem {
  src: string;
  speed: number;
  size: 'normal' | 'big' | 'small';
  orientation: 'vertical' | 'horizontal';
  zIndex: number; // Added z-index property
}

const ScrollAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<any>(null);
  const images = useRef<NodeListOf<Element> | null>(null);

  // Generate random z-index values between 1 and 30
  const generateRandomZIndex = () => Math.floor(Math.random() * 30) + 1;

  const imageItems: ImageItem[] = [
    { src: '/20.jpg', speed: 2, size: 'normal', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/1.jpg', speed: 1, size: 'big', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/3.jpeg', speed: 4, size: 'small', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/4.jpeg', speed: 3, size: 'normal', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/5.jpeg', speed: 2, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/6.jpg', speed: 1, size: 'big', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/7.jpg', speed: 2, size: 'small', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/8.jpg', speed: 4, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/9.jpg', speed: 3, size: 'small', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/10.jpg', speed: 2, size: 'big', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/11.jpg', speed: 1, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/12.png', speed: 3, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/13.jpg', speed: 2, size: 'small', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/14.jpg', speed: 1, size: 'big', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/15.jpg', speed: 2, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/16.jpg', speed: 4, size: 'small', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/17.jpg', speed: 2, size: 'big', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/18.jpg', speed: 3, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/19.jpg', speed: 1, size: 'small', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/20.jpg', speed: 2, size: 'normal', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/21.jpg', speed: 3, size: 'normal', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/22.jpg', speed: 2, size: 'big', orientation: 'horizontal', zIndex: generateRandomZIndex() },
    { src: '/23.jpg', speed: 4, size: 'small', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/24.jpg', speed: 3, size: 'normal', orientation: 'vertical', zIndex: generateRandomZIndex() },
    { src: '/26.jpg', speed: 1, size: 'big', orientation: 'vertical', zIndex: generateRandomZIndex() },
  ];
  
  
  useEffect(() => {
    const initScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;

      scrollRef.current = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: true,
        direction: 'horizontal',
        lerp: 0.05,
      });

      images.current = containerRef.current?.querySelectorAll('.image') ?? null;
      showImages();
    };

    initScroll();

    return () => {
      scrollRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    let horizontalScrollCount = 0; // Counter to track horizontal scrolls
    const maxHorizontalScrolls = 3; // Number of horizontal scrolls before switching to vertical

    const handleWheel = (event: WheelEvent) => {
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (horizontalScrollCount >= maxHorizontalScrolls) {
          // Allow vertical scrolling after the threshold
          return;
        }

        if (
          (container.scrollLeft === 0 && event.deltaY < 0) || // At the start, scrolling up
          (container.scrollLeft === maxScrollLeft && event.deltaY > 0) // At the end, scrolling down
        ) {
          // Increment the counter when reaching the start or end
          horizontalScrollCount++;
          return;
        }

        event.preventDefault(); // Prevent default vertical scrolling
        container.scrollLeft += event.deltaY; // Scroll horizontally based on vertical scroll delta
      }
    };

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true }); // Changed to non-passive
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const showImages = () => {
    images.current?.forEach((image) => {
      image.classList.remove('-clicked');
      image.classList.add('-active');
      (image as HTMLElement).style.opacity = '1'; // Ensure visibility
      (image as HTMLElement).style.pointerEvents = 'auto'; // Enable interaction
    });
  };

  const hideImages = () => {
    images.current?.forEach((image) => {
      image.classList.remove('-active');
      (image as HTMLElement).style.opacity = '0'; // Hide the image
      (image as HTMLElement).style.pointerEvents = 'none'; // Disable interaction
    });
    setTimeout(showImages, 2000);
  };



  return (
    <div className="overflow-hidden">
      {/* Scroll container */}
      <div
        ref={containerRef}
        data-scroll-container
        className="scroll-animations-example"
      >
        <div
          data-scroll-section
          className="py-[10vh] pl-[10vmax] flex items-center relative"
          style={{
            minWidth: `${25 * 100}vh`, // Dynamically set the width for 25 images
          }}
        >
          {imageItems.map((item, index) => (
            <div
              key={index}
              data-scroll
              data-scroll-speed={item.speed}
              className={`inline-flex justify-center items-center mx-[-30vh] ml-12 ${
                item.size === 'big'
                  ? item.orientation === 'horizontal'
                    ? 'h-[60vh] w-[80vh]'
                    : 'h-[80vh] w-[60vh]'
                  : item.size === 'small'
                  ? item.orientation === 'horizontal'
                    ? 'h-[30vh] w-[40vh]'
                    : 'h-[40vh] w-[30vh]'
                  : item.orientation === 'horizontal'
                  ? 'h-[45vh] w-[60vh]'
                  : 'h-[60vh] w-[45vh]'
              }`}
              style={{ zIndex: item.zIndex, position: 'relative' }}
            >
              <img
                src={item.src}
                className="image w-full h-full object-cover transition-all duration-2000 ease-out filter grayscale hover:grayscale-0 opacity-100"
                style={{ 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
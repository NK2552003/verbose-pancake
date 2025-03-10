'use client'; // Mark this as a Client Component in Next.js 13+

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

type LenisWrapperProps = {
  children: ReactNode;
};

export default function LenisWrapper({ children }: LenisWrapperProps) {
  useEffect(() => {
    // Initialize Lenis with smoother settings
    const lenis = new Lenis({
      lerp: 0.05, // Lower value for smoother scrolling
      smoothWheel: true, // Enable smooth scrolling for mouse wheel
      smoothTouch: true, // Enable smooth scrolling for touch devices
      infinite: false, // Disable infinite scrolling
    });

    // Update Lenis on each frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor link and button clicks for smooth scrolling
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the target is an <a> tag or a button (or any other element with a data-href attribute)
      if (
        (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) ||
        (target.tagName === 'BUTTON' && target.getAttribute('data-href')?.startsWith('#'))
      ) {
        event.preventDefault();

        // Get the href from the <a> tag or the data-href attribute from the button
        const href = target.getAttribute('href') || target.getAttribute('data-href');

        if (href) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            lenis.scrollTo(targetElement, {
              duration: 2, // Slightly longer duration for smoother transition
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
              lock: false, // Allow user to scroll during the animation
            });
          }
        }
      }
    };

    // Attach the event listener to the document
    document.addEventListener('click', handleClick);

    // Clean up on unmount
    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <>{children}</>;
}
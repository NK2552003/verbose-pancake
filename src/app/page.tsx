"use client";

import { useEffect, useState, useRef } from "react";
import SplashScreen from "../components/SplashScreen";
import GridLayout from "@/components/AdditionalActivity";
import ProjectsCP from "@/components/codepen";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import HeroSection from "@/components/heroSection";
import ScrollIndicator from "@/components/scrollindicator";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeroCard,
  PortfolioCard,
  AboutCard,
  GridCard,
  TimelineCard,
  ProjectsCard,
  CodepenCard,
  ContactCard,
} from "@/components/popup/cards";
import Skill3dScroll from "@/components/3d_components/skill-3d";
import About3DScroll from "@/components/3d_components/about-3d";

const SectionWrapper = ({
  id,
  children,
  card,
  index,
  setVisibleSections,
  setCurrentSection,
  isAppReady,
}: {
  id: string;
  children: React.ReactNode;
  card?: React.ReactNode;
  index: number;
  setVisibleSections: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  isAppReady: boolean;
}) => {
  const [inView, setInView] = useState(index === 0); // Hero section starts as visible
  const [hasBeenInView, setHasBeenInView] = useState(index === 0); // Hero section starts as viewed
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Don't set up observer until app is ready
    if (!isAppReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) {
          setInView(true);
          setHasBeenInView(true);
          setVisibleSections((prev) => new Set([...prev, index, index + 1]));
          setCurrentSection(index);
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.25,
        // Add rootMargin to prevent immediate firing
        rootMargin: "-10px 0px -10px 0px"
      }
    );

    if (ref.current) {
      // Add a small delay to prevent immediate firing
      const timeoutId = setTimeout(() => {
        if (ref.current) observer.observe(ref.current);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        if (ref.current) observer.unobserve(ref.current);
      };
    }
  }, [index, setVisibleSections, setCurrentSection, isAppReady]);

  return (
    <section id={id} ref={ref} className="snap-start snap-always relative">
      {hasBeenInView && children}

      <AnimatePresence mode="wait">
        {inView && card && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-5 right-8 md:right-18 z-40 px-2 md:py-3 w-[200px] md:w-[250px] max-w-md text-teal-500"
          >
            {card}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]));
  const [currentSection, setCurrentSection] = useState(0);
  const [isAppReady, setIsAppReady] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);

  // Define background colors for each section
  const sectionBackgrounds = [
    "#031412", // Hero
    "#111111", // About
    "#100C08", // Portfolio
    "#131313", // Grid
    "#03171a", // Timeline
    "#04191c", // Projects
    "#011610", // ProjectsCP
    "#031412", // Contact
  ];

  const sections = [
    { id: "hero", content: <HeroSection />, card: <HeroCard /> },
    { id: "about", content: <About3DScroll />, card: <AboutCard /> },
    { id: "portfolio", content: <Skill3dScroll />, card: <PortfolioCard /> },
    { id: "grid", content: <GridLayout />, card: <GridCard /> },
    { id: "timeline", content: <Timeline />, card: <TimelineCard /> },
    { id: "projects", content: <Projects />, card: <ProjectsCard /> },
    { id: "projectscp", content: <ProjectsCP />, card: <CodepenCard /> },
    { id: "contact", content: <ContactSection />, card: <ContactCard /> },
  ];

  // Handle loading completion
  useEffect(() => {
    if (!isLoading) {
      // Set background immediately without transition
      setBackgroundReady(true);
      
      // Enable app interactions after a delay
      const readyTimer = setTimeout(() => {
        setIsAppReady(true);
      }, 300);

      return () => clearTimeout(readyTimer);
    }
  }, [isLoading]);

  return (
    <>
      {showBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-center py-2 z-50 rounded-xl flex justify-center px-4 text-[12px]">
          <span>
            🚧 This site is under development. Some features may not work as
            expected. 🚧
          </span>
        </div>
      )}

      {isLoading ? (
        <SplashScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <>
          <ScrollIndicator totalBars={60} scrollContainerId="scroll-container" />
          
          <main>
            {/* Static Background - Set immediately, no transitions initially */}
            {backgroundReady && (
              <div className="fixed inset-0 z-0">
                <div 
                  className="relative h-full w-full overflow-hidden"
                  style={{ 
                    backgroundColor: sectionBackgrounds[currentSection],
                    transition: isAppReady ? 'background-color 800ms ease-out' : 'none'
                  }}
                >
                  <div className="absolute inset-0 z-0 grid-bg pointer-events-none"></div>
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: `linear-gradient(45deg, ${sectionBackgrounds[currentSection]}00, ${sectionBackgrounds[currentSection]}20)`,
                      transition: isAppReady ? 'background 800ms ease-out' : 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div
              id="scroll-container"
              className="relative z-10 h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
            >
              {sections.map((section, index) => (
                <SectionWrapper
                  key={section.id}
                  id={section.id}
                  card={section.card}
                  index={index}
                  setVisibleSections={setVisibleSections}
                  setCurrentSection={setCurrentSection}
                  isAppReady={isAppReady}
                >
                  {visibleSections.has(index) && section.content}
                </SectionWrapper>
              ))}

              <section id="footer" className="snap-start snap-always relative">
                <Footer />
              </section>
            </div>
          </main>
        </>
      )}
    </>
  );
}
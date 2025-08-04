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
}: {
  id: string;
  children: React.ReactNode;
  card?: React.ReactNode;
  index: number;
  setVisibleSections: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) {
          setInView(true);
          setHasBeenInView(true);
          setVisibleSections((prev) => new Set([...prev, index, index + 1]));
          setCurrentSection(index); // Update current section for background color
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [index, setVisibleSections, setCurrentSection]);

  return (
    <section id={id} ref={ref} className="snap-start snap-always relative">
      {hasBeenInView && children}

      <AnimatePresence>
        {inView && card && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [currentSection, setCurrentSection] = useState(0);

  // Define background colors for each section
  const sectionBackgrounds = [
    "#031412",
    "#111111",
    "#100C08",
    "#131313",
    "#03171a",
    "#04191c",
    "#011610",
    "#031412", 
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

      {!isLoading && (
        <ScrollIndicator totalBars={60} scrollContainerId="scroll-container" />
      )}

      {isLoading ? (
        <SplashScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          {/* Dynamic Background */}
          <div className="fixed inset-0 z-0">
            <div 
              className="relative h-full w-full overflow-hidden transition-colors duration-1000 ease-in-out"
              style={{ 
                backgroundColor: sectionBackgrounds[currentSection] || "#031412" 
              }}
            >
              <div className="absolute inset-0 z-0 grid-bg pointer-events-none"></div>
              
              {/* Optional: Add a subtle gradient overlay for smoother transitions */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000"
                style={{
                  background: `linear-gradient(45deg, ${sectionBackgrounds[currentSection]}00, ${sectionBackgrounds[currentSection]}20)`,
                }}
              />
            </div>
          </div>

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
              >
                {visibleSections.has(index) && section.content}
              </SectionWrapper>
            ))}

            <section id="footer" className="snap-start snap-always relative">
              <Footer />
            </section>
          </div>
        </main>
      )}
    </>
  );
}
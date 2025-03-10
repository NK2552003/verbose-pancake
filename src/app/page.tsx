"use client";

import FluidShader from "../components/fluid-shader";
import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import GridLayout from "@/components/AdditionalActivity";
import ProjectsCP from "@/components/codepen";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import GitHubStats from "@/components/GithubStats";
import Projects from "@/components/projects";
import TerminalSec from "@/components/Terminal";
import Timeline from "@/components/timeline";
import HeroSection from "@/components/heroSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const bannerTimer = setTimeout(() => {
      setShowBanner(false);
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(bannerTimer);
    };
  }, []);

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-1 z-50 flex justify-between px-4 text-[12px]">
          <span>🚧 This site is under development. Some features may not work as expected. 🚧</span>
          <button
            className="text-white font-bold hover:opacity-75"
            onClick={() => setShowBanner(false)}
          >
            ✖
          </button>
        </div>
      )}

      {isLoading ? (
        <SplashScreen onLoaded={handleLoaded} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          <FluidShader />
          <div className="min-h-screen">
            <HeroSection />
            <TerminalSec />
            <GitHubStats />
            <GridLayout />
            <Timeline />
            <Projects />
            <ProjectsCP />
            <ContactSection />
            <Footer />
          </div>
        </main>
      )}
    </>
  );

  function handleLoaded() {
    setIsLoading(false);
  }
}

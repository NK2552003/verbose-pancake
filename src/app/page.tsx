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
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(bannerTimer);
    };
  }, []);

  return (
    <>
      {showBanner && (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-center py-2 z-50  rounded-xl flex justify-center px-4 text-[12px]">
        <span>🚧 This site is under development. Some features may not work as expected. 🚧</span>
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

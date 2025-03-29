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
  const [isHighTier, setIsHighTier] = useState<boolean>(true);

  useEffect(() => {
    const checkDeviceCapability = async () => {
      try {
        const { getGPUTier } = await import('detect-gpu');
        const gpuTier = await getGPUTier();
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsHighTier(!isMobile && gpuTier.tier >= 2);
      } catch (error) {
        console.error('Device check failed:', error);
        setIsHighTier(false);
      }
    };

    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);
    const bannerTimer = setTimeout(() => setShowBanner(false), 2000);
    
    checkDeviceCapability();

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(bannerTimer);
    };
  }, []);

  return (
    <>
      {showBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-center py-2 z-50 rounded-xl flex justify-center px-4 text-[12px]">
          <span>🚧 This site is under development. Some features may not work as expected. 🚧</span>
        </div>
      )}

      {isLoading ? (
        <SplashScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          <div className="fixed inset-0 z-0">
            {isHighTier ? (
              <FluidShader />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#000505] via-[#020D0C] to-[#000505] relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                     style={{ 
                       backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                     }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#031412]/60" />
              </div>
            )}
          </div>
          
          <div className="min-h-screen relative z-10">
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
}
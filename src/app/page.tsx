"use client";

import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import GridLayout from "@/components/AdditionalActivity";
import ProjectsCP from "@/components/codepen";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import GitHubStats from "@/components/GithubStats";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import HeroSection from "@/components/heroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioScroll from "@/components/3d_components/portfolio-scroll";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const fetchGitHubUser = async () => {
  const res = await fetch("/api/github/nk2552003");
  const data = await res.json();
  console.log(data); // avatar_url, public_repos, followers, etc.
};
console.log(fetchGitHubUser);
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
           
        <div className="relative h-full w-full bg-[#031412] overflow-hidden">
  <div className="absolute inset-0 z-0 grid-bg pointer-events-none"></div>
</div>
          </div>

          <div className="min-h-screen relative z-10">
            <HeroSection />
            <div className="border border-white">
              <PortfolioScroll />
            </div>
            <AboutSection/>
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

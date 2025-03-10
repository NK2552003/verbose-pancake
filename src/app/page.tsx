"use client";

import FluidShader from "../components/fluid-shader";
import { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to manage loading

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds delay for the splash screen

    return () => clearTimeout(timer);
  }, []);

  
  return (
    <>
      {isLoading ? (
        <SplashScreen onLoaded={handleLoaded} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          <FluidShader />
          <div className="min-h-screen">
          <HeroSection/>
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

  // Function to handle splash screen loaded event
  function handleLoaded() {
    setIsLoading(false);
  }
}
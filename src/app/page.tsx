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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = () => {
    setIsLoading(false); // This will be called when the SplashScreen finishes loading
  };

  return (
    <div>
      {isLoading ? (
        <SplashScreen onLoaded={handleLoaded} />
      ) : (
        <main className="">
          <FluidShader />
              {/* Gradient Overlay */}
              <div className={` w-[100%] relative transition-all`}>
                <div className="relative h-auto inset-0">
                    <div className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4" id="about">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">A Glimpse Into My World</h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/80">
                            Learn more about who I am, what I do, and what inspires me.
                        </p>
                    </div>
                </div>
            </div>
            <TerminalSec/>
                        <GitHubStats/>
                        <GridLayout/>
                        <Timeline/>
                        <Projects/>
                        <ProjectsCP/>
                        <ContactSection/>
                        <Footer/>
        </main>
      )}
    </div>
  );
}
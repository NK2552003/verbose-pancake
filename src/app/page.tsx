"use client"

import { useState } from "react"
import SplashScreen from "../components/SplashScreen"
import GridLayout from "@/components/AdditionalActivity"
import ProjectsCP from "@/components/codepen"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import GitHubStats from "@/components/GithubStats"
import Projects from "@/components/projects"
import Timeline from "@/components/timeline"
import HeroSection from "@/components/heroSection"
import AboutSection from "@/components/AboutSection"
import PortfolioScroll from "@/components/3d_components/portfolio-scroll"
import ScrollIndicator from "@/components/scrollindicator"


export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showBanner, setShowBanner] = useState<boolean>(true)

  return (
    <>
      {showBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-center py-2 z-50 rounded-xl flex justify-center px-4 text-[12px]">
          <span>🚧 This site is under development. Some features may not work as expected. 🚧</span>
        </div>
      )}

      {!isLoading &&<ScrollIndicator totalBars={60} scrollContainerId="scroll-container" />}

      {isLoading ? (
        <SplashScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          <div className="fixed inset-0 z-0">
            <div className="relative h-full w-full bg-[#031412] overflow-hidden">
              <div className="absolute inset-0 z-0 grid-bg pointer-events-none"></div>
            </div>
          </div>

          {/* Scrollable container */}
          <div
            id="scroll-container"
            className="relative z-10 h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
          >
            <section className="snap-start snap-always">
              <HeroSection />
            </section>

            <section className="snap-start snap-always border border-white">
              <PortfolioScroll />
            </section>

            <section className="snap-start snap-always">
              <AboutSection />
            </section>

            <section className="snap-start snap-always">
              <GitHubStats />
            </section>

            <section className="snap-start snap-always">
              <GridLayout />
            </section>

            <section className="snap-start snap-always">
              <Timeline />
            </section>

            <section className="snap-start snap-always">
              <Projects />
            </section>

            <section className="snap-start snap-always">
              <ProjectsCP />
            </section>

            <section className="snap-start snap-always">
              <ContactSection />
            </section>
            <section className="snap-start snap-always">
                    <Footer />
            </section>
          </div>
        </main>
      )}
    </>
  )
}

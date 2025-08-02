"use client"

import { useEffect, useState } from "react"
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
import { AnimatePresence, motion } from "framer-motion"
import { HeroCard, PortfolioCard, AboutCard, GitHubCard, GridCard, TimelineCard, ProjectsCard, CodepenCard, ContactCard } from "@/components/popup/cards"


const SectionWrapper = ({
  id,
  children,
  card,
}: {
  id: string
  children: React.ReactNode
  card?: React.ReactNode
}) => {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = document.getElementById(id)
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [id])

  return (
    <section id={id} className="snap-start snap-always relative">
      {children}

      <AnimatePresence>
        {inView && card && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-5 right-8 md:right-18 z-40 shadow-md px-2 md:py-3 w-[200px] md:w-[250px] max-w-md text-teal-500"
          >
            {card}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showBanner, setShowBanner] = useState<boolean>(true)

  return (
    <>
      {showBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-center py-2 z-50 rounded-xl flex justify-center px-4 text-[12px]">
          <span>
            🚧 This site is under development. Some features may not work as expected. 🚧
          </span>
        </div>
      )}

      {!isLoading && <ScrollIndicator totalBars={60} scrollContainerId="scroll-container" />}

      {isLoading ? (
        <SplashScreen onLoaded={() => setIsLoading(false)} />
      ) : (
        <main className="transition-opacity duration-1000 ease-in-out">
          <div className="fixed inset-0 z-0">
            <div className="relative h-full w-full bg-[#031412] overflow-hidden">
              <div className="absolute inset-0 z-0 grid-bg pointer-events-none"></div>
            </div>
          </div>

          <div
            id="scroll-container"
            className="relative z-10 h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
          >
            <SectionWrapper id="hero" card={<HeroCard />}>
              <HeroSection />
            </SectionWrapper>

            <SectionWrapper id="portfolio" card={<PortfolioCard />}>
              <PortfolioScroll />
            </SectionWrapper>

            <SectionWrapper id="about" card={<AboutCard />}>
              <AboutSection />
            </SectionWrapper>

            <SectionWrapper id="github-stats" card={<GitHubCard />}>
              <GitHubStats />
            </SectionWrapper>

            <SectionWrapper id="grid" card={<GridCard />}>
              <GridLayout />
            </SectionWrapper>

            <SectionWrapper id="timeline" card={<TimelineCard />}>
              <Timeline />
            </SectionWrapper>

            <SectionWrapper id="projects" card={<ProjectsCard />}>
              <Projects />
            </SectionWrapper>

            <SectionWrapper id="projectscp" card={<CodepenCard />}>
              <ProjectsCP />
            </SectionWrapper>

            <SectionWrapper id="contact" card={<ContactCard />}>
              <ContactSection />
            </SectionWrapper>

             <section id="footer" className="snap-start snap-always relative">
              <Footer/>
    </section>
          </div>
        </main>
      )}
    </>
  )
}

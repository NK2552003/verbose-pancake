"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import TurbineWheel3D from "./turbine-wheel-3d"
import SkillList from "./skill-indicator"
import GitHubList from "./github-stats"

interface PartPosition {
  id: string
  position: any
  screenPosition: { x: number; y: number }
}

const skills = [
  { name: "React", size: "4.2 KB", color: "#61dafb", partType: "blade" },
  { name: "TypeScript", size: "3.8 KB", color: "#3178c6", partType: "blade" },
  { name: "Three.js", size: "2.1 KB", color: "#ffffff", partType: "blade" },
  { name: "Next.js", size: "5.4 KB", color: "#ffffff", partType: "blade" },
  { name: "Node.js", size: "3.2 KB", color: "#339933", partType: "blade" },
  { name: "Python", size: "2.8 KB", color: "#3776ab", partType: "blade" },
  { name: "Docker", size: "1.9 KB", color: "#2496ed", partType: "blade" },
  { name: "AWS", size: "4.1 KB", color: "#ff9900", partType: "blade" },
]

const githubStats = [
  { label: "Repositories", value: "42", color: "#3b82f6", partType: "hole" },
  { label: "Total Commits", value: "1.2K", color: "#10b981", partType: "hole" },
  { label: "Stars Earned", value: "156", color: "#f59e0b", partType: "hole" },
  { label: "Followers", value: "89", color: "#8b5cf6", partType: "hole" },
]

export default function PortfolioScroll() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [visibleSkills, setVisibleSkills] = useState<number[]>([])
  const [visibleGitHubStats, setVisibleGitHubStats] = useState<number[]>([])
  const [partPositions, setPartPositions] = useState<PartPosition[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePartPositionsUpdate = useCallback((positions: PartPosition[]) => {
    setPartPositions(positions)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      const progress = Math.min(scrollTop / scrollHeight, 1)

      setScrollProgress(progress)

      // Determine current section
      if (progress < 0.33) {
        setCurrentSection(0) // Hero section
      } else if (progress < 0.66) {
        setCurrentSection(1) // Skills section
      } else {
        setCurrentSection(2) // Contact section
      }

      // Show skills progressively only in section 1 (when disassembled)
      if (progress >= 0.33 && progress < 0.66) {
        const sectionProgress = (progress - 0.33) / 0.33
        const skillsToShow = Math.min(Math.floor(sectionProgress * skills.length * 1.5), skills.length)
        setVisibleSkills(Array.from({ length: skillsToShow }, (_, i) => i))
      } else {
        setVisibleSkills([])
      }

      // Show GitHub stats only in section 2 (when disassembled, but not reassembling)
      if (progress >= 0.66 && progress < 0.9) {
        const sectionProgress = (progress - 0.66) / 0.24
        const githubStatsToShow = Math.min(Math.floor(sectionProgress * githubStats.length * 2), githubStats.length)
        setVisibleGitHubStats(Array.from({ length: githubStatsToShow }, (_, i) => i))
      } else {
        // Hide during reassembly (progress >= 0.9) and other sections
        setVisibleGitHubStats([])
      }
    }

    const smoothScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    container.addEventListener("scroll", smoothScroll, { passive: true })
    return () => container.removeEventListener("scroll", smoothScroll)
  }, [])

  const rotationSpeed = 0

  return (
    <div className="w-full h-screen bg-transparent relative overflow-hidden">
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Content that creates scroll height */}
        <div className="h-[300vh] relative">
          {/* Fixed 3D Scene - positioned relative to the component container */}
          <div className="sticky top-0 w-full h-screen pointer-events-none">
            <div className="w-full h-full relative">
              <TurbineWheel3D
                scrollProgress={scrollProgress}
                rotationSpeed={rotationSpeed}
                onPartPositionsUpdate={handlePartPositionsUpdate}
              />
            </div>
          </div>

          {/* Content Sections */}
          <div className="pointer-events-none">
            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-8 sm:py-12 transition-all duration-1000 ease-out">
              <div
                className={`w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl pointer-events-auto text-center transform transition-all duration-700 ease-out ${
                  currentSection === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Full Stack
                  <br />
                  Developer
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                  Building modern web applications with cutting-edge technologies and clean, efficient code.
                </p>
                <div className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6 md:mb-8">
                  Scroll to see the turbine disassemble and explore my skills
                </div>

                {/* Hero-specific indicators */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm border border-blue-500/30">
                    React Expert
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs sm:text-sm border border-green-500/30">
                    Full Stack
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm border border-purple-500/30">
                    3D Graphics
                  </span>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-8 sm:py-12 transition-all duration-1000 ease-out">
              <div
                className={`w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl pointer-events-auto text-center transform transition-all duration-700 ease-out ${
                  currentSection === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Technical
                  <br />
                  Expertise
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                  Watch as each turbine blade reveals a specialized skill. Each component represents mastery in modern web
                  technologies.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span>Frontend: React, TypeScript, Three.js</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span>Backend: Node.js, Python, Docker</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <span>Cloud: AWS, Vercel, Serverless</span>
                  </div>
                </div>
              </div>
            </section>
      
          </div>
        </div>
      </div>

      {/* Skill List Component - positioned relative to component */}
      <div className="absolute inset-0 pointer-events-none">
        <SkillList
          skills={skills}
          partPositions={partPositions}
          visibleSkills={visibleSkills}
          currentSection={currentSection}
        />
      </div>

      {/* GitHub List Component - positioned relative to component */}
      <div className="absolute inset-0 pointer-events-none">
        <GitHubList
          githubStats={githubStats}
          partPositions={partPositions}
          visibleGitHubStats={visibleGitHubStats}
          currentSection={currentSection}
        />
      </div>

      {/* Progress Indicator - positioned relative to component */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-3 sm:right-4 md:right-6 lg:right-8 pointer-events-none z-30">
        <div className="w-1 sm:w-2 h-16 sm:h-20 md:h-24 lg:h-32 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="w-full bg-white transition-all duration-500 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Section Indicator - positioned relative to component */}
      <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 right-3 sm:right-4 md:right-6 lg:right-8 pointer-events-none z-30">
        <div className="flex flex-col gap-1 sm:gap-2">
          {["Hero", "Skills", "Contact"].map((label, index) => (
            <div
              key={label}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                currentSection === index ? "bg-white text-black" : "bg-gray-700/50 text-gray-400"
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assembly Status Indicator - positioned relative to component */}
      <div className="absolute top-1/2 left-3 sm:left-4 md:left-6 lg:left-8 transform -translate-y-1/2 pointer-events-none z-30">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              scrollProgress < 0.33 ? "bg-green-400" : scrollProgress < 0.9 ? "bg-yellow-400" : "bg-green-400"
            }`}
          />
          <div className="text-xs text-gray-400 writing-mode-vertical-rl text-orientation-mixed">
            {scrollProgress < 0.33 ? "ASSEMBLED" : scrollProgress < 0.9 ? "DISASSEMBLED" : "REASSEMBLING"}
          </div>
        </div>
      </div>
    </div>
  )
}
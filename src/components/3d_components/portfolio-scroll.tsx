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
        setVisibleSkills([])
        setVisibleGitHubStats([])
      } else if (progress < 0.66) {
        setCurrentSection(1) // Skills section
        setVisibleSkills(Array.from({ length: skills.length }, (_, i) => i))
        setVisibleGitHubStats([])
      } else {
        setCurrentSection(2) // Contact section
        setVisibleSkills([])
        setVisibleGitHubStats(Array.from({ length: githubStats.length }, (_, i) => i))
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
        <div className="h-[200vh] relative">
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
        <div className="w-1 sm:w-2 h-16 sm:h-20 md:h-24 lg:h-32 bg-gray-700/50 rounded overflow-hidden backdrop-blur-sm">
          <div
            className="w-full bg-teal-500 transition-all duration-500 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Assembly Status Indicator - positioned relative to component */}
      <div className="absolute top-12 left-3 sm:left-4 md:left-6 lg:left-8 transform -translate-y-1/2 pointer-events-none z-30">
        <div className="flex flex-row items-center gap-2">
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
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import SkillList from "./skill_components/skill-indicator"
import GitHubList from "./skill_components/github-stats"
import BundleSizeCard from "../popup/bundlesizecard"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import FinalAssemblyCard from "./skill_components/finalassembly"
import RocketEngineComponent from "./threejs-models/rocket-engine"
import ProfileCard from "./about_components/profile_card"
import HobbyIndicator from "./about_components/hobbies_indicator"

interface PartPosition {
  id: string
  position: any
  screenPosition: { x: number; y: number }
}

const hobbies = [
  {
    name: "Photography",
    icon: "Camera",
    color: "#f59e0b",
    description: "Capturing moments and landscapes through my lens",
    partType:"tank"
  },
  {
    name: "Music Production",
    icon: "Music",
    color: "#8b5cf6",
    description: "Creating electronic music and beats in my studio",
    partType:"bell"
  },
  {
    name: "Gaming",
    icon: "Gamepad2",
    color: "#10b981",
    description: "Exploring virtual worlds and competitive gaming",
    partType:"nozzles"
  },
  { name: "Reading", icon: "Book", color: "#3b82f6", description: "Diving into sci-fi novels and tech literature",partType:"exhaust" },
  {
    name: "Coffee",
    icon: "Coffee",
    color: "#92400e",
    description: "Brewing the perfect cup and exploring coffee culture",
    partType:"internals"
  },
]

const githubStats = [
  { label: "Repositories", value: "42", color: "#3b82f6", partType: "hole" },
  { label: "Total Commits", value: "1.2K", color: "#10b981", partType: "hole" },
  { label: "Stars Earned", value: "156", color: "#f59e0b", partType: "hole" },
  { label: "Followers", value: "89", color: "#8b5cf6", partType: "hole" },
]

export default function About3DScroll() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [visibleHobbies, setVisibleHobbies] = useState<number[]>([])
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

      // Determine current section and visibility
      if (progress < 0.4) {
        setCurrentSection(0) // Hero section
        setVisibleHobbies([])
        setVisibleGitHubStats([])
      } else if (progress < 0.66) {
        setCurrentSection(1) // Skills section
        setVisibleHobbies(Array.from({ length: hobbies.length }, (_, i) => i))
        setVisibleGitHubStats([])
      } else if (progress < 0.9) {
        setCurrentSection(2) // GitHub section
        setVisibleHobbies([])
        setVisibleGitHubStats(Array.from({ length: githubStats.length }, (_, i) => i))
      } else {
        setCurrentSection(3) // Reassembling section
        setVisibleHobbies([])
        setVisibleGitHubStats([]) // ✅ Ensure GitHub cards disappear
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
          {/* Fixed 3D Scene */}
          <div className="sticky top-0 w-full h-screen pointer-events-none">
            <div className="w-full h-full relative">
              <RocketEngineComponent
                scrollProgress={scrollProgress}
                rotationSpeed={rotationSpeed}
                onPartPositionsUpdate={handlePartPositionsUpdate}
              />
            </div>
          </div>
        </div>
      </div>
          {/* Introductory Cards (top-left and bottom-left) */}
      {scrollProgress < 0.33 && (
        <>
          {/* Top-left card */}
        <ProfileCard/>

       <motion.div 
  className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 px-4 py-3 text-xs sm:text-sm pointer-events-none w-auto"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
>
  <div className="text-white/60 flex items-center gap-2">
    <span>Scroll down <span className="hidden md:inline">to see who i am</span></span>
    <motion.div
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChevronDown className="text-white/60" size={16} />
    </motion.div>
  </div>
</motion.div>
        </>
      )}

      {/* Skill List */}
      <div className="absolute inset-0 pointer-events-none">
        <HobbyIndicator
          hobbies={hobbies}
          partPositions={partPositions}
          visibleHobbies={visibleHobbies}
          currentSection={currentSection}
        />
      </div>

      {/* GitHub List */}
      <div className="absolute inset-0 pointer-events-none">
        <GitHubList
          githubStats={githubStats}
          partPositions={partPositions}
          visibleGitHubStats={visibleGitHubStats}
          currentSection={currentSection}
        />
      </div>
      {/* Final Assembly Card */}
{scrollProgress >= 0.9 && (
  <motion.div
    className="absolute bottom-10 left-8 z-30"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <FinalAssemblyCard />
  </motion.div>
)}
      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-3 sm:right-4 md:right-6 lg:right-8 pointer-events-none z-30">
        <div className="w-1 sm:w-2 h-16 sm:h-20 md:h-24 lg:h-32 bg-gray-700/50 rounded overflow-hidden backdrop-blur-sm">
          <div
            className="w-full bg-teal-500 transition-all duration-500 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Assembly Status Indicator */}
      <div className="absolute top-10 left-3 sm:left-4 md:left-6 pointer-events-none z-30 items-center justify-center">
        <div className="flex flex-row items-center gap-2 justify-center">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              scrollProgress < 0.33
                ? "bg-green-400"
                : scrollProgress < 0.9
                ? "bg-yellow-400"
                : "bg-green-400"
            }`}
          />
          <div className="text-xs text-gray-400">
            {scrollProgress < 0.33
              ? "ASSEMBLED"
              : scrollProgress < 0.9
              ? "DISASSEMBLED"
              : "REASSEMBLED"}
          </div>
        </div>
      </div>
    </div>
  )
}

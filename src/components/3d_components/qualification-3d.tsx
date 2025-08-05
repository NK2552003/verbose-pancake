"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import HotAirBalloonComponent from "./threejs-models/hot-air-ballon"
import BundleSizeCard from "../popup/bundlesizecard"
import { ChevronDown, GraduationCap, LandPlot, Laptop2Icon, School, University } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PartPosition {
  id: string
  position: any
  screenPosition: { x: number; y: number }
}

interface TimelineItem {
  id: number
  title: string
  date: string
  description: string
  partId: string
  icon:any
  skills:string[]
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Secondary School",
    date: "2018-2019",
    description:
      "Completed 10th grade at Honey Modern High School (HBSE), focusing on math, science, and social studies. Scored 87.6%, laying a strong foundation for future studies.",
    partId: "balloon",
    icon: <School />,
    skills: ["Mathematics basics", "Science fundamentals", "Analytical thinking", "Time management"]
  },
  {
    id: 2,
    title: "Senior Secondary School",
    date: "2020-2021",
    description:
      "Finished 12th at Hindu Sr. Sec. School (CBSE) with focus on PCM and computer science. Achieved 80.2%, securing admission into a B.Tech program.",
    partId: "basket",
    icon: <GraduationCap />,
    skills: ["Physics", "Chemistry", "Mathematics", "Basic programming", "Problem-solving"]
  },
  {
    id: 3,
    title: "Web Development Internship",
    date: "Aug-Oct 2023",
    description:
      "Completed a web dev internship via Internshala, working with HTML, CSS, JS, React, and Node.js. Scored 67% for practical project contributions.",
    partId: "rope1",
    icon: <Laptop2Icon/>,
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "Team collaboration"]
  },
  {
    id: 4,
    title: "Flutter & Dart Course",
    date: "Apr-Jun 2024",
    description:
      "Completed a Flutter & Dart course on Udemy, learning to build cross-platform mobile apps with responsive UI, state management, and API integration.",
    partId: "rope2",
    icon: <LandPlot />,
    skills: ["Flutter", "Dart", "Mobile UI design", "State management", "REST APIs"]
  },
  {
    id: 5,
    title: "React Course",
    date: "July 2025",
    description:
      "Pursuing an advanced React course covering components, hooks, state, and SPA architecture to build scalable, responsive web apps.",
    partId: "rope1",
    icon: <LandPlot />,
    skills: ["Advanced React", "Hooks", "Component architecture", "SPA development", "Performance optimization"]
  },
  {
    id: 6,
    title: "UnderGraduation 2022-2026",
    date: "2022-2026",
    description:
      "Currently pursuing B.Tech CSE at Tula's Institute, Dehradun (VMSBUTU). CGPA: 7.5 (1st year), 7.69 (2nd year), building skills in programming and software development.",
    partId: "balloon",
    icon: <University />,
    skills: ["Data Structures", "OOP", "DBMS", "Computer Networks", "Python", "Java", "Software engineering"]
  }
];



// Timeline Item Component with Fixed SVG Connection Lines
interface TimelineCardProps {
  item: TimelineItem
  partPositions: PartPosition[]
  isVisible: boolean
  onExit?: () => void
}

function TimelineCard({ item, partPositions, isVisible, onExit }: TimelineCardProps) {
  // Find the corresponding part position
  const partPosition = partPositions.find(p => p.id === item.partId)
  
  // Calculate card position based on part position
const getCardPosition = () => 'left' // or 'right'


  const position = getCardPosition()
  
  // Calculate connection line coordinates
  const getConnectionCoordinates = () => {
    if (!partPosition || !partPosition.screenPosition) return null
    
    const { x: partX, y: partY } = partPosition.screenPosition
    
    // Card position (approximate based on actual card placement)
    const cardOffset = 32 // 8 * 4 (left-8/right-8 in Tailwind)
    const cardWidth = 384 // max-w-sm is approximately 384px
    const cardX = position === 'left' 
      ? cardOffset + cardWidth / 2 
      : (typeof window !== 'undefined' ? window.innerWidth : 1920) - cardOffset - cardWidth / 2
    const cardY = (typeof window !== 'undefined' ? window.innerHeight : 1080) - 160 // bottom-10 + card height estimate
    
    return {
      partX,
      partY,
      cardX,
      cardY
    }
  }

  if (!isVisible) return null

  const connectionCoords = getConnectionCoordinates()

  return (
    <>
<div key={item.id}>

<AnimatePresence>
  {item.skills && (
    <motion.ul
      className="absolute left-4 top-28 md:left-6 md:top-24 text-white/80 flex flex-col gap-2 text-xs md:text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {item.skills.map((skill, index) => (
        <motion.li
          key={skill + index}
          className="w-auto border border-white/30 px-3 py-1 rounded-xl"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
        >
          {skill}
        </motion.li>
      ))}
    </motion.ul>
  )}
</AnimatePresence>

      {/* Main Timeline Card */}
   <motion.div
  className="absolute bottom-4 md:bottom-8 z-30 pointer-events-auto left-4 w-[90%] md:w-auto"
  initial={{ opacity: 0, x: -100, y: 0 }}     // Enters from left
  animate={{ opacity: 1, x: 0, y: 0 }}        // Settles in place
  exit={{ opacity: 0, y: 100 }}               // Exits downward
  transition={{ 
    duration: 0.6,
    type: "spring",
    stiffness: 100,
    damping: 20
  }}
  onAnimationComplete={onExit}
>
  <div className="bg-[#03171a] border border-white/20 rounded-xl p-4 max-w-sm">
    {/* Date */}
    <div className="pb-1 flex gap-2 items-center">
      <div className="text-blue-300 border border-blue-300/40 p-1 rounded-lg">{item.icon}</div>
      <span className="text-blue-300 text-sm md:text-lg font-medium">{item.date}</span>
    </div>

    {/* Description */}
    <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
      {item.description}
    </p>
  </div>
</motion.div>
</div>


      {/* SVG Connection Line Overlay */}
{connectionCoords && (
  <motion.svg
    className="absolute inset-0 w-full h-full pointer-events-none z-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
  >
    {/* Main connection line with curve */}
    <motion.path
      d={`M ${connectionCoords.partX} ${connectionCoords.partY} 
          Q ${(connectionCoords.partX + connectionCoords.cardX) / 2} ${Math.min(connectionCoords.partY, connectionCoords.cardY) - 50}
          ${connectionCoords.cardX} ${connectionCoords.cardY}`}
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="2"
      fill="none"
      strokeDasharray="8 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
    >
    </motion.path>

    {/* Glowing dot at the 3D model part */}
    <motion.circle
      cx={connectionCoords.partX}
      cy={connectionCoords.partY}
      r="6"
      fill="#60a5fa"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <animate
        attributeName="r"
        values="4;8;4"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.6;1;0.6"
        dur="2s"
        repeatCount="indefinite"
      />
    </motion.circle>

    {/* Pulse ring around the dot */}
    <motion.circle
      cx={connectionCoords.partX}
      cy={connectionCoords.partY}
      r="12"
      fill="none"
      stroke="#60a5fa"
      strokeWidth="2"
      opacity="0.4"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.5, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: 1,
        ease: "easeOut"
      }}
    />

    {/* Connection point at card */}
    <motion.circle
      cx={connectionCoords.cardX}
      cy={connectionCoords.cardY}
      r="4"
      fill="#a855f7"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    />
  </motion.svg>
)}

    </>
  )
}

export default function Qualification3dScroll() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(-1)
  const [previousTimelineIndex, setPreviousTimelineIndex] = useState(-1)
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

      // Store previous index before updating
      setPreviousTimelineIndex(currentTimelineIndex)

      // Determine which timeline item to show based on scroll progress
      let timelineIndex = -1
      
      if (progress < 0.1) {
        timelineIndex = -1
      } else if (progress < 0.25) {
        timelineIndex = 0
      } else if (progress < 0.4) {
        timelineIndex = 1
      } else if (progress < 0.55) {
        timelineIndex = 2
      } else if (progress < 0.7) {
        timelineIndex = 3
      } else if (progress < 0.85) {
        timelineIndex = 4
      } else {
        timelineIndex = 5
      }

      setCurrentTimelineIndex(timelineIndex)
    }

    const smoothScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    container.addEventListener("scroll", smoothScroll, { passive: true })
    return () => container.removeEventListener("scroll", smoothScroll)
  }, [currentTimelineIndex])

  // Get current timeline item name for section indicator
  const getCurrentSectionName = () => {
    if (currentTimelineIndex === -1) return "Introduction"
    return timelineData[currentTimelineIndex]?.title || "Introduction"
  }

  const rotationSpeed = 0.001

  return (
    <div className="w-full h-screen bg-transparent relative overflow-hidden">
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Content that creates scroll height */}
        <div className="h-[500vh] relative">
          {/* Fixed 3D Scene */}
          <div className="sticky top-0 w-full h-screen pointer-events-none">
            <div className="w-full h-full relative">
              <HotAirBalloonComponent
                scrollProgress={scrollProgress}
                rotationSpeed={rotationSpeed}
                onPartPositionsUpdate={handlePartPositionsUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Indicator */}
      <div className="absolute top-14 md:top-26 right-auto left-4 md:left-auto md:right-21 pointer-events-none z-30">
        <div className="text-start md:text-right">
          <div className="text-xs text-gray-400">
            {currentTimelineIndex + 2} of {timelineData.length + 1}
          </div>
          <div className="text-sm text-white font-medium">
            {getCurrentSectionName()}
          </div>
        </div>
      </div>

      {/* Introductory Cards */}
      <AnimatePresence mode="wait">
        {scrollProgress < 0.1 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BundleSizeCard/>

            <motion.div 
              className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 px-4 py-3 text-xs sm:text-sm pointer-events-none w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-white/60 flex items-center gap-2">
                <span>Scroll down <span className="hidden md:inline">to explore my journey</span></span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="text-white/60" size={16} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Cards with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {currentTimelineIndex >= 0 && (
          <TimelineCard
            key={`timeline-${currentTimelineIndex}`}
            item={timelineData[currentTimelineIndex]}
            partPositions={partPositions}
            isVisible={true}
          />
        )}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-3 sm:right-4 md:right-6 lg:right-8 pointer-events-none z-30">
        <div className="w-1 sm:w-2 h-16 sm:h-20 md:h-24 lg:h-32 bg-gray-700/50 rounded overflow-hidden backdrop-blur-sm">
          <motion.div
            className="w-full bg-[#17acc3]"
            animate={{ height: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Journey Progress Indicator */}
      <div className="absolute top-6 md:top-10 left-3 sm:left-4 md:left-6 pointer-events-none z-30 items-center justify-center">
        <div className="flex flex-row items-center gap-2 justify-center">
          <motion.div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              currentTimelineIndex === -1
                ? "bg-blue-400 animate-pulse"
                : currentTimelineIndex < timelineData.length - 1
                ? "bg-yellow-400 animate-pulse"
                : "bg-green-400 animate-pulse"
            }`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-gray-400">
            {currentTimelineIndex === -1
              ? "READY TO EXPLORE"
              : currentTimelineIndex < timelineData.length - 1
              ? "JOURNEY IN PROGRESS"
              : "JOURNEY COMPLETE"}
          </div>
        </div>
      </div>
    </div>
  )
}
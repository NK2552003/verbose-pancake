"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Camera, Music, Gamepad2, Book, Plane, Coffee } from "lucide-react"
import { useState, useEffect } from "react"

interface Hobby {
  name: string
  icon: keyof typeof iconMap
  color: string
  description: string
  partType:string
}

interface HobbyIndicatorProps {
  hobbies: Hobby[]
  currentSection: number
  visibleHobbies: number[]
   partPositions: Array<{
    id: string
    position: any
    screenPosition: { x: number; y: number }
  }>
}

const iconMap = {
  Camera,
  Music,
  Gamepad2,
  Book,
  Plane,
  Coffee,
}

export default function HobbyIndicator({
  hobbies,
  currentSection,
  partPositions,
  visibleHobbies,
}: HobbyIndicatorProps) {
  if (currentSection !== 1) return null
      const [animatedHobbies, setAnimatedHobbies] = useState<number[]>([])
    
      useEffect(() => {
        if (currentSection === 1) {
          setAnimatedHobbies(visibleHobbies.filter((index) => index >= 0 && index < hobbies.length))
        } else {
          setAnimatedHobbies([])
        }
      }, [visibleHobbies, currentSection, hobbies])
    
      const getPartPosition = (partType: string, index: number) => {
        const filteredParts = partPositions.filter((p) => p.id.startsWith(partType))
        if (filteredParts[index % filteredParts.length]) {
          return filteredParts[index % filteredParts.length].screenPosition
        }
        return { x: 50, y: 50 }
      }
    
      if (currentSection !== 1 || animatedHobbies.length === 0) return null
  return (
    <div className="absolute bottom-0 left-0 w-full z-20 px-4 pb-4 pointer-events-none">
      <AnimatePresence>
        <motion.div
          layout
          className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {visibleHobbies.map((hobbyIndex) => {
            const hobby = hobbies[hobbyIndex]
            if (!hobby) return null

            return (
              <motion.div
                key={`hobby-${hobbyIndex}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: hobbyIndex * 0.1 }}
              >
                <HobbyCard hobby={hobby} />
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
        {/* 🧵 SVG Connecting Lines */}
      <svg className="fixed inset-0 pointer-events-none z-10" style={{ width: "100vw", height: "100vh" }}>
        <defs>
          <linearGradient id="skillGridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(156, 163, 175, 0.8)" />
            <stop offset="100%" stopColor="rgba(156, 163, 175, 0.4)" />
          </linearGradient>
          <filter id="skillGridGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {animatedHobbies.map((index) => {
          const skill = hobbies[index]
          const partPosition = getPartPosition("blade", index)

          const gridX = window.innerWidth < 640 ? 120 : 160
          const gridY =
            window.innerHeight -
            (window.innerHeight < 640 ? 120 : 160) +
            Math.floor(index / 3) * 35

          const partX = (partPosition.x / 100) * window.innerWidth
          const partY = (partPosition.y / 100) * window.innerHeight

          const midX1 = partX - (partX - gridX) * 0.7
          const midY1 = partY
          const midX2 = gridX + 50
          const midY2 = gridY

          return (
            <g key={`${skill.name}-line-${index}`}>
              <path
                d={`M ${partX} ${partY} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${gridX} ${gridY}`}
                stroke="url(#skillGridGradient)"
                strokeWidth="1"
                fill="none"
                filter="url(#skillGridGlow)"
              />

              <circle
                cx={partX}
                cy={partY}
                r="2"
                fill={skill.color}
                className="animate-pulse-glow"
                style={{
                  filter: `drop-shadow(0 0 4px ${skill.color})`,
                  opacity: 1,
                  transition: `opacity 0.4s ease`,
                }}
              />

              <circle
                cx={gridX}
                cy={gridY}
                r="1.5"
                fill="rgba(156, 163, 175, 0.8)"
              />

              <circle cx={midX1} cy={midY1} r="1" fill="rgba(156, 163, 175, 0.6)" />
              <circle cx={midX2} cy={midY2} r="1" fill="rgba(156, 163, 175, 0.6)" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function HobbyCard({ hobby }: { hobby: Hobby }) {
  const IconComponent = iconMap[hobby.icon] || Camera
   
  return (
    <>
        <div
      className="bg-black/80 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] shadow-md"
      style={{ borderLeft: `2px solid ${hobby.color}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: hobby.color + "20", border: `1px solid ${hobby.color}` }}
        >
          <IconComponent size={14} style={{ color: hobby.color }} />
        </div>
        <span className="text-white text-xs font-semibold truncate">{hobby.name}</span>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{hobby.description}</p>
    </div>
    </>
  )
}

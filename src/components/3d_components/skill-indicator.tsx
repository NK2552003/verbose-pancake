"use client"

import { useEffect, useState } from "react"

interface SkillGridProps {
  skills: Array<{
    name: string
    size: string
    color: string
    partType: string
  }>
  partPositions: Array<{
    id: string
    position: any
    screenPosition: { x: number; y: number }
  }>
  visibleSkills: number[]
  currentSection: number
}

export default function SkillGrid({ skills, partPositions, visibleSkills, currentSection }: SkillGridProps) {
  const [animatedSkills, setAnimatedSkills] = useState<number[]>([])

  useEffect(() => {
    if (currentSection === 1) {
      // Show all visible skills at once
      setAnimatedSkills(visibleSkills.filter((index) => index >= 0 && index < skills.length))
    } else {
      setAnimatedSkills([])
    }
  }, [visibleSkills, currentSection, skills])

  const getPartPosition = (partType: string, index: number) => {
    const filteredParts = partPositions.filter((p) => p.id.startsWith(partType))
    if (filteredParts[index % filteredParts.length]) {
      return filteredParts[index % filteredParts.length].screenPosition
    }
    return { x: 50, y: 50 }
  }

  if (currentSection !== 1 || visibleSkills.length === 0) return null

  return (
    <>
      {/* Skills Grid - Bottom Left */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 z-30 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-2xl border border-gray-700/60 max-w-sm">
          <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Technical Skills
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {skills.map((skill, index) => {
              const isVisible = animatedSkills.includes(index)
              const partPosition = getPartPosition("blade", index)

              return (
                <div
                  key={`${skill.name}-${index}`}
                  className={`relative transition-all duration-500 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                >
                  <div className="px-2 py-1.5 bg-gray-800/80 border border-gray-600/50 rounded-lg hover:border-gray-500/70 transition-all duration-300 hover:scale-105">
                    <div className="text-xs font-semibold text-white text-center uppercase tracking-wide">
                      {skill.name}
                    </div>
                  </div>

                  {/* Connection indicator */}
                  <div
                    className="absolute -top-1 -left-1 w-2 h-2 rounded-full animate-pulse-glow"
                    style={{
                      backgroundColor: skill.color,
                      boxShadow: `0 0 6px ${skill.color}40`,
                      opacity: isVisible ? 1 : 0,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hand-drawn style Connection Lines */}
      <svg className="fixed inset-0 pointer-events-none z-20" style={{ width: "100vw", height: "100vh" }}>
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

        {skills.map((skill, index) => {
          const isVisible = animatedSkills.includes(index)
          const partPosition = getPartPosition("blade", index)

          // Calculate grid item position (bottom left)
          const gridX = window.innerWidth < 640 ? 120 : 160
          const gridY = window.innerHeight - (window.innerHeight < 640 ? 120 : 160) + Math.floor(index / 3) * 35

          const partX = (partPosition.x / 100) * window.innerWidth
          const partY = (partPosition.y / 100) * window.innerHeight

          if (!isVisible) return null

          // Create hand-drawn style path with multiple segments
          const midX1 = partX - (partX - gridX) * 0.7
          const midY1 = partY
          const midX2 = gridX + 50
          const midY2 = gridY

          return (
            <g key={`${skill.name}-line-${index}`}>
              <path
                d={`M ${partX} ${partY} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${gridX} ${gridY}`}
                stroke="rgba(156, 163, 175, 0.6)"
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
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.4s ease`,
                }}
              />

              <circle
                cx={gridX}
                cy={gridY}
                r="1.5"
                fill="rgba(156, 163, 175, 0.8)"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.4s ease`,
                }}
              />

              <circle cx={midX1} cy={midY1} r="1" fill="rgba(156, 163, 175, 0.6)" opacity={isVisible ? 1 : 0} />
              <circle cx={midX2} cy={midY2} r="1" fill="rgba(156, 163, 175, 0.6)" opacity={isVisible ? 1 : 0} />
            </g>
          )
        })}
      </svg>
    </>
  )
}

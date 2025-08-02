"use client"

import { useEffect, useState } from "react"

interface SkillListProps {
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

export default function SkillList({ skills, partPositions, visibleSkills, currentSection }: SkillListProps) {
  const [animatedSkills, setAnimatedSkills] = useState<number[]>([])

  useEffect(() => {
    if (currentSection === 1) {
      // Clear previous animations
      setAnimatedSkills([])

      // Stagger the skill animations with bounds checking
      visibleSkills.forEach((skillIndex, i) => {
        if (skillIndex >= 0 && skillIndex < skills.length) {
          setTimeout(() => {
            setAnimatedSkills((prev) => [...prev, skillIndex])
          }, i * 150)
        }
      })
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

  if (currentSection !== 1) return null

  return (
    <>
      {/* Skills List */}
      <div className="fixed left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700/60 max-w-xs">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            Technical Skills
          </h3>
          <div className="space-y-3">
            {skills.map((skill, index) => {
              const isVisible = animatedSkills.includes(index)
              const partPosition = getPartPosition("blade", index)

              return (
                <div
                  key={`${skill.name}-${index}`}
                  className={`flex items-center gap-3 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg animate-pulse-glow"
                    style={{
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.color}40`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-white truncate">{skill.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{skill.size}</div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-800/60 px-2 py-1 rounded">#{index + 1}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="fixed inset-0 pointer-events-none z-20" style={{ width: "100vw", height: "100vh" }}>
        <defs>
          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
          </linearGradient>
          <filter id="skillGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {skills.map((skill, index) => {
          const isVisible = animatedSkills.includes(index)
          const partPosition = getPartPosition("blade", index)

          // Calculate list item position
          const listX = window.innerWidth < 640 ? 120 : 160 // Approximate list item center
          const listY = window.innerHeight / 2 - 100 + index * 48 // Approximate list item center

          const partX = (partPosition.x / 100) * window.innerWidth
          const partY = (partPosition.y / 100) * window.innerHeight

          if (!isVisible) return null

          return (
            <g key={`${skill.name}-line-${index}`}>
              {/* Main connection line */}
              <path
                d={`M ${listX} ${listY} Q ${(listX + partX) / 2} ${(listY + partY) / 2 - 50} ${partX} ${partY}`}
                stroke="url(#skillGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#skillGlow)"
                className="animate-pulse-line"
                style={{
                  strokeDasharray: "5,5",
                  animation: `drawLine 1s ease-out ${index * 150}ms forwards`,
                }}
              />
              {/* End point indicator */}
              <circle
                cx={partX}
                cy={partY}
                r="4"
                fill={skill.color}
                className="animate-pulse-glow"
                style={{
                  filter: `drop-shadow(0 0 6px ${skill.color})`,
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${index * 150}ms`,
                }}
              />
              {/* Start point indicator */}
              <circle
                cx={listX}
                cy={listY}
                r="3"
                fill={skill.color}
                className="animate-pulse-glow"
                style={{
                  opacity: isVisible ? 0.7 : 0,
                  transition: `opacity 0.5s ease ${index * 150}ms`,
                }}
              />
            </g>
          )
        })}
      </svg>
    </>
  )
}

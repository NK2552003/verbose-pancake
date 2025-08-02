"use client"

import { useEffect, useState } from "react"

interface GitHubListProps {
  githubStats: Array<{
    label: string
    value: string
    color: string
    partType: string
  }>
  partPositions: Array<{
    id: string
    position: any
    screenPosition: { x: number; y: number }
  }>
  visibleGitHubStats: number[]
  currentSection: number
}

export default function GitHubList({
  githubStats,
  partPositions,
  visibleGitHubStats,
  currentSection,
}: GitHubListProps) {
  const [animatedStats, setAnimatedStats] = useState<number[]>([])
  const [countUpValues, setCountUpValues] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    if (currentSection === 2) {
      // Clear previous animations
      setAnimatedStats([])
      setCountUpValues({})

      // Stagger the GitHub stats animations
      visibleGitHubStats.forEach((statIndex, i) => {
        // Add bounds checking to prevent undefined errors
        if (statIndex >= 0 && statIndex < githubStats.length) {
          setTimeout(() => {
            setAnimatedStats((prev) => [...prev, statIndex])

            // Start count-up animation
            const stat = githubStats[statIndex]
            if (stat && stat.value) {
              const numericValue = Number.parseInt(stat.value.replace(/[^\d]/g, "")) || 0
              let current = 0
              const increment = numericValue / 30
              const timer = setInterval(() => {
                current += increment
                if (current >= numericValue) {
                  setCountUpValues((prev) => ({ ...prev, [statIndex]: numericValue }))
                  clearInterval(timer)
                } else {
                  setCountUpValues((prev) => ({ ...prev, [statIndex]: Math.floor(current) }))
                }
              }, 50)

              // Cleanup timer after animation completes
              setTimeout(() => {
                clearInterval(timer)
              }, 2000)
            }
          }, i * 200)
        }
      })
    } else {
      setAnimatedStats([])
      setCountUpValues({})
    }
  }, [visibleGitHubStats, currentSection, githubStats])

  const getPartPosition = (partType: string, index: number) => {
    const filteredParts = partPositions.filter((p) => p.id.startsWith(partType))
    if (filteredParts[index]) {
      return filteredParts[index].screenPosition
    }
    return { x: 50, y: 50 }
  }

  const formatValue = (statIndex: number, originalValue: string) => {
    const countValue = countUpValues[statIndex] || 0
    if (originalValue.includes("K")) return `${(countValue / 1000).toFixed(1)}K`
    return countValue.toString()
  }

  if (currentSection !== 2 || visibleGitHubStats.length === 0) return null

  return (
    <>
      {/* GitHub Stats List */}
      <div className="fixed right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700/60 max-w-xs">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            GitHub Stats
          </h3>
          <div className="space-y-4">
            {githubStats.map((stat, index) => {
              const isVisible = animatedStats.includes(index)
              const partPosition = getPartPosition("hole", index)

              return (
                <div
                  key={`${stat.label}-${index}`}
                  className={`flex items-center gap-3 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="text-xs text-gray-500 bg-gray-800/60 px-2 py-1 rounded">#{index + 1}</div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg animate-pulse-glow"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 10px ${stat.color}40`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-white">{stat.label}</div>
                    <div className="text-lg font-bold text-white font-mono">
                      {isVisible ? formatValue(index, stat.value) : stat.value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="fixed inset-0 pointer-events-none z-20" style={{ width: "100vw", height: "100vh" }}>
        <defs>
          <linearGradient id="githubGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.8)" />
          </linearGradient>
          <filter id="githubGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {githubStats.map((stat, index) => {
          const isVisible = animatedStats.includes(index)
          const partPosition = getPartPosition("hole", index)

          // Calculate list item position (right side)
          const listX = window.innerWidth - (window.innerWidth < 640 ? 120 : 160)
          const listY = window.innerHeight / 2 - 80 + index * 56

          const partX = (partPosition.x / 100) * window.innerWidth
          const partY = (partPosition.y / 100) * window.innerHeight

          if (!isVisible) return null

          return (
            <g key={`${stat.label}-line-${index}`}>
              {/* Main connection line */}
              <path
                d={`M ${listX} ${listY} Q ${(listX + partX) / 2} ${(listY + partY) / 2 - 30} ${partX} ${partY}`}
                stroke="url(#githubGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#githubGlow)"
                className="animate-pulse-line"
                style={{
                  strokeDasharray: "8,4",
                  animation: `drawLine 1.2s ease-out ${index * 200}ms forwards`,
                }}
              />
              {/* End point indicator */}
              <circle
                cx={partX}
                cy={partY}
                r="5"
                fill={stat.color}
                className="animate-pulse-glow"
                style={{
                  filter: `drop-shadow(0 0 8px ${stat.color})`,
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.6s ease ${index * 200}ms`,
                }}
              />
              {/* Start point indicator */}
              <circle
                cx={listX}
                cy={listY}
                r="3"
                fill={stat.color}
                className="animate-pulse-glow"
                style={{
                  opacity: isVisible ? 0.8 : 0,
                  transition: `opacity 0.6s ease ${index * 200}ms`,
                }}
              />
              {/* Animated pulse along the line */}
              <circle
                r="2"
                fill={stat.color}
                className="animate-pulse-travel"
                style={{
                  opacity: isVisible ? 0.6 : 0,
                }}
              >
                <animateMotion dur="3s" repeatCount="indefinite" begin={`${index * 200}ms`}>
                  <mpath href={`#path-${index}`} />
                </animateMotion>
              </circle>
              {/* Hidden path for animation */}
              <path
                id={`path-${index}`}
                d={`M ${listX} ${listY} Q ${(listX + partX) / 2} ${(listY + partY) / 2 - 30} ${partX} ${partY}`}
                fill="none"
                style={{ opacity: 0 }}
              />
            </g>
          )
        })}
      </svg>
    </>
  )
}

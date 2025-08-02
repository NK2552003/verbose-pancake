"use client"

import { useEffect, useState } from "react"

interface GitHubGridProps {
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

export default function GitHubGrid({
  githubStats,
  partPositions,
  visibleGitHubStats,
  currentSection,
}: GitHubGridProps) {
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
              const increment = numericValue / 25
              const timer = setInterval(() => {
                current += increment
                if (current >= numericValue) {
                  setCountUpValues((prev) => ({ ...prev, [statIndex]: numericValue }))
                  clearInterval(timer)
                } else {
                  setCountUpValues((prev) => ({ ...prev, [statIndex]: Math.floor(current) }))
                }
              }, 60)

              // Cleanup timer after animation completes
              setTimeout(() => {
                clearInterval(timer)
              }, 2000)
            }
          }, i * 150)
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
      {/* GitHub Stats Grid - Bottom Left */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 z-30 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-2xl border border-gray-700/60 max-w-sm">
          <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            GitHub Stats
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {githubStats.map((stat, index) => {
              const isVisible = animatedStats.includes(index)
              const partPosition = getPartPosition("hole", index)

              return (
                <div
                  key={`${stat.label}-${index}`}
                  className={`relative transition-all duration-600 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="px-2 py-2 bg-gray-800/80 border border-gray-600/50 rounded-lg hover:border-gray-500/70 transition-all duration-300 hover:scale-105">
                    <div className="text-xs font-semibold text-white text-center uppercase tracking-wide mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold text-white text-center font-mono">
                      {isVisible ? formatValue(index, stat.value) : stat.value}
                    </div>
                  </div>

                  {/* Connection indicator */}
                  <div
                    className="absolute -top-1 -left-1 w-2 h-2 rounded-full animate-pulse-glow"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 6px ${stat.color}40`,
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
          <linearGradient id="githubGridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(156, 163, 175, 0.8)" />
            <stop offset="100%" stopColor="rgba(156, 163, 175, 0.4)" />
          </linearGradient>
          <filter id="githubGridGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {githubStats.map((stat, index) => {
          const isVisible = animatedStats.includes(index)
          const partPosition = getPartPosition("hole", index)

          // Calculate grid item position (bottom left)
          const gridX = window.innerWidth < 640 ? 120 : 160
          const gridY = window.innerHeight - (window.innerHeight < 640 ? 100 : 140) + Math.floor(index / 2) * 45

          const partX = (partPosition.x / 100) * window.innerWidth
          const partY = (partPosition.y / 100) * window.innerHeight

          if (!isVisible) return null

          // Create hand-drawn style path with multiple segments
          const midX1 = partX - (partX - gridX) * 0.7
          const midY1 = partY
          const midX2 = gridX + 50
          const midY2 = gridY

          return (
            <g key={`${stat.label}-line-${index}`}>
              {/* Main hand-drawn connection line */}
              <path
                d={`M ${partX} ${partY} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${gridX} ${gridY}`}
                stroke="rgba(156, 163, 175, 0.6)"
                strokeWidth="1"
                fill="none"
                filter="url(#githubGridGlow)"
                style={{
                  strokeDasharray: "none",
                  animation: `drawLine 1.4s ease-out ${index * 150}ms forwards`,
                }}
              />

              {/* Start point indicator */}
              <circle
                cx={partX}
                cy={partY}
                r="2"
                fill={stat.color}
                className="animate-pulse-glow"
                style={{
                  filter: `drop-shadow(0 0 6px ${stat.color})`,
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${index * 150}ms`,
                }}
              />

              {/* End point indicator */}
              <circle
                cx={gridX}
                cy={gridY}
                r="1.5"
                fill="rgba(156, 163, 175, 0.8)"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${index * 150}ms`,
                }}
              />

              {/* Small connection joints */}
              <circle cx={midX1} cy={midY1} r="1" fill="rgba(156, 163, 175, 0.6)" opacity={isVisible ? 1 : 0} />
              <circle cx={midX2} cy={midY2} r="1" fill="rgba(156, 163, 175, 0.6)" opacity={isVisible ? 1 : 0} />
            </g>
          )
        })}
      </svg>
    </>
  )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GitBranch, Star, Users, GitCommit } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface GitHubStat {
  label: string
  value: string
  color: string
  partType: string
}

interface PartPosition {
  id: string
  position: any
  screenPosition: { x: number; y: number }
}

interface GitHubListProps {
  githubStats: GitHubStat[]
  partPositions: PartPosition[]
  visibleGitHubStats: number[]
  currentSection: number
}

const statIcons = {
  "Repositories": GitBranch,
  "Total Commits": GitCommit,
  "Stars Earned": Star,
  "Followers": Users,
}

const getPartPositionForStat = (
  index: number,
  partPositions: PartPosition[],
  containerWidth: number,
  containerHeight: number
) => {
  const partIndices = [0, 1, 2, 3, 4]
  const partIndex = partIndices[index % partIndices.length]
  const screenPos = partPositions[partIndex]?.screenPosition
  if (screenPos) {
    return {
      x: (screenPos.x / 100) * containerWidth,
      y: (screenPos.y / 100) * containerHeight,
    }
  }
  return { x: 50, y: 50 }
}

export default function KnowAboutIndicator({
  githubStats,
  partPositions,
  visibleGitHubStats,
  currentSection,
}: GitHubListProps) {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setContainerDimensions({ width, height })
      setIsMobile(width < 768)
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  if (currentSection !== 2 || containerDimensions.width === 0) return null

  const getCardPosition = (index: number) => {
    if (isMobile) {
      const isEven = index % 2 === 0
      const pairIndex = Math.floor(index / 2)
      return {
        left: isEven ? "8%" : undefined,
        right: isEven ? undefined : "8%",
        top: `${20 + pairIndex * 25}%`,
        transform: "translateY(-50%)",
      }
    } else {
      const positions = [
        { left: "5%", top: "15%" },
        { right: "5%", top: "15%" },
        { right: "5%", bottom: "15%" },
        { left: "5%", bottom: "15%" },
        { left: "5%", top: "50%", transform: "translateY(-50%)" },
      ]
      return positions[index] || positions[0]
    }
  }

  const getCardCenterPosition = (cardPos: any) => {
    const cardWidth = isMobile ? 40 : 180
    const cardHeight = isMobile ? 40 : 80

    let cardCenterX = containerDimensions.width / 2
    let cardCenterY = containerDimensions.height / 2

    const getValue = (val: string | undefined, axis: "x" | "y") => {
      if (!val) return undefined
      if (val.includes("%")) {
        const percent = parseFloat(val) / 100
        return axis === "x"
          ? percent * containerDimensions.width
          : percent * containerDimensions.height
      }
      return parseFloat(val)
    }

    const left = getValue(cardPos.left, "x")
    const right = getValue(cardPos.right, "x")
    const top = getValue(cardPos.top, "y")
    const bottom = getValue(cardPos.bottom, "y")

    if (left !== undefined) {
      cardCenterX = left + cardWidth / 2
    } else if (right !== undefined) {
      cardCenterX = containerDimensions.width - right - cardWidth / 2
    }

    if (top !== undefined) {
      cardCenterY = top
      if (!cardPos.transform?.includes("translateY(-50%)")) {
        cardCenterY += cardHeight / 2
      }
    } else if (bottom !== undefined) {
      cardCenterY = containerDimensions.height - bottom - cardHeight / 2
    }

    return { x: cardCenterX, y: cardCenterY }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-20 pointer-events-none">
      <svg
        className="absolute inset-0 pointer-events-none"
        width={containerDimensions.width}
        height={containerDimensions.height}
        viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
      >
        <defs>
          <marker id="arrowhead-github" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.6)" />
          </marker>
          <filter id="lineGlowGithub">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence>
          {visibleGitHubStats.map((statIndex) => {
            const stat = githubStats[statIndex]
            if (!stat) return null

            const cardPos = getCardPosition(statIndex)
            const partPos = getPartPositionForStat(statIndex, partPositions, containerDimensions.width, containerDimensions.height)
            const cardCenter = getCardCenterPosition(cardPos)

            const dx = partPos.x - cardCenter.x
            const dy = partPos.y - cardCenter.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const controlOffset = isMobile ? 0.15 : 0.25
            const controlDistance = distance * controlOffset
            const perpX = -dy / distance * controlDistance
            const perpY = dx / distance * controlDistance
            const midX = (cardCenter.x + partPos.x) / 2
            const midY = (cardCenter.y + partPos.y) / 2
            const controlX = midX + perpX
            const controlY = midY + perpY

            return (
              <g key={`github-line-${statIndex}`}>
                <motion.path
                  d={`M ${cardCenter.x} ${cardCenter.y} Q ${controlX} ${controlY} ${partPos.x} ${partPos.y}`}
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead-github)"
                  filter="url(#lineGlowGithub)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: statIndex * 0.1 }}
                />

                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="3"
                  fill={stat.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, delay: statIndex * 0.1 + 0.6 }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${stat.color})`,
                  }}
                />

                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="6"
                  fill="none"
                  stroke={stat.color}
                  strokeWidth="1"
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    delay: statIndex * 0.1 + 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            )
          })}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {visibleGitHubStats.map((statIndex) => {
          const stat = githubStats[statIndex]
          if (!stat) return null

          const position = getCardPosition(statIndex)
          const IconComponent = statIcons[stat.label as keyof typeof statIcons] || GitBranch

          return (
            <motion.div
              key={`github-${statIndex}`}
              className="absolute pointer-events-auto"
              style={position}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.6, delay: statIndex * 0.15 }}
            >
              <motion.div
                className="bg-black/90 backdrop-blur-lg border border-gray-600/50 rounded-lg shadow-lg w-[40px] h-[40px] md:w-[180px] md:h-auto md:p-4 p-2 flex md:block items-center justify-center"
                style={{
                  borderLeft: `3px solid ${stat.color}`,
                  boxShadow: `0 0 20px ${stat.color}20`,
                }}
                whileHover={{ scale: 1.05, y: isMobile ? -1 : -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="md:hidden">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: stat.color + "20",
                      border: `1px solid ${stat.color}`,
                    }}
                  >
                    <IconComponent size={14} style={{ color: stat.color }} />
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: stat.color + "20",
                        border: `1px solid ${stat.color}`,
                      }}
                    >
                      <IconComponent size={18} style={{ color: stat.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-300 text-sm font-medium mb-2">
                    {stat.label}
                  </div>

                  <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                    <motion.div
                      className="h-full rounded"
                      style={{ backgroundColor: stat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: statIndex * 0.15 + 0.5 }}
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-400" />
                    <div className="flex-1 h-px bg-gradient-to-r from-green-400/40 to-transparent" />
                    <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

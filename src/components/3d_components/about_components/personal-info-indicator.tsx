"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Target, Hammer, GraduationCap, Zap, Puzzle } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface PersonalInfo {
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

interface PersonalInfoListProps {
  personalInfo: PersonalInfo[]
  partPositions: PartPosition[]
  visiblePersonalInfo: number[]
  currentSection: number
}

const infoIcons = {
  "Mission": Target,
  "Currently Building": Hammer,
  "Learning": GraduationCap,
  "Core Values": Zap,
  "Fun Facts": Puzzle,
}

const getPartPositionForInfo = (
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

export default function PersonalInfoIndicator({
  personalInfo,
  partPositions,
  visiblePersonalInfo,
  currentSection,
}: PersonalInfoListProps) {
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
    const cardWidth = isMobile ? 50 : 220
    const cardHeight = isMobile ? 50 : 100

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
          <marker id="arrowhead-personal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.6)" />
          </marker>
          <filter id="lineGlowPersonal">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence>
          {visiblePersonalInfo.map((infoIndex) => {
            const info = personalInfo[infoIndex]
            if (!info) return null

            const cardPos = getCardPosition(infoIndex)
            const partPos = getPartPositionForInfo(infoIndex, partPositions, containerDimensions.width, containerDimensions.height)
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
              <g key={`personal-line-${infoIndex}`}>
                <motion.path
                  d={`M ${cardCenter.x} ${cardCenter.y} Q ${controlX} ${controlY} ${partPos.x} ${partPos.y}`}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead-personal)"
                  filter="url(#lineGlowPersonal)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: infoIndex * 0.1 }}
                />

                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="3"
                  fill={info.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, delay: infoIndex * 0.1 + 0.6 }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${info.color})`,
                  }}
                />

                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="6"
                  fill="none"
                  stroke={info.color}
                  strokeWidth="1"
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    delay: infoIndex * 0.1 + 0.8,
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
        {visiblePersonalInfo.map((infoIndex) => {
          const info = personalInfo[infoIndex]
          if (!info) return null

          const position = getCardPosition(infoIndex)
          const IconComponent = infoIcons[info.label as keyof typeof infoIcons] || Target

          return (
            <motion.div
              key={`personal-${infoIndex}`}
              className="absolute pointer-events-auto"
              style={position}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.6, delay: infoIndex * 0.15 }}
            >
              <motion.div
                className="bg-[#111111] border border-gray-600/50 rounded-lg shadow-lg w-[100px] h-auto md:w-[220px] md:h-auto md:p-4 p-2 flex md:block items-center justify-center"
                whileHover={{ scale: 1.05, y: isMobile ? -2 : -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="md:hidden">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                  >
                    <IconComponent size={16} style={{ color: info.color }} />
                  </div>
                      <div className="text-gray-200 text-xs font-medium leading-relaxed min-h-[40px]">
                    {info.value}
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: info.color + "20",
                        border: `1px solid ${info.color}`,
                      }}
                    >
                      <IconComponent size={20} style={{ color: info.color }} />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-gray-400">
                      {info.label}
                    </div>
                  </div>

                  <div className="text-gray-200 text-xs font-medium leading-relaxed min-h-[40px]">
                    {info.value}
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
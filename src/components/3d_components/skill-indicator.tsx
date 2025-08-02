"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

  if (currentSection !== 1 || animatedSkills.length === 0) return null

  return (
    <>
      {/* 🧠 Animated Card UI */}
      <motion.div
        className="border border-white/20 p-4 rounded-xl text-white max-w-sm mx-auto absolute bottom-4 left-4 md:left-6 w-[90%] md:w-auto bg-[#031412] z-30"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="flex justify-between items-center mb-2 text-teal-400"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-medium">Technical Skills</span>
          <motion.span
            className="text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {animatedSkills.length}
          </motion.span>
        </motion.div>

        {/* Segment line */}
        <div className="flex h-2 w-full rounded-full overflow-hidden mb-3 bg-gray-700">
          {animatedSkills.map((i) => (
            <motion.div
              key={i}
              className=""
              style={{
                backgroundColor: skills[i].color,
                flex: '1 0 auto',
                width: '10%',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: i * 0.05,
              }}
            />
          ))}
        </div>

        {/* Skill Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {animatedSkills.map((index) => {
            const skill = skills[index]
            return (
              <motion.div
                key={`${skill.name}-${index}`}
                className="relative px-2 py-1.5 border border-white/20 rounded-lg hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: "#041f1c" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 10 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
              >
                <div className="text-xs font-semibold text-white text-center uppercase tracking-wide">
                  {skill.name}
                </div>

                {/* Glowing dot */}
                <div
                  className="absolute -top-1 -left-1 w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: skill.color,
                    boxShadow: `0 0 6px ${skill.color}88`,
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

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

        {animatedSkills.map((index) => {
          const skill = skills[index]
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
    </>
  )
}

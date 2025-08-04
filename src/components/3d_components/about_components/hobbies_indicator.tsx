"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Camera, Music, Gamepad2, Book, Plane, Coffee } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface Hobby {
  name: string
  icon: string
  color: string
  description: string
  partType: string // Added to match parts with hobbies
}

interface PartPosition {
  id: string
  position: any
  screenPosition: { x: number; y: number }
}

interface HobbyIndicatorProps {
  hobbies: Hobby[]
  currentSection: number
  visibleHobbies: number[]
  partPositions?: PartPosition[] // Add this prop to receive part positions
}

// Define a proper type for card positions
interface CardPosition {
  left?: string
  right?: string
  top?: string
  bottom?: string
  transform?: string
}

const iconMap = {
  Camera,
  Music,
  Gamepad2,
  Book,
  Plane,
  Coffee,
}

// Map part types to likely part indices based on your rocket engine structure
const partTypeToIndex = {
  tank: 0,     // FuelTank
  bell: 1,     // BellNozzle  
  nozzles: 2,  // SmallNozzles
  internals: 3, // InternalMechanics
  exhaust: 4,  // FireExhaust
}

export default function HobbyIndicator({
  hobbies,
  currentSection,
  visibleHobbies,
  partPositions = [],
}: HobbyIndicatorProps) {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerDimensions({ width: rect.width, height: rect.height })
        setIsMobile(rect.width < 768)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  if (currentSection !== 1) return null

  // Calculate card positions around the viewport
  const getCardPosition = (index: number, total: number): CardPosition => {
    const isEven = index % 2 === 0
    const pairIndex = Math.floor(index / 2)
    
    if (isMobile) {
      // Mobile: stack cards vertically on left and right
      return {
        left: isEven ? '4%' : undefined,
        right: isEven ? undefined : '4%',
        top: `${20 + pairIndex * 25}%`,
        transform: 'translateY(-50%)'
      }
    } else {
      // Desktop: distribute around the edges
      const positions: CardPosition[] = [
        { left: '5%', top: '20%' },      // top-left
        { right: '5%', top: '20%' },     // top-right
        { left: '5%', bottom: '20%' },   // bottom-left
        { right: '5%', bottom: '20%' },  // bottom-right
        { left: '5%', top: '50%', transform: 'translateY(-50%)' }, // middle-left
      ]
      return positions[index] || positions[0]
    }
  }

  const getPartScreenPosition = (partType: string) => {
    const partIndex = partTypeToIndex[partType as keyof typeof partTypeToIndex]
    if (partIndex !== undefined && partPositions[partIndex]) {
      const pos = partPositions[partIndex].screenPosition
      return {
        x: (pos.x / 100) * containerDimensions.width,
        y: (pos.y / 100) * containerDimensions.height
      }
    }
    return { x: containerDimensions.width / 2, y: containerDimensions.height / 2 }
  }

  // Helper function to calculate card center position
  const getCardCenterPosition = (cardPos: CardPosition) => {
    const cardWidth = isMobile ? 40 : 200  // Icon-only width for mobile
    const cardHeight = isMobile ? 40 : 100  // Icon-only height for mobile
    
    let cardCenterX: number
    let cardCenterY: number
    
    // Calculate X position
    if (cardPos.left !== undefined) {
      cardCenterX = (parseFloat(cardPos.left) / 100) * containerDimensions.width + cardWidth / 2
    } else if (cardPos.right !== undefined) {
      cardCenterX = containerDimensions.width - (parseFloat(cardPos.right) / 100) * containerDimensions.width - cardWidth / 2
    } else {
      cardCenterX = containerDimensions.width / 2
    }
    
    // Calculate Y position
    if (cardPos.top !== undefined) {
      let topPercent = parseFloat(cardPos.top)
      cardCenterY = (topPercent / 100) * containerDimensions.height
      
      // Apply transform if specified
      if (cardPos.transform?.includes('translateY(-50%)')) {
        cardCenterY = cardCenterY // Keep as is since translateY(-50%) centers the card
      } else {
        cardCenterY = cardCenterY + cardHeight / 2 // Add half card height for top positioning
      }
    } else if (cardPos.bottom !== undefined) {
      cardCenterY = containerDimensions.height - (parseFloat(cardPos.bottom) / 100) * containerDimensions.height - cardHeight / 2
    } else {
      cardCenterY = containerDimensions.height / 2
    }

    return { x: cardCenterX, y: cardCenterY }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none">
      {/* SVG for connection lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 15 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgba(255, 255, 255, 0.6)"
            />
          </marker>
        </defs>
        
        <AnimatePresence>
          {visibleHobbies.map((hobbyIndex) => {
            const hobby = hobbies[hobbyIndex]
            if (!hobby) return null

            const cardPos = getCardPosition(hobbyIndex, visibleHobbies.length)
            const partPos = getPartScreenPosition(hobby.partType)
            
            // Calculate card center position using the helper function
            const cardCenter = getCardCenterPosition(cardPos)

            // Create path with a nice curve
            const midX = (cardCenter.x + partPos.x) / 2
            const midY = (cardCenter.y + partPos.y) / 2
            
            // Adjust control points for better curve appearance
            const controlOffset = isMobile ? 0.2 : 0.3
            const controlX = midX + (partPos.y - cardCenter.y) * controlOffset
            const controlY = midY - (partPos.x - cardCenter.x) * controlOffset

            return (
              <motion.path
                key={`line-${hobbyIndex}`}
                d={`M ${cardCenter.x} ${cardCenter.y} Q ${controlX} ${controlY} ${partPos.x} ${partPos.y}`}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 4"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: hobbyIndex * 0.1 }}
              />
            )
          })}
        </AnimatePresence>
      </svg>

      {/* Hobby Cards */}
      <AnimatePresence>
        {visibleHobbies.map((hobbyIndex) => {
          const hobby = hobbies[hobbyIndex]
          if (!hobby) return null

          const position = getCardPosition(hobbyIndex, visibleHobbies.length)

          return (
            <motion.div
              key={`hobby-${hobbyIndex}`}
              className="absolute pointer-events-auto"
              style={position}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: hobbyIndex * 0.1 }}
            >
              <HobbyCard hobby={hobby} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function HobbyCard({ hobby }: { hobby: Hobby }) {
  const IconComponent = iconMap[hobby.icon as keyof typeof iconMap] || Camera

  return (
    <motion.div
      className="bg-black/90 backdrop-blur-lg border border-gray-600/50 rounded-lg shadow-lg
                 w-[40px] h-[40px] md:w-[200px] md:h-auto md:p-3 p-2
                 flex md:block items-center justify-center"
      style={{ 
        borderLeft: `3px solid ${hobby.color}`,
        boxShadow: `0 0 20px ${hobby.color}20`
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Mobile: Icon only */}
      <div className="md:hidden">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hobby.color + "20", 
            border: `1px solid ${hobby.color}`,
            boxShadow: `0 0 10px ${hobby.color}30`
          }}
        >
          <IconComponent size={14} style={{ color: hobby.color }} />
        </div>
      </div>
      
      {/* Desktop: Full card content */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: hobby.color + "20", 
              border: `1px solid ${hobby.color}`,
              boxShadow: `0 0 10px ${hobby.color}30`
            }}
          >
            <IconComponent size={16} style={{ color: hobby.color }} />
          </div>
          <span className="text-white text-sm font-semibold truncate">{hobby.name}</span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{hobby.description}</p>
        
        {/* Technical-style decorative elements */}
        <div className="mt-2 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hobby.color + "60" }} />
          <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Camera, Music, Gamepad2, Book, Plane, Coffee } from "lucide-react"

interface Hobby {
  name: string
  icon: string  // not narrowed
  color: string
  description: string
}


interface HobbyIndicatorProps {
  hobbies: Hobby[]
  currentSection: number
  visibleHobbies: number[]
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
  visibleHobbies,
}: HobbyIndicatorProps) {
  if (currentSection !== 1) return null

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
    </div>
  )
}

function HobbyCard({ hobby }: { hobby: Hobby }) {
const IconComponent = iconMap[hobby.icon as keyof typeof iconMap] || Camera

  return (
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
  )
}

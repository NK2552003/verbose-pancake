"use client"

import { 
  Gamepad2, 
  Music, 
  Paintbrush, 
  Dumbbell, 
  Leaf, 
  Camera, 
  Film, 
  BookOpen, 
  Piano, 
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function GamingInterface() {
  const [activeSquare] = useState(4)
  const [isMobile, setIsMobile] = useState(false)

  const squareVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
    }
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const squares = Array(9).fill(null)

  const icons = [
    <Music key={0} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Paintbrush key={1} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Dumbbell key={2} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Leaf key={3} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Gamepad2 key={4} className="text-white/90 w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15" />,
    <Camera key={5} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Film key={6} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <BookOpen key={7} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
    <Piano key={8} className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
  ]

  return (
    <div className="flex flex-wrap items-center justify-center px-4 sm:px-6 pb-4 overflow-hidden">
      <div className="relative w-full h-auto">
        <div className="flex flex-wrap gap-2 sm:gap-4 h-full w-full justify-center">
          {squares.map((_, index) => {
            if (isMobile && index === 8) return null

            const isCorner = index === 0 || index === 2 || index === 6 || index === 8

            return (
              <motion.div
                key={index}
                className={`
                  relative rounded-lg transform transition-all duration-300 ease-out
                  hover:scale-100 hover:z-10 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] 
                  cursor-pointer backdrop-blur-md border-[0.5px] border-white/50 bg-black/80
                  w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-34 lg:h-30
                  ${
                    index === activeSquare
                      ? "bg-teal-900/40 border-teal-400/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.6)]"
                      : isCorner
                        ? "bg-teal-950/10 border-teal-500/10 hover:bg-teal-900/20 hover:border-teal-500/30"
                        : "bg-teal-950/20 border-teal-500/20 hover:bg-teal-900/30 hover:border-teal-500/40"
                  }
                `}
                variants={squareVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {index !== activeSquare && icons[index]}
                </div>

                {index === activeSquare && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Gamepad2 className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-teal-500/0 hover:bg-teal-500/10 transition-colors duration-300 rounded-lg"></div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
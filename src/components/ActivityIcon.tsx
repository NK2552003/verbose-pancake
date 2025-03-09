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
  JapaneseYen 
} from "lucide-react"
import { useState, useEffect } from "react"

export default function GamingInterface() {
  const [activeSquare] = useState(4) // Center square is active by default
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust the breakpoint as needed
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const squares = Array(9).fill(null)

  // Array of icons corresponding to each square
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
    <div className="flex flex-wrap items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="relative w-full h-auto"> {/* Responsive container */}
        {/* Single row layout */}
        <div className="flex flex-wrap gap-2 sm:gap-4 h-full w-full justify-center">
          {squares.map((_, index) => {
            if (isMobile && index === 8) return null // Skip the 9th square on mobile

            const isCorner = index === 0 || index === 2 || index === 6 || index === 8

            return (
              <div
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
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                }}
                onMouseEnter={() => {
                  const el = document.getElementById(`square-${index}`)
                  if (el) {
                    el.style.transform = "translateZ(20px)"
                  }
                }}
                onMouseLeave={() => {
                  const el = document.getElementById(`square-${index}`)
                  if (el) {
                    el.style.transform = "translateZ(0px)"
                  }
                }}
                id={`square-${index}`}
              >
                {/* Render the icon for each square */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {index !== activeSquare && icons[index]} {/* Only show the original icon if the square is not active */}
                </div>

                {index === activeSquare && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad2 className="text-white/90 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                )}
                <div className="absolute inset-0 bg-teal-500/0 hover:bg-teal-500/10 transition-colors duration-300 rounded-lg"></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
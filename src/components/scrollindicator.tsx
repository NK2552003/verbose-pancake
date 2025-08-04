"use client"

import { useEffect, useState } from "react"

interface ScrollIndicatorProps {
  totalBars?: number
  scrollContainerId?: string
  majorDivisionInterval?: number
}

const ScrollIndicator = ({
  totalBars = 60,
  scrollContainerId = "scroll-container",
  majorDivisionInterval = 5,
}: ScrollIndicatorProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId)
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
      const progress = scrollTop / scrollHeight
      const index = Math.min(totalBars - 1, Math.floor(progress * totalBars))
      setActiveIndex(index)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [totalBars, scrollContainerId])

  return (
    <div className="fixed top-[2%] right-2 md:right-6 -translate-y-0 z-50 py-2 md:py-4 px-1 md:px-2 rounded-lg flex flex-col items-center gap-[1px] md:gap-[2px] border border-white/20 backdrop-blur-lg">
      {Array.from({ length: totalBars }).map((_, i) => {
        const isActive = i === activeIndex
        const isMajor = i % majorDivisionInterval === 0

        const widthClass = isActive
          ? "w-4 md:w-6"
          : isMajor
          ? "w-3 md:w-4"
          : "w-1.5 md:w-2"

        const colorClass = isActive
          ? "bg-red-500"
          : "bg-gray-500/40"

        const heightClass = "h-[1px] md:h-[2px]"

        return (
          <div
            key={i}
            className={`rounded-sm ${widthClass} ${heightClass} ${colorClass}`}
          />
        )
      })}
    </div>
  )
}

export default ScrollIndicator

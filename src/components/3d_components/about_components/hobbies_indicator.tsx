"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, Music, Book, Coffee, Dumbbell } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Hobby {
  name: string;
  icon: string;
  color: string;
  description: string;
  partType: string;
}

interface PartPosition {
  id: string;
  position: any;
  screenPosition: { x: number; y: number };
}

interface HobbyIndicatorProps {
  hobbies: Hobby[];
  currentSection: number;
  visibleHobbies: number[];
  partPositions?: PartPosition[];
}

interface CardPosition {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
}

const iconMap = {
  Camera,
  Music,
  Book,
  Coffee,
  Dumbbell,
};

const partTypeToIndex = {
  tank: 0,
  bell: 1,
  nozzles: 2,
  internals: 3,
  exhaust: 4,
};

export default function HobbyIndicator({
  hobbies,
  currentSection,
  visibleHobbies,
  partPositions = [],
}: HobbyIndicatorProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });
      setIsMobile(width < 768);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (currentSection !== 1 || windowDimensions.width === 0) return null;

  const getCardPosition = (index: number, total: number): CardPosition => {
    const isEven = index % 2 === 0;
    const pairIndex = Math.floor(index / 2);

    if (isMobile) {
      return {
        left: isEven ? "4%" : undefined,
        right: isEven ? undefined : "4%",
        top: `${20 + pairIndex * 25}%`,
        transform: "translateY(-50%)",
      };
    } else {
      const positions: CardPosition[] = [
        { left: "5%", top: "20%" },
        { right: "5%", top: "20%" },
        { left: "5%", bottom: "20%" },
        { right: "5%", bottom: "20%" },
        { left: "5%", top: "50%", transform: "translateY(-50%)" },
      ];
      return positions[index] || positions[0];
    }
  };

  const getPartScreenPosition = (partType: string) => {
    const partIndex = partTypeToIndex[partType as keyof typeof partTypeToIndex];
    if (partIndex !== undefined && partPositions[partIndex]) {
      const pos = partPositions[partIndex].screenPosition;
      return {
        x: (pos.x / 100) * windowDimensions.width,
        y: (pos.y / 100) * windowDimensions.height,
      };
    }
    return {
      x: windowDimensions.width / 2,
      y: windowDimensions.height / 2,
    };
  };

  const getCardCenterPosition = (cardPos: CardPosition) => {
    const cardWidth = isMobile ? 40 : 200;
    const cardHeight = isMobile ? 40 : 100;

    const getValue = (value: string | undefined, axis: "x" | "y") => {
      if (!value) return undefined;
      if (value.includes("%")) {
        const percent = parseFloat(value) / 100;
        return axis === "x"
          ? percent * windowDimensions.width
          : percent * windowDimensions.height;
      }
      return parseFloat(value);
    };

    let cardCenterX = windowDimensions.width / 2;
    let cardCenterY = windowDimensions.height / 2;

    const left = getValue(cardPos.left, "x");
    const right = getValue(cardPos.right, "x");
    const top = getValue(cardPos.top, "y");
    const bottom = getValue(cardPos.bottom, "y");

    if (left !== undefined) {
      cardCenterX = left + cardWidth / 2;
    } else if (right !== undefined) {
      cardCenterX = windowDimensions.width - right - cardWidth / 2;
    }

    if (top !== undefined) {
      cardCenterY = top;
      if (!cardPos.transform?.includes("translateY(-50%)")) {
        cardCenterY += cardHeight / 2;
      }
    } else if (bottom !== undefined) {
      cardCenterY = windowDimensions.height - bottom - cardHeight / 2;
    }

    return { x: cardCenterX, y: cardCenterY };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-20 pointer-events-none"
    >
      {/* SVG with full viewport dimensions */}
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        width={windowDimensions.width}
        height={windowDimensions.height}
        style={{ zIndex: 15 }}
        viewBox={`0 0 ${windowDimensions.width} ${windowDimensions.height}`}
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
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence>
          {visibleHobbies.map((hobbyIndex) => {
            const hobby = hobbies[hobbyIndex];
            if (!hobby) return null;

            const cardPos = getCardPosition(hobbyIndex, visibleHobbies.length);
            const partPos = getPartScreenPosition(hobby.partType);
            const cardCenter = getCardCenterPosition(cardPos);

            if (
              isNaN(cardCenter.x) ||
              isNaN(cardCenter.y) ||
              isNaN(partPos.x) ||
              isNaN(partPos.y)
            ) {
              return null;
            }

            // Create curved path with better control points
            const dx = partPos.x - cardCenter.x;
            const dy = partPos.y - cardCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Adjust control point based on distance and screen size
            const controlOffset = isMobile ? 0.15 : 0.25;
            const controlDistance = distance * controlOffset;

            // Create perpendicular offset for curve
            const perpX = (-dy / distance) * controlDistance;
            const perpY = (dx / distance) * controlDistance;

            const midX = (cardCenter.x + partPos.x) / 2;
            const midY = (cardCenter.y + partPos.y) / 2;

            const controlX = midX + perpX;
            const controlY = midY + perpY;

            return (
              <g key={`line-group-${hobbyIndex}`}>
                {/* Main connecting line */}
                <motion.path
                  d={`M ${cardCenter.x} ${cardCenter.y} Q ${controlX} ${controlY} ${partPos.x} ${partPos.y}`}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                  filter="url(#lineGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: hobbyIndex * 0.1 }}
                />

                {/* Glowing dot at part position */}
                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="3"
                  fill={hobby.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, delay: hobbyIndex * 0.1 + 0.6 }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${hobby.color})`,
                  }}
                />

                {/* Pulsing ring around part */}
                <motion.circle
                  cx={partPos.x}
                  cy={partPos.y}
                  r="6"
                  fill="none"
                  stroke={hobby.color}
                  strokeWidth="1"
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    delay: hobbyIndex * 0.1 + 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Hobby Cards */}
      <AnimatePresence>
        {visibleHobbies.map((hobbyIndex) => {
          const hobby = hobbies[hobbyIndex];
          if (!hobby) return null;

          const position = getCardPosition(hobbyIndex, visibleHobbies.length);

          return (
            <motion.div
              key={`hobby-${hobbyIndex}`}
              className="absolute pointer-events-auto z-20"
              style={position}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: hobbyIndex * 0.1 }}
            >
              <HobbyCard hobby={hobby} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function HobbyCard({ hobby }: { hobby: Hobby }) {
  const IconComponent = iconMap[hobby.icon as keyof typeof iconMap] || Camera;

  return (
    <motion.div
      className="bg-[#111111] border border-gray-600/50 rounded-lg
                 w-auto h-[40px] md:w-[200px] md:h-auto md:p-3 p-2
                 flex md:block items-center justify-center"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.2 }}
    >
   <div className="md:hidden flex items-center gap-2">
  <div
    className="w-6 h-6 rounded-full flex items-center justify-center"
    style={{
      backgroundColor: hobby.color + "20",
      border: `1px solid ${hobby.color}`,
    }}
  >
    <IconComponent size={14} style={{ color: hobby.color }} />
  </div>
  <span className="text-white text-xs font-medium truncate">{hobby.name}</span>
</div>

      <div className="hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: hobby.color + "20",
              border: `1px solid ${hobby.color}`,
              boxShadow: `0 0 10px ${hobby.color}30`,
            }}
          >
            <IconComponent size={16} style={{ color: hobby.color }} />
          </div>
          <span className="text-white text-sm font-semibold truncate">
            {hobby.name}
          </span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
          {hobby.description}
        </p>

        <div className="mt-2 flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: hobby.color + "60" }}
          />
          <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

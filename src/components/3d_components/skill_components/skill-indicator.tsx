"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SkillGridProps {
  skills: Array<{
    name: string;
    size: string;
    color: string;
    partType: string;
  }>;
  partPositions: Array<{
    id: string;
    position: any;
    screenPosition: { x: number; y: number };
  }>;
  visibleSkills: number[];
  currentSection: number;
}

const CORNERS = ["bottom-left", "bottom-right", "top-right"];

export default function SkillGrid({
  skills,
  partPositions,
  visibleSkills,
  currentSection,
}: SkillGridProps) {
  const [animatedSkills, setAnimatedSkills] = useState<number[]>([]);
  const skillRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (currentSection === 1) {
      requestAnimationFrame(() => {
        setAnimatedSkills(
          visibleSkills.filter((i) => i >= 0 && i < skills.length)
        );
      });
    } else {
      setAnimatedSkills([]);
    }
  }, [visibleSkills, currentSection, skills]);

  const getPartPosition = (partType: string, index: number) => {
    const filtered = partPositions.filter((p) => p.id.startsWith(partType));
    if (filtered[index % filtered.length])
      return filtered[index % filtered.length].screenPosition;
    return { x: 50, y: 50 };
  };

  if (currentSection !== 1 || animatedSkills.length === 0) return null;

  const cornerSkillGroups: Record<string, number[]> = {
    "bottom-left": [],
    "bottom-right": [],
    "top-right": [],
  };

  animatedSkills.forEach((skillIndex, i) => {
    const corner = CORNERS[i % CORNERS.length];
    cornerSkillGroups[corner].push(skillIndex);
  });

  return (
    <>
      {/* Skill Tags */}
      {CORNERS.map((corner) => {
        const positionClass =
          corner === "bottom-left"
            ? "left-14 bottom-8 items-start"
            : corner === "bottom-right"
            ? "right-14 bottom-8 items-end"
            : "left-4 top-24 items-start";

        return (
          <div
            key={corner}
            className={`fixed z-20 flex flex-col gap-2 ${positionClass}`}
          >
            {cornerSkillGroups[corner].map((index, i) => {
              const skill = skills[index];
              return (
                <motion.div
                  key={`${skill.name}-${i}`}
                  ref={(el) => {
                    skillRefs.current[`${skill.name}-${index}`] = el;
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative bg-[#100C08] border border-white/20 rounded-lg px-2 py-1.5`}
                >
                  <div className="text-xs text-white uppercase font-medium tracking-wide text-center">
                    {skill.name}
                  </div>
                  <div
                    className="absolute -top-1 -left-1 w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: skill.color,
                      boxShadow: `0 0 6px ${skill.color}88`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        );
      })}

      {/* SVG Connections */}
      <svg
        className="fixed inset-0 pointer-events-none z-10"
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <defs>
          <linearGradient
            id="skillGridGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(156, 163, 175, 0.2)" />
            <stop offset="100%" stopColor="rgba(156, 163, 175, 0.2)" />
          </linearGradient>
          <filter id="skillGridGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {animatedSkills.map((index, i) => {
          const skill = skills[index];
          const partPos = getPartPosition(skill.partType, index);
          const partX = (partPos.x / 100) * window.innerWidth;
          const partY = (partPos.y / 100) * window.innerHeight;

          const skillEl = skillRefs.current[`${skill.name}-${index}`];
          if (!skillEl) return null;

          const rect = skillEl.getBoundingClientRect();
          const skillX = rect.left + rect.width / 2;
          const skillY = rect.top + rect.height / 2;

          if (Math.abs(partX - skillX) < 1 && Math.abs(partY - skillY) < 1)
            return null;

          // Real bend at 30°-style using perpendicular offset from midpoint
          const dx = skillX - partX;
          const dy = skillY - partY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const bendLength = dist * 0.3;
          const nx = -dy / dist;
          const ny = dx / dist;

          const midX = (partX + skillX) / 2;
          const midY = (partY + skillY) / 2;

          const bendX = midX + nx * bendLength;
          const bendY = midY + ny * bendLength;

          return (
            <g key={`line-${skill.name}-${index}`}>
              <polyline
                points={`${partX},${partY} ${bendX},${bendY} ${skillX},${skillY}`}
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
                style={{ filter: `drop-shadow(0 0 4px ${skill.color})` }}
              />
              <circle
                cx={skillX}
                cy={skillY}
                r="1.5"
                fill="rgba(156, 163, 175, 0.8)"
              />
              <circle
                cx={bendX}
                cy={bendY}
                r="1"
                fill="rgba(156, 163, 175, 0.5)"
              />
            </g>
          );
        })}
      </svg>
    </>
  );
}

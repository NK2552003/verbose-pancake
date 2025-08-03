"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface RocketEngineProps {
  scrollProgress: number
  rotationSpeed?: number
  onPartPositionsUpdate?: (positions: PartPosition[]) => void
}

interface PartPosition {
  id: string
  position: THREE.Vector3
  screenPosition: { x: number; y: number }
}

// Advanced easing functions for smooth animations
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// Spring physics simulation
function springAnimation(current: number, target: number, velocity: number, stiffness = 0.1, damping = 0.8) {
  const force = (target - current) * stiffness
  velocity = (velocity + force) * damping
  const newPosition = current + velocity
  return { position: newPosition, velocity }
}

// Get viewport bounds for constraining parts
function getViewportBounds(camera: THREE.Camera, distance: number = 10) {
  if (camera instanceof THREE.PerspectiveCamera) {
    const height = 2 * Math.tan(camera.fov * Math.PI / 360) * distance
    const width = height * camera.aspect
    return { width: width * 0.8, height: height * 0.8 } // 80% of actual viewport for padding
  }
  // Fallback for other camera types
  return { width: 8, height: 6 }
}

// Main fuel tank component
function FuelTank({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  })

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      }),
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    const bounds = getViewportBounds(camera, 8)
    
    // Determine disassembly progress based on scroll
    let disassemblyProgress = 0
    if (scrollProgress >= 0.33 && scrollProgress < 0.66) {
      disassemblyProgress = easeOutElastic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress >= 0.66 && scrollProgress < 0.9) {
      disassemblyProgress = 1
    } else if (scrollProgress >= 0.9) {
      disassemblyProgress = 1 - easeOutBack((scrollProgress - 0.9) / 0.1)
    }

    // Calculate target positions within bounds
    const maxY = Math.min(bounds.height * 0.3, 4)
    const targetPos = {
      x: 0,
      y: 4 + (disassemblyProgress * maxY),
      z: 0
    }

    const targetRot = {
      x: disassemblyProgress * Math.PI * 0.3,
      y: 0,
      z: 0
    }

    // Apply spring physics
    const springX = springAnimation(groupRef.current.position.x, targetPos.x, springState.current.velocity.x, 0.12, 0.85)
    const springY = springAnimation(groupRef.current.position.y, targetPos.y, springState.current.velocity.y, 0.12, 0.85)
    const springZ = springAnimation(groupRef.current.position.z, targetPos.z, springState.current.velocity.z, 0.12, 0.85)

    groupRef.current.position.x = springX.position
    groupRef.current.position.y = springY.position
    groupRef.current.position.z = springZ.position

    springState.current.velocity.x = springX.velocity
    springState.current.velocity.y = springY.velocity
    springState.current.velocity.z = springZ.velocity

    // Smooth rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, 0.08)

    // Add floating animation when disassembled
    if (disassemblyProgress > 0.5) {
      groupRef.current.position.y += Math.sin(animationTime * 2) * 0.05 * disassemblyProgress
    }
  })

  return (
    <group ref={groupRef} userData={{ part: "tank" }}>
      {/* Main cylindrical tank */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 3, 16]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Horizontal bands */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[0, 1 - i * 0.7, 0]}>
          <torusGeometry args={[1.25, 0.05, 8, 16]} />
          <meshBasicMaterial color="#cccccc" wireframe transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Top dome */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// Bell nozzle component
function BellNozzle({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  useFrame((state) => {
    if (!meshRef.current) return

    const animationTime = state.clock.elapsedTime
    const bounds = getViewportBounds(camera, 8)
    
    // Determine disassembly progress
    let disassemblyProgress = 0
    if (scrollProgress >= 0.33 && scrollProgress < 0.66) {
      disassemblyProgress = easeInOutQuart((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress >= 0.66 && scrollProgress < 0.9) {
      disassemblyProgress = 1
    } else if (scrollProgress >= 0.9) {
      disassemblyProgress = 1 - easeOutBack((scrollProgress - 0.9) / 0.1)
    }

    // Calculate target positions within bounds
    const maxX = Math.min(bounds.width * 0.2, 2.5)
    const maxY = Math.min(bounds.height * 0.2, 2)
    const targetPos = {
      x: 0 + (disassemblyProgress * maxX),
      y: 1 + (disassemblyProgress * maxY),
      z: 0
    }

    // Apply spring physics
    const springX = springAnimation(meshRef.current.position.x, targetPos.x, springState.current.velocity.x, 0.1, 0.82)
    const springY = springAnimation(meshRef.current.position.y, targetPos.y, springState.current.velocity.y, 0.1, 0.82)
    const springZ = springAnimation(meshRef.current.position.z, targetPos.z, springState.current.velocity.z, 0.1, 0.82)

    meshRef.current.position.x = springX.position
    meshRef.current.position.y = springY.position
    meshRef.current.position.z = springZ.position

    springState.current.velocity.x = springX.velocity
    springState.current.velocity.y = springY.velocity
    springState.current.velocity.z = springZ.velocity

    // Rotation animation
    meshRef.current.rotation.z = disassemblyProgress * Math.PI * 0.4

    // Add floating motion
    if (disassemblyProgress > 0.3) {
      meshRef.current.position.y += Math.sin(animationTime * 1.5) * 0.03 * disassemblyProgress
    }
  })

  return (
    <mesh ref={meshRef} userData={{ part: "bell" }}>
      <coneGeometry args={[1.8, 2.5, 16]} />
      <meshBasicMaterial color="#dddddd" wireframe transparent opacity={0.8} />
    </mesh>
  )
}

// Small nozzle outlets
function SmallNozzles({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const springStates = useRef(
    Array(6).fill(null).map(() => ({
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 }
    }))
  )

  const nozzlePositions = useMemo(() => {
    const positions = []
    const count = 6
    const radius = 1.4

    const bounds = getViewportBounds(camera, 8)
    const maxRadius = Math.min(bounds.width * 0.25, bounds.height * 0.25, 3)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      positions.push({
        original: [x, 0, z] as [number, number, number],
        disassembled: [
          Math.cos(angle) * maxRadius,
          Math.max(-bounds.height * 0.2, -1.5),
          Math.sin(angle) * maxRadius
        ] as [number, number, number],
        delay: i * 0.1
      })
    }
    return positions
  }, [camera])

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    const bounds = getViewportBounds(camera, 8)
    
    // Determine disassembly progress
    let disassemblyProgress = 0
    if (scrollProgress >= 0.33 && scrollProgress < 0.66) {
      disassemblyProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress >= 0.66 && scrollProgress < 0.9) {
      disassemblyProgress = 1
    } else if (scrollProgress >= 0.9) {
      disassemblyProgress = 1 - easeOutBack((scrollProgress - 0.9) / 0.1)
    }

    // Animate main group
    const maxYDisplacement = Math.min(bounds.height * 0.3, 3)
    groupRef.current.position.y = -1 + (disassemblyProgress * -maxYDisplacement)
    groupRef.current.rotation.y = disassemblyProgress * Math.PI * 2

    // Animate individual nozzles
    groupRef.current.children.forEach((nozzle, index) => {
      const nozzleData = nozzlePositions[index]
      const staggeredProgress = Math.max(0, Math.min(1, (disassemblyProgress - nozzleData.delay) / (1 - nozzleData.delay)))
      const easedProgress = easeInOutQuart(staggeredProgress)

      const targetPos = {
        x: THREE.MathUtils.lerp(nozzleData.original[0], nozzleData.disassembled[0], easedProgress),
        y: THREE.MathUtils.lerp(nozzleData.original[1], nozzleData.disassembled[1], easedProgress),
        z: THREE.MathUtils.lerp(nozzleData.original[2], nozzleData.disassembled[2], easedProgress)
      }

      // Apply spring physics
      const spring = springStates.current[index]
      const springX = springAnimation(nozzle.position.x, targetPos.x, spring.velocity.x, 0.08, 0.8)
      const springY = springAnimation(nozzle.position.y, targetPos.y, spring.velocity.y, 0.08, 0.8)
      const springZ = springAnimation(nozzle.position.z, targetPos.z, spring.velocity.z, 0.08, 0.8)

      nozzle.position.x = springX.position
      nozzle.position.y = springY.position
      nozzle.position.z = springZ.position

      spring.velocity.x = springX.velocity
      spring.velocity.y = springY.velocity
      spring.velocity.z = springZ.velocity

      // Add floating animation
      if (easedProgress > 0.5) {
        nozzle.position.y += Math.sin(animationTime * 2 + index * 0.5) * 0.03 * easedProgress
      }
    })
  })

  return (
    <group ref={groupRef} userData={{ part: "nozzles" }}>
      {nozzlePositions.map((pos, index) => (
        <mesh key={index} position={pos.original} userData={{ nozzleIndex: index }}>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshBasicMaterial color="#aaaaaa" wireframe transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// Internal mechanical components
function InternalMechanics({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    const bounds = getViewportBounds(camera, 8)
    
    // Determine disassembly progress
    let disassemblyProgress = 0
    if (scrollProgress >= 0.33 && scrollProgress < 0.66) {
      disassemblyProgress = easeOutElastic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress >= 0.66 && scrollProgress < 0.9) {
      disassemblyProgress = 1
    } else if (scrollProgress >= 0.9) {
      disassemblyProgress = 1 - easeOutBack((scrollProgress - 0.9) / 0.1)
    }

    // Calculate target positions within bounds
    const maxX = Math.min(bounds.width * 0.25, 3)
    const maxY = Math.min(bounds.height * 0.15, 1.5)
    const targetPos = {
      x: 0 + (disassemblyProgress * -maxX),
      y: 0 + (disassemblyProgress * -maxY),
      z: 0
    }

    // Apply spring physics
    const springX = springAnimation(groupRef.current.position.x, targetPos.x, springState.current.velocity.x, 0.15, 0.88)
    const springY = springAnimation(groupRef.current.position.y, targetPos.y, springState.current.velocity.y, 0.15, 0.88)
    const springZ = springAnimation(groupRef.current.position.z, targetPos.z, springState.current.velocity.z, 0.15, 0.88)

    groupRef.current.position.x = springX.position
    groupRef.current.position.y = springY.position
    groupRef.current.position.z = springZ.position

    springState.current.velocity.x = springX.velocity
    springState.current.velocity.y = springY.velocity
    springState.current.velocity.z = springZ.velocity

    // Rotation animations
    groupRef.current.rotation.y = disassemblyProgress * Math.PI * 4
    groupRef.current.rotation.x = disassemblyProgress * Math.PI * 0.6

    // Add floating motion
    if (disassemblyProgress > 0.3) {
      groupRef.current.position.y += Math.sin(animationTime * 1.8) * 0.04 * disassemblyProgress
    }
  })

  return (
    <group ref={groupRef} userData={{ part: "internals" }}>
      {/* Central pump assembly */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1, 8]} />
        <meshBasicMaterial color="#888888" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Connecting pipes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 0.9
        const z = Math.sin(angle) * 0.9
        return (
          <group key={i}>
            {/* Radial pipes */}
            <mesh position={[x * 0.5, -0.3, z * 0.5]} rotation={[0, angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
              <meshBasicMaterial color="#999999" wireframe transparent opacity={0.5} />
            </mesh>
            {/* Valve assemblies */}
            <mesh position={[x, -0.8, z]}>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshBasicMaterial color="#777777" wireframe transparent opacity={0.6} />
            </mesh>
          </group>
        )
      })}

      {/* Central turbine */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 12]} />
        <meshBasicMaterial color="#666666" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Injector plate */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 16]} />
        <meshBasicMaterial color="#aaaaaa" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Injector holes */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 0.7
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <mesh key={i} position={[x, 1.85, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 6]} />
            <meshBasicMaterial color="#555555" wireframe transparent opacity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

// Fire exhaust component
function FireExhaust({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const flameRefs = useRef<THREE.Mesh[]>([])
  const { camera } = useThree()
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  // Animate fire effects
  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    const bounds = getViewportBounds(camera, 8)
    
    // Determine disassembly progress
    let disassemblyProgress = 0
    if (scrollProgress >= 0.33 && scrollProgress < 0.66) {
      disassemblyProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress >= 0.66 && scrollProgress < 0.9) {
      disassemblyProgress = 1
    } else if (scrollProgress >= 0.9) {
      disassemblyProgress = 1 - easeOutBack((scrollProgress - 0.9) / 0.1)
    }

    // Calculate target positions within bounds
    const maxY = Math.min(bounds.height * 0.4, 4)
    const targetPos = {
      x: 0,
      y: -2 + (disassemblyProgress * -maxY),
      z: 0
    }

    // Apply spring physics
    const springX = springAnimation(groupRef.current.position.x, targetPos.x, springState.current.velocity.x, 0.1, 0.85)
    const springY = springAnimation(groupRef.current.position.y, targetPos.y, springState.current.velocity.y, 0.1, 0.85)
    const springZ = springAnimation(groupRef.current.position.z, targetPos.z, springState.current.velocity.z, 0.1, 0.85)

    groupRef.current.position.x = springX.position
    groupRef.current.position.y = springY.position
    groupRef.current.position.z = springZ.position

    springState.current.velocity.x = springX.velocity
    springState.current.velocity.y = springY.velocity
    springState.current.velocity.z = springZ.velocity

    // Rotation animation
    groupRef.current.rotation.y = -disassemblyProgress * Math.PI * 2

    // Animate individual flames
    flameRefs.current.forEach((flame, index) => {
      if (flame && flame.material) {
        const offset = index * 0.5
        flame.scale.y = 1 + Math.sin(animationTime * 4 + offset) * 0.3
        
        // Adjust opacity based on disassembly
        const baseOpacity = disassemblyProgress > 0 ? 0.3 : 0.8
        const material = flame.material as THREE.Material
        if ('opacity' in material) {
          material.opacity = baseOpacity + Math.sin(animationTime * 6 + offset) * 0.2
        }
      }
    })
  })

  return (
    <group ref={groupRef} userData={{ part: "exhaust" }}>
      {/* Main engine exhaust */}
      <mesh ref={(el) => el && (flameRefs.current[0] = el)} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshBasicMaterial color="#ff4400" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Secondary exhaust flames */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 1.4
        const z = Math.sin(angle) * 1.4
        return (
          <mesh
            key={i}
            ref={(el) => el && (flameRefs.current[i + 1] = el)}
            position={[x, -0.5, z]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.3, 1.5, 6]} />
            <meshBasicMaterial color="#ff6600" wireframe transparent opacity={0.7} />
          </mesh>
        )
      })}

      {/* Exhaust glow rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[0, -i * 0.8, 0]}>
          <torusGeometry args={[1.2 + i * 0.3, 0.1, 8, 16]} />
          <meshBasicMaterial color="#ffaa00" wireframe transparent opacity={0.4 - i * 0.1} />
        </mesh>
      ))}
    </group>
  )
}

// Main rocket engine assembly
function RocketEngine({ scrollProgress, rotationSpeed = 0.003, onPartPositionsUpdate }: RocketEngineProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport, camera } = useThree()
  const targetRotation = useRef({ x: 0, y: 0, z: 0 })
  const currentRotation = useRef({ x: 0, y: 0, z: 0 })
  const targetPosition = useRef({ x: 0, y: 0, z: 0 })
  const currentPosition = useRef({ x: 0, y: 0, z: 0 })
  const animationTime = useRef(0)

  // Responsive scaling with tighter bounds
  const { responsiveScale } = useMemo(() => {
    const baseScale = 0.6
    const minScale = 0.3
    const maxScale = 0.8

    const widthFactor = Math.min(viewport.width / 12, 1)
    const heightFactor = Math.min(viewport.height / 14, 1)
    const scaleFactor = Math.min(widthFactor, heightFactor)

    const scale = Math.max(minScale, Math.min(maxScale, baseScale * scaleFactor))

    return { responsiveScale: scale }
  }, [viewport.width, viewport.height])

  // Update part positions for indicators
  const updatePartPositions = () => {
    if (!groupRef.current || !onPartPositionsUpdate) return

    const positions: PartPosition[] = []
    const tempVector = new THREE.Vector3()

    // Get positions of key parts
    groupRef.current.children.forEach((child, index) => {
      child.getWorldPosition(tempVector)
      tempVector.project(camera)
      positions.push({
        id: `part-${index}`,
        position: tempVector.clone(),
        screenPosition: {
          x: (tempVector.x * 0.5 + 0.5) * 100,
          y: (-tempVector.y * 0.5 + 0.5) * 100,
        },
      })
    })

    onPartPositionsUpdate(positions)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return

    animationTime.current += delta

    // Determine which section we're in based on scroll progress
    const isFirstSection = scrollProgress < 0.33
    const isSecondSection = scrollProgress >= 0.33 && scrollProgress < 0.66
    const isThirdSection = scrollProgress >= 0.66

    // Calculate section transition progress
    let sectionTransition = 0
    if (scrollProgress < 0.33) {
      sectionTransition = scrollProgress / 0.33
    } else if (scrollProgress < 0.66) {
      sectionTransition = (scrollProgress - 0.33) / 0.33
    } else {
      sectionTransition = (scrollProgress - 0.66) / 0.34
    }

    // Main group rotations and positions based on scroll sections
    if (isFirstSection) {
      // Hero section - gentle rotation and movement
      targetRotation.current.y = Math.sin(sectionTransition * Math.PI * 1.5) * 0.5
      targetRotation.current.x = Math.cos(sectionTransition * Math.PI * 2) * 0.3
      targetRotation.current.z = Math.sin(sectionTransition * Math.PI * 2.5) * 0.2

      targetPosition.current.y = Math.sin(sectionTransition * Math.PI * 3) * 0.2
      targetPosition.current.x = Math.cos(sectionTransition * Math.PI * 1.5) * 0.15
    } else if (isSecondSection) {
      // Skills section - focused viewing angle
      const baseY = Math.PI * 0.25
      const baseX = Math.PI * 0.15

      targetRotation.current.y = baseY + Math.sin(animationTime.current * 0.5) * 0.1
      targetRotation.current.x = baseX + Math.cos(animationTime.current * 0.3) * 0.05
      targetRotation.current.z = 0

      targetPosition.current.y = 0
      targetPosition.current.x = 0
    } else if (isThirdSection) {
      // Projects/Contact section
      const baseY = Math.PI * 0.75
      const baseX = -Math.PI * 0.1

      if (scrollProgress < 0.9) {
        targetRotation.current.y = baseY + Math.sin(animationTime.current * 0.4) * 0.15
        targetRotation.current.x = baseX + Math.cos(animationTime.current * 0.6) * 0.08
      } else {
        // Contact section - reassembly animation
        const reassembleProgress = (scrollProgress - 0.9) / 0.1
        targetRotation.current.y = baseY + Math.sin(reassembleProgress * Math.PI) * 0.3
        targetRotation.current.x = baseX + Math.cos(reassembleProgress * Math.PI * 0.5) * 0.15
        targetRotation.current.z = Math.sin(reassembleProgress * Math.PI * 2) * 0.1
      }

      targetPosition.current.y = Math.sin(sectionTransition * Math.PI) * 0.2
      targetPosition.current.z = Math.cos(sectionTransition * Math.PI * 0.5) * 0.1
    }

    // Smooth interpolation
    const lerpSpeed = 0.06

    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, lerpSpeed)
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, lerpSpeed)
    currentRotation.current.z = THREE.MathUtils.lerp(currentRotation.current.z, targetRotation.current.z, lerpSpeed)

    currentPosition.current.x = THREE.MathUtils.lerp(currentPosition.current.x, targetPosition.current.x, lerpSpeed)
    currentPosition.current.y = THREE.MathUtils.lerp(currentPosition.current.y, targetPosition.current.y, lerpSpeed)
    currentPosition.current.z = THREE.MathUtils.lerp(currentPosition.current.z, targetPosition.current.z, lerpSpeed)

    // Apply transformations
    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y + (rotationSpeed * animationTime.current)
    groupRef.current.rotation.z = currentRotation.current.z

    groupRef.current.position.x = currentPosition.current.x
    groupRef.current.position.y = currentPosition.current.y
    groupRef.current.position.z = currentPosition.current.z

    groupRef.current.scale.setScalar(responsiveScale)

    // Update part positions for indicators
    updatePartPositions()
  })

  return (
    <group ref={groupRef}>
      <FuelTank scrollProgress={scrollProgress} />
      <BellNozzle scrollProgress={scrollProgress} />
      <SmallNozzles scrollProgress={scrollProgress} />
      <InternalMechanics scrollProgress={scrollProgress} />
      <FireExhaust scrollProgress={scrollProgress} />
    </group>
  )
}

function ResponsiveCamera() {
  const { camera, viewport } = useThree()

  useEffect(() => {
    const isMobile = viewport.width < 4
    const isTablet = viewport.width >= 4 && viewport.width < 8

    if (isMobile) {
      camera.position.set(10, 8, 10)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 75
        camera.updateProjectionMatrix()
      }
    } else if (isTablet) {
      camera.position.set(9, 7, 9)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 65
        camera.updateProjectionMatrix()
      }
    } else {
      camera.position.set(8, 6, 10)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 55
        camera.updateProjectionMatrix()
      }
    }
    
    // Ensure camera always looks at center
    camera.lookAt(0, 0, 0)
  }, [camera, viewport.width])

  return null
}

// Scene component
function Scene({ scrollProgress, rotationSpeed, onPartPositionsUpdate }: RocketEngineProps) {
  return (
    <>
      <color attach="background" args={["#1a1a1a"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#cccccc" />
      <ResponsiveCamera />
      <RocketEngine 
        scrollProgress={scrollProgress} 
        rotationSpeed={rotationSpeed}
        onPartPositionsUpdate={onPartPositionsUpdate}
      />
    </>
  )
}

export default function RocketEngineComponent({ scrollProgress, rotationSpeed = 0.003, onPartPositionsUpdate }: RocketEngineProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-transparent" />
  }

  return (
    <Canvas
      camera={{
        position: [8, 6, 10],
        fov: 55,
      }}
      gl={{
        powerPreference: "high-performance",
        antialias: false,
        alpha: true,
        depth: true,
        stencil: false,
        failIfMajorPerformanceCaveat: true,
        preserveDrawingBuffer: false,
      }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
    >
      <Scene 
        scrollProgress={scrollProgress} 
        rotationSpeed={rotationSpeed}
        onPartPositionsUpdate={onPartPositionsUpdate}
      />
    </Canvas>
  )
}
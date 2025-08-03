"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useEffect, useState } from "react"
import * as THREE from "three"

interface TurbineWheelProps {
  scrollProgress: number
  rotationSpeed: number
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

function TurbineWheel({ scrollProgress, rotationSpeed, onPartPositionsUpdate }: TurbineWheelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const hubRef = useRef<THREE.Mesh>(null)
  const bladesRef = useRef<THREE.Group>(null)
  const spokesRef = useRef<THREE.Group>(null)
  const holesRef = useRef<THREE.Group>(null)

  const { viewport, camera, gl } = useThree()
  const targetRotation = useRef({ x: 0, y: 0, z: 0 })
  const currentRotation = useRef({ x: 0, y: 0, z: 0 })
  const targetPosition = useRef({ x: 0, y: 0, z: 0 })
  const currentPosition = useRef({ x: 0, y: 0, z: 0 })
  const targetScale = useRef(1)
  const currentScale = useRef(1)

  // Animation state
  const [disassemblyProgress, setDisassemblyProgress] = useState(0)
  const [reassemblyProgress, setReassemblyProgress] = useState(0)
  const animationTime = useRef(0)

  // Spring physics for each part
  const springStates = useRef({
    hub: { position: { x: 0, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    blades: Array(8)
      .fill(null)
      .map(() => ({
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
      })),
    spokes: Array(4)
      .fill(null)
      .map(() => ({
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      })),
    holes: Array(4)
      .fill(null)
      .map(() => ({
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      })),
  })

  // Calculate responsive scale and disassembly bounds
const { responsiveScale, disassemblyBounds } = useMemo(() => {
  const baseScale = 0.9         // ↓ reduced from 1
  const minScale = 0.5          // ↓ reduced from 0.6
  const maxScale = 1.2          // ↓ reduced from 1.4

  const widthFactor = Math.min(viewport.width / 8, 1)
  const heightFactor = Math.min(viewport.height / 6, 1)
  const scaleFactor = Math.min(widthFactor, heightFactor)

  const scale = Math.max(minScale, Math.min(maxScale, baseScale * scaleFactor))

  // Calculate safe disassembly bounds based on viewport and camera
  const isMobile = viewport.width < 4
  const isTablet = viewport.width >= 4 && viewport.width < 8

  let maxRadius, maxHeight
  if (isMobile) {
    maxRadius = 1.8
    maxHeight = 1.2
  } else if (isTablet) {
    maxRadius = 2.2
    maxHeight = 1.5
  } else {
    maxRadius = 2.8
    maxHeight = 1.8
  }

  return {
    responsiveScale: scale,
    disassemblyBounds: { maxRadius, maxHeight },
  }
}, [viewport.width, viewport.height])

  // Create the central hub
  const hubGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 12)
    return geometry
  }, [])

  // Create individual blade geometry
  const bladeGeometry = useMemo(() => {
    const shape = new THREE.Shape()

    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.5, 0.2, 1.2, 0.1)
    shape.quadraticCurveTo(1.8, 0, 2.2, -0.3)
    shape.quadraticCurveTo(2.0, -0.8, 1.5, -1.0)
    shape.quadraticCurveTo(0.8, -0.9, 0.2, -0.6)
    shape.quadraticCurveTo(0, -0.3, 0, 0)

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Create array of blades positioned around the hub
  const blades = useMemo(() => {
    const bladeCount = 8
    const bladeArray = []

    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2
      // Constrain disassembly within bounds
      const disassembledRadius = disassemblyBounds.maxRadius * (0.7 + Math.sin(i * 0.5) * 0.3)
      const disassembledHeight = Math.cos(i * 0.3) * disassemblyBounds.maxHeight * 0.6

      bladeArray.push({
        position: [Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2] as [number, number, number],
        rotation: [0, angle + Math.PI / 2, Math.PI / 12] as [number, number, number],
        disassembledPosition: [
          Math.cos(angle) * disassembledRadius,
          disassembledHeight,
          Math.sin(angle) * disassembledRadius,
        ] as [number, number, number],
        disassembledRotation: [
          Math.sin(i * 0.7) * 0.3,
          angle + Math.PI / 2 + Math.sin(i * 0.4) * 0.4,
          Math.PI / 12 + Math.cos(i * 0.6) * 0.2,
        ] as [number, number, number],
        delay: i * 0.1, // Staggered animation
      })
    }

    return bladeArray
  }, [disassemblyBounds])

  // Create mounting holes in the center
  const mountingHoles = useMemo(() => {
    const holes = []
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      // Constrain holes within smaller radius
      const disassembledRadius = disassemblyBounds.maxRadius * (0.5 + Math.cos(i * 0.8) * 0.2)

      holes.push({
        position: [Math.cos(angle) * 0.3, 0.2, Math.sin(angle) * 0.3] as [number, number, number],
        disassembledPosition: [
          Math.cos(angle) * disassembledRadius,
          disassemblyBounds.maxHeight * (0.8 + Math.sin(i * 1.2) * 0.2),
          Math.sin(angle) * disassembledRadius,
        ] as [number, number, number],
        disassembledRotation: [Math.cos(i * 0.9) * 0.3, angle + Math.sin(i * 0.5) * 0.3, Math.sin(i * 0.7) * 0.2] as [
          number,
          number,
          number,
        ],
        delay: i * 0.15,
      })
    }
    return holes
  }, [disassemblyBounds])

  // Create spokes
  const spokes = useMemo(() => {
    return [0, 1, 2, 3].map((i) => ({
      rotation: [0, (i * Math.PI) / 2, 0] as [number, number, number],
      disassembledPosition: [
        Math.cos((i * Math.PI) / 2) * disassemblyBounds.maxRadius * (0.8 + Math.sin(i * 0.6) * 0.2),
        -disassemblyBounds.maxHeight * (0.6 + Math.cos(i * 0.8) * 0.3),
        Math.sin((i * Math.PI) / 2) * disassemblyBounds.maxRadius * (0.8 + Math.cos(i * 0.4) * 0.2),
      ] as [number, number, number],
      disassembledRotation: [
        Math.sin(i * 0.5) * 0.2,
        (i * Math.PI) / 2 + Math.cos(i * 0.7) * 0.3,
        Math.sin(i * 0.9) * 0.15,
      ] as [number, number, number],
      delay: i * 0.12,
    }))
  }, [disassemblyBounds])

  // Update part positions for skill/stat indicators
  const updatePartPositions = () => {
    if (!groupRef.current || !onPartPositionsUpdate) return

    const positions: PartPosition[] = []
    const tempVector = new THREE.Vector3()

    // Hub position
    if (hubRef.current) {
      hubRef.current.getWorldPosition(tempVector)
      tempVector.project(camera)
      positions.push({
        id: "hub",
        position: tempVector.clone(),
        screenPosition: {
          x: (tempVector.x * 0.5 + 0.5) * 100,
          y: (-tempVector.y * 0.5 + 0.5) * 100,
        },
      })
    }

    // Blade positions
    if (bladesRef.current) {
      bladesRef.current.children.forEach((blade, index) => {
        blade.getWorldPosition(tempVector)
        tempVector.project(camera)
        positions.push({
          id: `blade-${index}`,
          position: tempVector.clone(),
          screenPosition: {
            x: (tempVector.x * 0.5 + 0.5) * 100,
            y: (-tempVector.y * 0.5 + 0.5) * 100,
          },
        })
      })
    }

    // Hole positions
    if (holesRef.current) {
      holesRef.current.children.forEach((hole, index) => {
        hole.getWorldPosition(tempVector)
        tempVector.project(camera)
        positions.push({
          id: `hole-${index}`,
          position: tempVector.clone(),
          screenPosition: {
            x: (tempVector.x * 0.5 + 0.5) * 100,
            y: (-tempVector.y * 0.5 + 0.5) * 100,
          },
        })
      })
    }

    onPartPositionsUpdate(positions)
  }

  useFrame((state, delta) => {
    if (groupRef.current) {
      animationTime.current += delta

      // Update target scale based on responsive scale
      targetScale.current = responsiveScale

      // Determine which section we're in based on scroll progress
      const isFirstSection = scrollProgress < 0.33
      const isSecondSection = scrollProgress >= 0.33 && scrollProgress < 0.66
      const isThirdSection = scrollProgress >= 0.66

      // Calculate smooth transition progress between sections
      let sectionTransition = 0
      if (scrollProgress < 0.33) {
        sectionTransition = scrollProgress / 0.33
      } else if (scrollProgress < 0.66) {
        sectionTransition = (scrollProgress - 0.33) / 0.33
      } else {
        sectionTransition = (scrollProgress - 0.66) / 0.34
      }

      // Handle disassembly/reassembly with smooth easing
      let targetDisassembly = 0
      if (isSecondSection) {
        // Skills section - disassemble with elastic easing
        targetDisassembly = easeOutElastic(sectionTransition)
        setReassemblyProgress(0)
      } else if (isThirdSection && scrollProgress < 0.9) {
        // GitHub section - keep disassembled
        targetDisassembly = 1
        setReassemblyProgress(0)
      } else if (scrollProgress >= 0.9) {
        // Contact section - reassemble with back easing
        const reassembleProgress = (scrollProgress - 0.9) / 0.1
        targetDisassembly = 1 - easeOutBack(reassembleProgress)
        setReassemblyProgress(easeOutBack(reassembleProgress))
      } else {
        // Hero section - assembled
        targetDisassembly = 0
        setReassemblyProgress(0)
      }

      // Smooth interpolation for disassembly progress
      setDisassemblyProgress(THREE.MathUtils.lerp(disassemblyProgress, targetDisassembly, 0.08))

      // Main group rotations and positions
      if (isFirstSection) {
        const baseY = 0
        const baseX = 0
        const baseZ = 0

        targetRotation.current.y = baseY + Math.sin(sectionTransition * Math.PI * 1.5) * 0.5
        targetRotation.current.x = baseX + Math.cos(sectionTransition * Math.PI * 2) * 0.3
        targetRotation.current.z = baseZ + Math.sin(sectionTransition * Math.PI * 2.5) * 0.2

        targetPosition.current.y = Math.sin(sectionTransition * Math.PI * 3) * 0.2
        targetPosition.current.x = Math.cos(sectionTransition * Math.PI * 1.5) * 0.15
        targetPosition.current.z = 0
      } else if (isSecondSection) {
        const baseY = Math.PI * 0.25
        const baseX = Math.PI * 0.15
        const baseZ = 0

        targetRotation.current.y = baseY + Math.sin(animationTime.current * 0.5) * 0.1
        targetRotation.current.x = baseX + Math.cos(animationTime.current * 0.3) * 0.05
        targetRotation.current.z = baseZ

        targetPosition.current.y = 0
        targetPosition.current.x = 0
        targetPosition.current.z = 0
      } else if (isThirdSection) {
        const baseY = Math.PI * 0.75
        const baseX = -Math.PI * 0.1
        const baseZ = Math.PI * 0.05

        if (scrollProgress < 0.9) {
          targetRotation.current.y = baseY + Math.sin(animationTime.current * 0.4) * 0.15
          targetRotation.current.x = baseX + Math.cos(animationTime.current * 0.6) * 0.08
          targetRotation.current.z = baseZ
        } else {
          const reassembleProgress = (scrollProgress - 0.9) / 0.1
          targetRotation.current.y = baseY + Math.sin(reassembleProgress * Math.PI) * 0.3
          targetRotation.current.x = baseX + Math.cos(reassembleProgress * Math.PI * 0.5) * 0.15
          targetRotation.current.z = baseZ + Math.sin(reassembleProgress * Math.PI * 2) * 0.1
        }

        targetPosition.current.y = Math.sin(sectionTransition * Math.PI) * 0.2
        targetPosition.current.z = Math.cos(sectionTransition * Math.PI * 0.5) * 0.1
      }

      // Smooth interpolation with spring physics
      const lerpSpeed = 0.06

      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, lerpSpeed)
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, lerpSpeed)
      currentRotation.current.z = THREE.MathUtils.lerp(currentRotation.current.z, targetRotation.current.z, lerpSpeed)

      currentPosition.current.x = THREE.MathUtils.lerp(currentPosition.current.x, targetPosition.current.x, lerpSpeed)
      currentPosition.current.y = THREE.MathUtils.lerp(currentPosition.current.y, targetPosition.current.y, lerpSpeed)
      currentPosition.current.z = THREE.MathUtils.lerp(currentPosition.current.z, targetPosition.current.z, lerpSpeed)

      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, lerpSpeed)

      // Apply transformations
      groupRef.current.rotation.x = currentRotation.current.x
      groupRef.current.rotation.y = currentRotation.current.y
      groupRef.current.rotation.z = currentRotation.current.z

      groupRef.current.position.x = currentPosition.current.x
      groupRef.current.position.y = currentPosition.current.y
      groupRef.current.position.z = currentPosition.current.z

      groupRef.current.scale.setScalar(currentScale.current)

      // Animate individual parts with staggered timing and spring physics
      const progress = disassemblyProgress

      // Animate hub with spring physics
      if (hubRef.current) {
        const hubDisassembledPos = [
          0,
          disassemblyBounds.maxHeight * 0.8 + Math.sin(animationTime.current * 2) * 0.05,
          0,
        ]
        const hubTarget = {
          x: THREE.MathUtils.lerp(0, hubDisassembledPos[0], progress),
          y: THREE.MathUtils.lerp(0, hubDisassembledPos[1], progress),
          z: THREE.MathUtils.lerp(0, hubDisassembledPos[2], progress),
        }

        // Apply spring physics
        const hubSpring = springStates.current.hub
        const springX = springAnimation(hubRef.current.position.x, hubTarget.x, hubSpring.velocity.x, 0.12, 0.85)
        const springY = springAnimation(hubRef.current.position.y, hubTarget.y, hubSpring.velocity.y, 0.12, 0.85)
        const springZ = springAnimation(hubRef.current.position.z, hubTarget.z, hubSpring.velocity.z, 0.12, 0.85)

        hubRef.current.position.x = springX.position
        hubRef.current.position.y = springY.position
        hubRef.current.position.z = springZ.position

        hubSpring.velocity.x = springX.velocity
        hubSpring.velocity.y = springY.velocity
        hubSpring.velocity.z = springZ.velocity

        // Add rotation animation
        hubRef.current.rotation.y = Math.sin(animationTime.current * 1.5) * progress * 0.3
        hubRef.current.rotation.x = Math.cos(animationTime.current * 1.2) * progress * 0.2
      }

      // Animate blade positions with staggered timing
      if (bladesRef.current) {
        bladesRef.current.children.forEach((blade, index) => {
          const bladeData = blades[index]
          const staggeredProgress = Math.max(0, Math.min(1, (progress - bladeData.delay) / (1 - bladeData.delay)))
          const easedProgress = easeInOutQuart(staggeredProgress)

          const originalPos = bladeData.position
          const disassembledPos = bladeData.disassembledPosition
          const originalRot = bladeData.rotation
          const disassembledRot = bladeData.disassembledRotation

          const bladeTarget = {
            x: THREE.MathUtils.lerp(originalPos[0], disassembledPos[0], easedProgress),
            y: THREE.MathUtils.lerp(originalPos[1], disassembledPos[1], easedProgress),
            z: THREE.MathUtils.lerp(originalPos[2], disassembledPos[2], easedProgress),
          }

          // Apply spring physics
          const bladeSpring = springStates.current.blades[index]
          const springX = springAnimation(blade.position.x, bladeTarget.x, bladeSpring.velocity.x, 0.1, 0.82)
          const springY = springAnimation(blade.position.y, bladeTarget.y, bladeSpring.velocity.y, 0.1, 0.82)
          const springZ = springAnimation(blade.position.z, bladeTarget.z, bladeSpring.velocity.z, 0.1, 0.82)

          blade.position.x = springX.position
          blade.position.y = springY.position
          blade.position.z = springZ.position

          bladeSpring.velocity.x = springX.velocity
          bladeSpring.velocity.y = springY.velocity
          bladeSpring.velocity.z = springZ.velocity

          // Smooth rotation interpolation
          blade.rotation.x = THREE.MathUtils.lerp(originalRot[0], disassembledRot[0], easedProgress)
          blade.rotation.y = THREE.MathUtils.lerp(originalRot[1], disassembledRot[1], easedProgress)
          blade.rotation.z = THREE.MathUtils.lerp(originalRot[2], disassembledRot[2], easedProgress)

          // Add floating animation when disassembled
          if (easedProgress > 0.5) {
            blade.position.y += Math.sin(animationTime.current * 2 + index * 0.5) * 0.03 * easedProgress
            blade.rotation.z += Math.sin(animationTime.current * 1.5 + index * 0.3) * 0.01 * easedProgress
          }

          // Scale animation
          const scaleTarget = 1 + easedProgress * 0.05
          blade.scale.setScalar(THREE.MathUtils.lerp(blade.scale.x, scaleTarget, 0.1))
        })
      }

      // Animate spoke positions with staggered timing
      if (spokesRef.current) {
        spokesRef.current.children.forEach((spoke, index) => {
          const spokeData = spokes[index]
          const staggeredProgress = Math.max(0, Math.min(1, (progress - spokeData.delay) / (1 - spokeData.delay)))
          const easedProgress = easeInOutCubic(staggeredProgress)

          const disassembledPos = spokeData.disassembledPosition
          const disassembledRot = spokeData.disassembledRotation

          const spokeTarget = {
            x: THREE.MathUtils.lerp(0, disassembledPos[0], easedProgress),
            y: THREE.MathUtils.lerp(0, disassembledPos[1], easedProgress),
            z: THREE.MathUtils.lerp(0, disassembledPos[2], easedProgress),
          }

          // Apply spring physics
          const spokeSpring = springStates.current.spokes[index]
          const springX = springAnimation(spoke.position.x, spokeTarget.x, spokeSpring.velocity.x, 0.08, 0.8)
          const springY = springAnimation(spoke.position.y, spokeTarget.y, spokeSpring.velocity.y, 0.08, 0.8)
          const springZ = springAnimation(spoke.position.z, spokeTarget.z, spokeSpring.velocity.z, 0.08, 0.8)

          spoke.position.x = springX.position
          spoke.position.y = springY.position
          spoke.position.z = springZ.position

          spokeSpring.velocity.x = springX.velocity
          spokeSpring.velocity.y = springY.velocity
          spokeSpring.velocity.z = springZ.velocity

          // Rotation animation
          spoke.rotation.x = THREE.MathUtils.lerp(0, disassembledRot[0], easedProgress)
          spoke.rotation.y = THREE.MathUtils.lerp(spokeData.rotation[1], disassembledRot[1], easedProgress)
          spoke.rotation.z = THREE.MathUtils.lerp(0, disassembledRot[2], easedProgress)
        })
      }

      // Animate hole positions with staggered timing
      if (holesRef.current) {
        holesRef.current.children.forEach((hole, index) => {
          const holeData = mountingHoles[index]
          const staggeredProgress = Math.max(0, Math.min(1, (progress - holeData.delay) / (1 - holeData.delay)))
          const easedProgress = easeOutElastic(staggeredProgress)

          const originalPos = holeData.position
          const disassembledPos = holeData.disassembledPosition
          const disassembledRot = holeData.disassembledRotation

          const holeTarget = {
            x: THREE.MathUtils.lerp(originalPos[0], disassembledPos[0], easedProgress),
            y: THREE.MathUtils.lerp(originalPos[1], disassembledPos[1], easedProgress),
            z: THREE.MathUtils.lerp(originalPos[2], disassembledPos[2], easedProgress),
          }

          // Apply spring physics
          const holeSpring = springStates.current.holes[index]
          const springX = springAnimation(hole.position.x, holeTarget.x, holeSpring.velocity.x, 0.15, 0.88)
          const springY = springAnimation(hole.position.y, holeTarget.y, holeSpring.velocity.y, 0.15, 0.88)
          const springZ = springAnimation(hole.position.z, holeTarget.z, holeSpring.velocity.z, 0.15, 0.88)

          hole.position.x = springX.position
          hole.position.y = springY.position
          hole.position.z = springZ.position

          holeSpring.velocity.x = springX.velocity
          holeSpring.velocity.y = springY.velocity
          holeSpring.velocity.z = springZ.velocity

          // Rotation animation
          hole.rotation.x = THREE.MathUtils.lerp(0, disassembledRot[0], easedProgress)
          hole.rotation.y = THREE.MathUtils.lerp(0, disassembledRot[1], easedProgress)
          hole.rotation.z = THREE.MathUtils.lerp(0, disassembledRot[2], easedProgress)

          // Add orbital motion when disassembled (reduced)
          if (easedProgress > 0.3) {
            hole.position.x += Math.cos(animationTime.current * 1.8 + (index * Math.PI) / 2) * 0.05 * easedProgress
            hole.position.z += Math.sin(animationTime.current * 1.8 + (index * Math.PI) / 2) * 0.05 * easedProgress
          }
        })
      }

      // Update part positions for indicators
      updatePartPositions()
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central hub */}
      <mesh ref={hubRef} geometry={hubGeometry}>
        <meshBasicMaterial color="#e5e7eb" wireframe={true} />
      </mesh>

      {/* Mounting holes */}
      <group ref={holesRef}>
        {mountingHoles.map((hole, index) => (
          <mesh key={index} position={hole.position}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
            <meshBasicMaterial color="#e5e7eb" wireframe={true} />
          </mesh>
        ))}
      </group>

      {/* Center spokes */}
      <group ref={spokesRef}>
        {spokes.map((spoke, i) => (
          <mesh key={`spoke-${i}`} rotation={spoke.rotation}>
            <boxGeometry args={[1.6, 0.1, 0.05]} />
            <meshBasicMaterial color="#e5e7eb" wireframe={true} />
          </mesh>
        ))}
      </group>

      {/* Turbine blades */}
      <group ref={bladesRef}>
        {blades.map((blade, index) => (
          <mesh key={index} geometry={bladeGeometry} position={blade.position} rotation={blade.rotation}>
            <meshBasicMaterial color="#e5e7eb" wireframe={true} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function ResponsiveCamera() {
  const { camera, viewport } = useThree()

  useEffect(() => {
    const isMobile = viewport.width < 4
    const isTablet = viewport.width >= 4 && viewport.width < 8

    if (isMobile) {
      // Closer camera for mobile to see disassembled parts better
      camera.position.set(6, 4.5, 6)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 70
        camera.updateProjectionMatrix()
      }
    } else if (isTablet) {
      camera.position.set(5.5, 4, 5.5)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 65
        camera.updateProjectionMatrix()
      }
    } else {
      camera.position.set(5, 3.5, 5)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 60
        camera.updateProjectionMatrix()
      }
    }
  }, [camera, viewport.width])

  return null
}

export default function TurbineWheel3D({ scrollProgress, rotationSpeed, onPartPositionsUpdate }: TurbineWheelProps) {
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
        position: [4, 3.5, 4],
        fov: 60,
      }}
   gl={{
  powerPreference: "high-performance", // Requests GPU acceleration if available
  antialias: false,                    // Reduces GPU load
  alpha: true,                        // Saves memory and avoids blending costs
  depth: true,                         // Needed for 3D (can be false if only 2D)
  stencil: false,                      // Disabling improves performance
  failIfMajorPerformanceCaveat: true,  // Prevents fallback to super-low-power modes
  preserveDrawingBuffer: false,        // Faster rendering (unless you capture frames)
}}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
    >
      <ResponsiveCamera />
      <TurbineWheel
        scrollProgress={scrollProgress}
        rotationSpeed={rotationSpeed}
        onPartPositionsUpdate={onPartPositionsUpdate}
      />
    </Canvas>
  )
}

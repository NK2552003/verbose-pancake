"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface HotAirBalloonProps {
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

// Cloud component
function Cloud({ position, scale = 1, opacity = 0.8, scrollProgress }: { 
  position: [number, number, number]; 
  scale?: number; 
  opacity?: number;
  scrollProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Cloud fade in animation when free floating starts (0.66+)
    let cloudOpacity = 0
    if (scrollProgress > 0.66) {
      const fadeProgress = (scrollProgress - 0.66) / 0.34
      cloudOpacity = easeInOutCubic(fadeProgress) * opacity
    }
    
    // Update opacity for all meshes in the cloud
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshBasicMaterial
        material.opacity = cloudOpacity * (material.userData?.baseOpacity || 1)
      }
    })
    
    // Gentle floating motion
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2
    groupRef.current.position.x = position[0] + Math.cos(time * 0.3) * 0.1
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main cloud spheres */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0}
          userData={{ baseOpacity: 1 }}
        />
      </mesh>
      <mesh position={[-0.8, -0.2, 0.3]}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0}
          userData={{ baseOpacity: 0.8 }}
        />
      </mesh>
      <mesh position={[0.7, -0.1, -0.2]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0}
          userData={{ baseOpacity: 0.9 }}
        />
      </mesh>
      <mesh position={[0.3, 0.6, 0.1]}>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0}
          userData={{ baseOpacity: 0.7 }}
        />
      </mesh>
      <mesh position={[-0.4, 0.4, -0.3]}>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0}
          userData={{ baseOpacity: 0.6 }}
        />
      </mesh>
    </group>
  )
}

// Hot air balloon envelope (main balloon)
function BalloonEnvelope({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    
    // Calculate inflation progress (0-0.33: inflate)
    let inflationProgress = 0
    if (scrollProgress <= 0.33) {
      inflationProgress = easeOutElastic(scrollProgress / 0.33)
    } else {
      inflationProgress = 1
    }

    // Calculate lift progress (0.33-0.66: tethered float)
    let liftProgress = 0
    if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
      liftProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress > 0.66) {
      liftProgress = 1
    }

    // Calculate free float progress (0.66-1.0: free floating)
    let freeFloatProgress = 0
    if (scrollProgress > 0.66) {
      freeFloatProgress = easeInOutQuart((scrollProgress - 0.66) / 0.34)
    }

    // Scale based on inflation
    const balloonScale = 0.3 + (inflationProgress * 0.7) // Start small, grow to full size
    groupRef.current.scale.setScalar(balloonScale)

    // Position: keep everything centered and visible
    const baseY = -2.5 // Ground level (higher to stay in view)
    const tetheredY = 1 // Tethered height
    const freeY = 2 // Free floating height (not too high)

    let targetY = baseY
    if (liftProgress > 0) {
      targetY = THREE.MathUtils.lerp(baseY, tetheredY, liftProgress)
    }
    if (freeFloatProgress > 0) {
      targetY = THREE.MathUtils.lerp(tetheredY, freeY, freeFloatProgress)
    }

    // Apply spring physics for smooth movement
    const springY = springAnimation(groupRef.current.position.y, targetY, springState.current.velocity.y, 0.08, 0.85)
    groupRef.current.position.y = springY.position
    springState.current.velocity.y = springY.velocity

    // Add floating animation when in the sky
    if (freeFloatProgress > 0) {
      groupRef.current.position.y += Math.sin(animationTime * 1.2) * 0.2 * freeFloatProgress
      groupRef.current.position.x = Math.cos(animationTime * 0.8) * 0.15 * freeFloatProgress
      groupRef.current.rotation.z = Math.sin(animationTime * 0.6) * 0.03 * freeFloatProgress
    }

    // Gentle sway when tethered
    if (liftProgress > 0 && freeFloatProgress === 0) {
      groupRef.current.position.x = Math.sin(animationTime * 1.5) * 0.08 * liftProgress
      groupRef.current.rotation.z = Math.sin(animationTime * 2) * 0.02 * liftProgress
    }
  })

  return (
    <group ref={groupRef} userData={{ part: "envelope" }}>
      {/* Main balloon envelope - starts deflated */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
        <meshBasicMaterial color="#ff6b6b" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Balloon top section */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshBasicMaterial color="#ff8e8e" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Gore lines (balloon segments) */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 2.5
        const z = Math.sin(angle) * 2.5
        return (
          <mesh key={i} position={[x * 0.8, 0, z * 0.8]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.05, 4, 0.05]} />
            <meshBasicMaterial color="#cc5555" wireframe transparent opacity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

// Basket component
function Basket({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  useFrame((state) => {
    if (!meshRef.current) return

    const animationTime = state.clock.elapsedTime
    
    // Calculate lift progress (0.33-0.66: tethered float)
    let liftProgress = 0
    if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
      liftProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress > 0.66) {
      liftProgress = 1
    }

    // Calculate free float progress (0.66-1.0: free floating)
    let freeFloatProgress = 0
    if (scrollProgress > 0.66) {
      freeFloatProgress = easeInOutQuart((scrollProgress - 0.66) / 0.34)
    }

    // Position: keep basket visible and centered
    const baseY = -5 // Ground level (higher to stay in view)
    const tetheredY = -2.5 // Tethered height
    const freeY = -1.5 // Free floating height

    let targetY = baseY
    if (liftProgress > 0) {
      targetY = THREE.MathUtils.lerp(baseY, tetheredY, liftProgress)
    }
    if (freeFloatProgress > 0) {
      targetY = THREE.MathUtils.lerp(tetheredY, freeY, freeFloatProgress)
    }

    // Apply spring physics
    const springY = springAnimation(meshRef.current.position.y, targetY, springState.current.velocity.y, 0.08, 0.82)
    meshRef.current.position.y = springY.position
    springState.current.velocity.y = springY.velocity

    // Add swaying motion when floating
    if (freeFloatProgress > 0) {
      meshRef.current.position.y += Math.sin(animationTime * 1.2) * 0.1 * freeFloatProgress
      meshRef.current.position.x = Math.cos(animationTime * 0.8) * 0.08 * freeFloatProgress
      meshRef.current.rotation.x = Math.sin(animationTime * 1.5) * 0.03 * freeFloatProgress
    }

    // Gentle sway when tethered
    if (liftProgress > 0 && freeFloatProgress === 0) {
      meshRef.current.position.x = Math.sin(animationTime * 1.5) * 0.06 * liftProgress
      meshRef.current.rotation.x = Math.sin(animationTime * 2) * 0.02 * liftProgress
    }
  })

  return (
    <group ref={meshRef} userData={{ part: "basket" }}>
      {/* Main basket */}
      <mesh>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshBasicMaterial color="#8b4513" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Basket rim */}
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.85, 0.05, 8, 16]} />
        <meshBasicMaterial color="#654321" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Basket weave pattern */}
      {Array.from({ length: 4 }, (_, i) => {
        const positions = [
          [0.75, 0, 0], [-0.75, 0, 0], [0, 0, 0.75], [0, 0, -0.75]
        ] as [number, number, number][]
        const rotations = [
          [0, 0, Math.PI / 2], [0, 0, Math.PI / 2], [Math.PI / 2, 0, 0], [Math.PI / 2, 0, 0]
        ] as [number, number, number][]
        
        return (
          <mesh key={i} position={positions[i]} rotation={rotations[i]}>
            <boxGeometry args={[0.05, 0.8, 0.05]} />
            <meshBasicMaterial color="#a0522d" wireframe transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// Burner system
function BurnerSystem({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const flameRefs = useRef<THREE.Mesh[]>([])
  const springState = useRef({ 
    position: { x: 0, y: 0, z: 0 }, 
    velocity: { x: 0, y: 0, z: 0 }
  })

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    
    // Calculate lift progress (0.33-0.66: tethered float)
    let liftProgress = 0
    if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
      liftProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress > 0.66) {
      liftProgress = 1
    }

    // Calculate free float progress (0.66-1.0: free floating)
    let freeFloatProgress = 0
    if (scrollProgress > 0.66) {
      freeFloatProgress = easeInOutQuart((scrollProgress - 0.66) / 0.34)
    }

    // Position: keep burner system visible
    const baseY = -3.5 // Ground level (higher to stay in view)
    const tetheredY = -0.5 // Tethered height
    const freeY = 0.5 // Free floating height

    let targetY = baseY
    if (liftProgress > 0) {
      targetY = THREE.MathUtils.lerp(baseY, tetheredY, liftProgress)
    }
    if (freeFloatProgress > 0) {
      targetY = THREE.MathUtils.lerp(tetheredY, freeY, freeFloatProgress)
    }

    // Apply spring physics
    const springY = springAnimation(groupRef.current.position.y, targetY, springState.current.velocity.y, 0.1, 0.88)
    groupRef.current.position.y = springY.position
    springState.current.velocity.y = springY.velocity

    // Animate flames with more intensity during inflation and floating
    const flameIntensity = scrollProgress > 0.1 ? 1 : 0
    flameRefs.current.forEach((flame, index) => {
      if (flame && flame.material) {
        const offset = index * 0.3
        flame.scale.y = (0.5 + Math.sin(animationTime * 6 + offset) * 0.4) * flameIntensity
        flame.scale.x = (0.8 + Math.cos(animationTime * 8 + offset) * 0.2) * flameIntensity
        
        const baseOpacity = flameIntensity * 0.8
        const material = flame.material as THREE.Material
        if ('opacity' in material) {
          material.opacity = baseOpacity + Math.sin(animationTime * 10 + offset) * 0.3 * flameIntensity
        }
      }
    })

    // Add floating motion when in sky
    if (freeFloatProgress > 0) {
      groupRef.current.position.y += Math.sin(animationTime * 1.2) * 0.08 * freeFloatProgress
      groupRef.current.position.x = Math.cos(animationTime * 0.8) * 0.04 * freeFloatProgress
    }
  })

  return (
    <group ref={groupRef} userData={{ part: "burner" }}>
      {/* Main burner assembly */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.6, 8]} />
        <meshBasicMaterial color="#333333" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Burner nozzles */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * 0.25
        const z = Math.sin(angle) * 0.25
        return (
          <mesh key={i} position={[x, -0.1, z]}>
            <cylinderGeometry args={[0.05, 0.08, 0.2, 6]} />
            <meshBasicMaterial color="#666666" wireframe transparent opacity={0.7} />
          </mesh>
        )
      })}

      {/* Main flame */}
      <mesh ref={(el) => el && (flameRefs.current[0] = el)} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshBasicMaterial color="#ff4400" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Pilot light flames */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * 0.25
        const z = Math.sin(angle) * 0.25
        return (
          <mesh
            key={i}
            ref={(el) => el && (flameRefs.current[i + 1] = el)}
            position={[x, 0.4, z]}
          >
            <coneGeometry args={[0.15, 0.6, 6]} />
            <meshBasicMaterial color="#ff6600" wireframe transparent opacity={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

// Support cables/lines
function SupportLines({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const animationTime = state.clock.elapsedTime
    
    // Calculate lift progress (0.33-0.66: tethered float)
    let liftProgress = 0
    if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
      liftProgress = easeInOutCubic((scrollProgress - 0.33) / 0.33)
    } else if (scrollProgress > 0.66) {
      liftProgress = 1
    }

    // Calculate free float progress (0.66-1.0: free floating)
    let freeFloatProgress = 0
    if (scrollProgress > 0.66) {
      freeFloatProgress = easeInOutQuart((scrollProgress - 0.66) / 0.34)
    }

    // Position: keep support lines visible
    const baseY = -3.8 // Ground level (higher to stay in view)
    const tetheredY = -0.8 // Tethered height
    const freeY = 0.2 // Free floating height

    let targetY = baseY
    if (liftProgress > 0) {
      targetY = THREE.MathUtils.lerp(baseY, tetheredY, liftProgress)
    }
    if (freeFloatProgress > 0) {
      targetY = THREE.MathUtils.lerp(tetheredY, freeY, freeFloatProgress)
    }

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08)

    // Add gentle swaying to support lines
    if (liftProgress > 0) {
      groupRef.current.children.forEach((line, index) => {
        line.rotation.z = Math.sin(animationTime * 1.5 + index * 0.3) * 0.02 * liftProgress
        if (freeFloatProgress > 0) {
          line.rotation.z += Math.sin(animationTime * 1.2 + index * 0.5) * 0.03 * freeFloatProgress
        }
      })
    }
  })

  return (
    <group ref={groupRef} userData={{ part: "support_lines" }}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 1.2
        const z = Math.sin(angle) * 1.2
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.02, 0.02, 2.5, 4]} />
            <meshBasicMaterial color="#666666" wireframe transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// Tether rope
function TetherRope({ scrollProgress }: { scrollProgress: number }) {
  const ropeRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ropeRef.current) return

    // Show rope during tethered phase (0.33-0.66), hide when free floating
    let ropeOpacity = 0
    if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
      const tetheredProgress = (scrollProgress - 0.33) / 0.33
      ropeOpacity = 0.8 * tetheredProgress
    }

    if (ropeRef.current.material && 'opacity' in ropeRef.current.material) {
      ropeRef.current.material.opacity = ropeOpacity
    }
  })

  return (
    <mesh ref={ropeRef} position={[0, -4.5, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
      <meshBasicMaterial color="#8b4513" wireframe transparent opacity={0} />
    </mesh>
  )
}

// Ground reference with fade out animation
function Ground({ scrollProgress }: { scrollProgress: number }) {
  const groundRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!groundRef.current) return

    // Fade out ground when free floating starts (0.66+)
    let groundOpacity = 0.3
    if (scrollProgress > 0.66) {
      const fadeProgress = (scrollProgress - 0.66) / 0.34
      groundOpacity = 0.3 * (1 - easeInOutCubic(fadeProgress))
    }

    if (groundRef.current.material && 'opacity' in groundRef.current.material) {
      groundRef.current.material.opacity = groundOpacity
    }
  })

  return (
    <mesh ref={groundRef} position={[0, -6.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#90EE90" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

// Main hot air balloon assembly
function HotAirBalloon({ scrollProgress, rotationSpeed = 0.002, onPartPositionsUpdate }: HotAirBalloonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport, camera } = useThree()

  // Update part positions for indicators
 const updatePartPositions = () => {
  if (!groupRef.current || !onPartPositionsUpdate) return

  const positions: PartPosition[] = []
  const tempVector = new THREE.Vector3()

  // Map specific parts to their IDs used in timeline
  const partMappings = [
    { selector: '[data-part="envelope"]', id: 'balloon' },
    { selector: '[data-part="basket"]', id: 'basket' },
    { selector: '[data-part="support_lines"]', id: 'rope1' },
    { selector: '[data-part="burner"]', id: 'rope2' }
  ]

  groupRef.current.traverse((child) => {
    const userData = child.userData
    if (userData && userData.part) {
      const mapping = partMappings.find(m => m.selector.includes(userData.part))
      if (mapping) {
        child.getWorldPosition(tempVector)
        tempVector.project(camera)
        
        positions.push({
          id: mapping.id,
          position: tempVector.clone(),
          screenPosition: {
            x: (tempVector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-tempVector.y * 0.5 + 0.5) * window.innerHeight,
          },
        })
      }
    }
  })

  onPartPositionsUpdate(positions)
}


  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle overall rotation
    groupRef.current.rotation.y += rotationSpeed

    updatePartPositions()
  })

  return (
    <group ref={groupRef}>
      <Ground scrollProgress={scrollProgress} />
      <BalloonEnvelope scrollProgress={scrollProgress} />
      <Basket scrollProgress={scrollProgress} />
      <BurnerSystem scrollProgress={scrollProgress} />
      <SupportLines scrollProgress={scrollProgress} />
      <TetherRope scrollProgress={scrollProgress} />
      
      {/* Clouds with fade in animation */}
      <Cloud position={[-6, 3, -2]} scale={1.2} opacity={0.6} scrollProgress={scrollProgress} />
      <Cloud position={[7, 2.5, -3]} scale={1.0} opacity={0.5} scrollProgress={scrollProgress} />
      <Cloud position={[2, 4, 4]} scale={0.8} opacity={0.4} scrollProgress={scrollProgress} />
    </group>
  )
}

function ResponsiveCamera() {
  const { camera, viewport } = useThree()

  useEffect(() => {
    const isMobile = viewport.width < 4
    const isTablet = viewport.width >= 4 && viewport.width < 8

    if (isMobile) {
      camera.position.set(8, 0, 8)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 70
        camera.updateProjectionMatrix()
      }
    } else if (isTablet) {
      camera.position.set(10, 1, 10)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 65
        camera.updateProjectionMatrix()
      }
    } else {
      camera.position.set(12, 2, 12)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 60
        camera.updateProjectionMatrix()
      }
    }
    
    // Camera looks at center of action
    camera.lookAt(0, -1, 0)
  }, [camera, Math.floor(viewport.width / 2)])

  return null
}
   
// Scene component
function Scene({ scrollProgress, rotationSpeed, onPartPositionsUpdate }: HotAirBalloonProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffeeaa" />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#aaccff" />
      <ResponsiveCamera />
      <HotAirBalloon 
        scrollProgress={scrollProgress} 
        rotationSpeed={rotationSpeed}
        onPartPositionsUpdate={onPartPositionsUpdate}
      />
    </>
  )
}

export default function HotAirBalloonComponent({ scrollProgress, rotationSpeed = 0.002, onPartPositionsUpdate }: HotAirBalloonProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-transparent" />
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [12, 2, 12],
          fov: 60,
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
        resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
      >
        <Scene 
          scrollProgress={scrollProgress} 
          rotationSpeed={rotationSpeed}
          onPartPositionsUpdate={onPartPositionsUpdate}
        />
      </Canvas>
    </div>
  )
}
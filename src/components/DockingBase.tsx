"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DockingBaseProps {
  scrollProgress: number; // 0 to 1
  position?: [number, number, number];
  isTerminal?: boolean;  // If true, this is the contact section base (locks near scroll = 1). Otherwise, locks near scroll = 0.
}

export default function DockingBase({ scrollProgress, position = [0, 0, 0], isTerminal = false }: DockingBaseProps) {
  const leftClampRef = useRef<THREE.Mesh>(null);
  const rightClampRef = useRef<THREE.Mesh>(null);
  const ledGreenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ledRedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Determine locking state based on scroll progress
  // isLocked ranges from 0 (fully open) to 1 (fully locked)
  const isLockedVal = useMemo(() => {
    if (!isTerminal) {
      // Hero section: locked at scroll = 0, unlocks as user scrolls past 0.05
      if (scrollProgress <= 0.01) return 1.0;
      if (scrollProgress >= 0.06) return 0.0;
      return 1.0 - (scrollProgress - 0.01) / 0.05;
    } else {
      // Contact section: unlocked, locks as user scrolls past 0.94 to 1.0
      if (scrollProgress >= 0.99) return 1.0;
      if (scrollProgress <= 0.94) return 0.0;
      return (scrollProgress - 0.94) / 0.05;
    }
  }, [scrollProgress, isTerminal]);

  useFrame(() => {
    // 1. Rotate side clamp arms to simulate mechanical locking
    // Clamp arm pivots: rotate on Z/Y axis. Max rotation: ~35 degrees (0.6 radians)
    const clampAngle = (1.0 - isLockedVal) * 0.6;

    if (leftClampRef.current) {
      leftClampRef.current.rotation.z = clampAngle; // swing open outwards
    }
    if (rightClampRef.current) {
      rightClampRef.current.rotation.z = -clampAngle; // swing open outwards in opposite direction
    }

    // 2. Animate status LED intensities based on lock state
    if (ledGreenMatRef.current && ledRedMatRef.current) {
      if (isLockedVal >= 0.95) {
        // Locked: Green LED glows bright, Red LED is off
        ledGreenMatRef.current.emissiveIntensity = 2.0;
        ledRedMatRef.current.emissiveIntensity = 0.0;
      } else if (isLockedVal <= 0.05) {
        // Unlocked: Green LED is off, Red LED is off or glowing dim
        ledGreenMatRef.current.emissiveIntensity = 0.0;
        ledRedMatRef.current.emissiveIntensity = 0.5;
      } else {
        // Transitioning: red light flashes/glows
        ledGreenMatRef.current.emissiveIntensity = 0.0;
        ledRedMatRef.current.emissiveIntensity = 2.0;
      }
    }
  });

  const materials = useMemo(() => {
    return {
      heavyMetal: new THREE.MeshStandardMaterial({
        color: "#121215",
        roughness: 0.45,
        metalness: 0.85,
      }),
      matteBlack: new THREE.MeshStandardMaterial({
        color: "#070709",
        roughness: 0.6,
        metalness: 0.2,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#d0d0d5",
        roughness: 0.1,
        metalness: 0.98,
      }),
      redAccent: new THREE.MeshStandardMaterial({
        color: "#880000",
        roughness: 0.3,
        metalness: 0.8,
      }),
      ledRed: new THREE.MeshStandardMaterial({
        color: "#ff0000",
        emissive: "#ff0000",
        emissiveIntensity: 0.0,
      }),
      ledGreen: new THREE.MeshStandardMaterial({
        color: "#00ff33",
        emissive: "#00ff33",
        emissiveIntensity: 0.0,
      }),
    };
  }, []);

  return (
    <group position={position} scale={0.75}>
      {/* 1. Base Platform Plate */}
      <mesh material={materials.heavyMetal} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.15, 1.6]} />
      </mesh>

      {/* Raised side guides */}
      <mesh material={materials.matteBlack} position={[-0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.15, 1.4]} />
      </mesh>
      <mesh material={materials.matteBlack} position={[0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.15, 1.4]} />
      </mesh>

      {/* Central Rail Guides (Slots where camera's rods sit) */}
      <mesh material={materials.chrome} position={[-0.32, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.3, 16]} />
      </mesh>
      <mesh material={materials.chrome} position={[0.32, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.3, 16]} />
      </mesh>

      {/* Red accent alignment indicators */}
      <mesh material={materials.redAccent} position={[0, 0.08, 0.7]}>
        <boxGeometry args={[0.15, 0.02, 0.05]} />
      </mesh>

      {/* 2. Mechanical Locking Clamps (Swing in / out on hinge) */}
      {/* Left Clamping Mechanism */}
      <group position={[-0.55, 0.12, 0]}>
        <mesh ref={leftClampRef} material={materials.heavyMetal} position={[-0.08, 0.12, 0]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.4]} />
        </mesh>
        {/* Hinge Pin */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
          <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
        </mesh>
      </group>

      {/* Right Clamping Mechanism */}
      <group position={[0.55, 0.12, 0]}>
        <mesh ref={rightClampRef} material={materials.heavyMetal} position={[0.08, 0.12, 0]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.4]} />
        </mesh>
        {/* Hinge Pin */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
          <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
        </mesh>
      </group>

      {/* 3. Locking Status LED Lights */}
      {/* Red LED */}
      <mesh position={[-0.6, 0.24, -0.6]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <primitive object={materials.ledRed} ref={ledRedMatRef} attach="material" />
      </mesh>
      
      {/* Green LED */}
      <mesh position={[0.6, 0.24, -0.6]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <primitive object={materials.ledGreen} ref={ledGreenMatRef} attach="material" />
      </mesh>

      {/* Stylized base labels/markings */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 1.4]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
